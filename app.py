import mysql.connector, os
from flask import Flask, g, request, jsonify
from flask_cors import CORS 
from dotenv import load_dotenv
from datetime import datetime
from flask import send_file
from io import BytesIO
import mercadopago   
from functools import wraps


# Agrega credenciales
sdk = mercadopago.SDK("APP_USR-7798932195313209-100910-463a1fb5da375d86b110528f4d743463-2915372376")
load_dotenv(".env/paty.env")  # Carga las variables de entorno desde el archivo .env
secret_key = os.getenv("SECRET_KEY")
app = Flask(__name__)

def abrirConexion():
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host=os.getenv("DB_HOST"),     # IP del servidor
            port=int(os.getenv("DB_PORT")),             # Puerto (3306 por defecto)
            user=os.getenv("DB_USER"),           # Usuario
            password=os.getenv("DB_PASSWORD"),   # Contraseña
            database=os.getenv("DB_NAME")        # Base de datos
        )
    return g.db

def cerrarConexion(e=None):
    db = g.pop('db', None)
    if db is not None and db.is_connected():
        db.close()



CORS (app, resources={r"/*": {"origins": "*"}}, supports_credentials=True) # Habilita CORS para todas las rutas de todos los orígenes
app.teardown_appcontext(cerrarConexion)


@app.route('/products', methods=['GET']) # Listar productos -- Lu
def list_products():
    db = abrirConexion()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products;")
    products = cursor.fetchall()
    cursor.close()
    return jsonify(products)



# Ruta para login: valida usuario y contraseña -- Mary
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Faltan datos"}), 400

    db = abrirConexion()
    cursor = db.cursor(dictionary=True)

    # Busca el usuario por email y contraseña y obtiene el rol (is_admin)
    cursor.execute(
        "SELECT * FROM customers WHERE customers_email = %s AND customers_password = %s;",
        (email, password)
    )
    user = cursor.fetchone()
    cursor.close()

    if user:
        # Verificamos si el usuario es admin: solo consideramos admin al email específico
        is_admin = True if user.get('customers_email') == 'adminhomy@gmail.com' else False

        # Nota: no confiamos en un campo enviado por el frontend; determinamos admin
        # desde la información guardada (email). Si en la DB existe una columna is_admin
        # puedes migrar esta lógica, pero por ahora la regla es el email fijo.
        # Devolveremos el rol del usuario junto con los demás datos del usuario
        return jsonify({
            "message": "Login exitoso",
            "user": {
                "email": user['customers_email'],
                "name": user['customers_name'],
                "lastname": user['customers_lastname'],
                "address": user['customers_address'],
                "is_admin": is_admin
            }
        }), 200
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401


products = []

@app.route('/api/products', methods=['POST']) # Agregar producto   -- Lu
def agregar_producto():
    data = request.get_json()
    products_name = data.get('products_name')
    price = data.get('price')
    unit = data.get('unit')
    payment_id = data.get('payment_id')

    # Validación de campos obligatorios
    if not products_name or price is None or payment_id is None:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400

    db = abrirConexion()
    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO products (products_name, price, unit, payment_id) VALUES (%s, %s, %s, %s);",
            (products_name, price, unit, payment_id)
        )
        db.commit()
        product_id = cursor.lastrowid
        cursor.close()
        return jsonify({
            'mensaje': 'El producto fue agregado',
            'Producto': {
                'products_id': product_id,
                'products_name': products_name,
                'price': price,
                'unit': unit,
                'payment_id': payment_id
            }
        }), 201
    except Exception as e:
        db.rollback()
        cursor.close()
        return jsonify({'error': str(e)}), 500



@app.route('/api/category/<int:category_id>', methods=['GET']) #abril
def list_categories(category_id):
   try:
       # Lógica para obtener las categorías utilizando category_id
       db = abrirConexion()  # Cambié get_db_connection() por abrirConexion()
       cursor = db.cursor(dictionary=True)
       cursor.execute("SELECT category_name FROM category WHERE category_id = %s", (category_id,))
       category = cursor.fetchone()  # Obtén una sola categoría
       cursor.close()
       db.close()


       if category is None:
           return jsonify({"message": "Category not found"}), 404
      
       return jsonify(category)
   except Exception as e:
       return jsonify({"error": str(e)}), 500




@app.route('/api/categoria_con_productos', methods=['GET'])  # abril
def categoria_con_productos():
    try:
        # Establece la conexión a la base de datos
        db = abrirConexion()
        cursor = db.cursor(dictionary=True)
        
        # Ejecuta la consulta SQL que une las categorías y los productos
        cursor.execute("""
           SELECT 
                c.category_id,
                c.category_name,
                p.products_id,
                p.products_name,
                p.price,
                i.image_url
            FROM category c
            LEFT JOIN products p ON p.category_id = c.category_id
            LEFT JOIN images i ON p.products_id = i.products_id
            ORDER BY c.category_name ASC, p.products_name ASC;
        """)
        
        # Obtén todos los resultados de la consulta
        results = cursor.fetchall()
        
        cursor.close()
        db.close()
        
        # Si no se encontraron resultados
        if not results:
            return jsonify({"message": "No se encontró ninguna categoría con productos"}), 404
        
    
        return jsonify(results), 200

    except Exception as e:
        # Maneja cualquier error y devuelve un mensaje adecuado
        return jsonify({"error": str(e)}), 500



@app.route('/api/categorias', methods=['GET'])
def obtener_categorias_con_productos():
    try:
        db = abrirConexion()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                c.category_id,
                c.category_name,
                p.products_id,
                p.products_name,
                p.price,
                i.image_url
            FROM category c
            LEFT JOIN products p ON p.category_id = c.category_id
            LEFT JOIN images i ON p.products_id = i.products_id
            ORDER BY c.category_name ASC, p.products_name ASC;
        """)

        data = cursor.fetchall()

        # Agregar URL completa a las imágenes (opcional)
        for item in data:
            if item.get('image_url'):
                item['image_url'] = f"http://127.0.0.1:5000/{item['image_url']}"

        cursor.close()
        db.close()
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




















@app.route('/api/images/<int:product_id>', methods=['GET'])
def get_image(product_id):
    try:
        db = abrirConexion()
        cursor = db.cursor(dictionary=True)
        
        # Ejecuta la consulta
        cursor.execute("SELECT image_url FROM images WHERE products_id = %s", (product_id,))
        result = cursor.fetchone()

        # Limpieza de resultados pendientes (soluciona "Unread result found")
        cursor.fetchall()  # Limpia cualquier fila restante aunque no haya más
        cursor.close()
        db.close()

        # Si no hay resultado
        if not result or not result.get('image_url'):
            return jsonify({'error': 'Image not found'}), 404

        # Limpia cualquier barra inicial del path
        image_url = result['image_url'].lstrip('/')

        # Devuelve solo el path limpio
        return jsonify({'image_url': image_url}), 200

    except Exception as e:
        # En caso de error, devuelve el mensaje para debug
        return jsonify({'error': str(e)}), 500

    
@app.route('/api/products/category/<int:category_id>', methods=['GET']) #abril
def get_products_by_category(category_id):
    try:
        db = abrirConexion()
        cursor = db.cursor(dictionary=True)
        query = """
         SELECT 
                 p.products_id,
                 p.products_name,
            c.category_name
                FROM products p
                JOIN category c
            ON p.category_id = c.category_id; 
        """
        cursor.execute(query, (category_id,))
        products = cursor.fetchall()
        cursor.close()
        db.close()

        for prod in products:
            if prod['image_url']:
                prod['image_url'] = f"http://127.0.0.1:5000/{prod['image_url']}"

        if not products:
            return jsonify({"message": "No hay productos en esta categoría"}), 404

        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500





@app.route('/api/products', methods=['GET']) #abril, maryy
def get_products():
    try:
        db = abrirConexion()
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT 
                p.products_id,
                p.products_name,
                p.price,
                p.unit,
                i.image_url
            FROM products p
            LEFT JOIN images i ON p.products_id = i.products_id;
        """
        cursor.execute(query)
        products = cursor.fetchall()
        cursor.close()
        db.close()

        # Si las imágenes están guardadas como nombre o ruta parcial, agregá el prefijo
        for prod in products:
            if prod['image_url']:
                prod['image_url'] = f"http://127.0.0.1:5000/{prod['image_url']}"

        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/products/search', methods=['GET']) #Abril 
def search_products():
    search_query = request.args.get('query', '')  # Obtener el término de búsqueda
    try:
        db = abrirConexion()
        cursor = db.cursor(dictionary=True)
        
        query = """
            SELECT products_id, products_name, price
            FROM products
            WHERE products_name LIKE %s
        """
        cursor.execute(query, ('%' + search_query + '%',))
        products = cursor.fetchall()
        cursor.close()
        db.close()

        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




# Nuevo endpoint para listar todas las categorías (id y nombre)
@app.route('/api/categories', methods=['GET'])
def list_all_categories():
    try:
        db = abrirConexion()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT category_id, category_name FROM category ORDER BY category_name;")
        categories = cursor.fetchall()
        cursor.close()
        db.close()

        return jsonify(categories)
    except Exception as e:
        return jsonify({"error": str(e)}), 500





# Ruta para actualizar un producto, endpoint PUT -- Mary

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    products_name = data.get('products_name')
    price = data.get('price')

    if not products_name or price is None: 
        return jsonify({'error': 'Faltan datos'}), 400

    db = abrirConexion()
    cursor = db.cursor()

    cursor.execute(
        "UPDATE products SET products_name = %s, price = %s WHERE products_id = %s;",
        (products_name, price, product_id)
    )
    db.commit()
    updated = cursor.rowcount
    cursor.close()

    if updated == 0:
        return jsonify({'message': f'Producto {product_id} no encontrado'}), 404
    else:
        return jsonify({'message': f'Producto {product_id} actualizado correctamente'})


# Ruta para el total, endpoint GET (esto de parte del usuario) -- Mary
@app.route('/api/receipt/usuario', methods=['POST'])
def total_compra_seleccionados():
    data = request.get_json()
    productos = data.get('productos')  # lista de objetos: {products_id, cantidad}

    if not productos or not isinstance(productos, list):
        return jsonify({'error': 'Debes enviar una lista de productos'}), 400

    productos_ids = [p['products_id'] for p in productos]
    cantidades = {p['products_id']: p.get('cantidad', 1) for p in productos}

    db = abrirConexion()
    cursor = db.cursor(dictionary=True)
    format_strings = ','.join(['%s'] * len(productos_ids))
    cursor.execute(f"SELECT products_id, price FROM products WHERE products_id IN ({format_strings});", tuple(productos_ids))
    productos_db = cursor.fetchall()
    cursor.close()

    total = 0
    for producto in productos_db:
        pid = producto['products_id']
        cantidad = cantidades.get(pid, 1)
        total += producto['price'] * cantidad

    return jsonify({"total_compra": total})



# Nueva ruta para obtener la fecha y hora del servidor, [estamos probando] -- Lu y Mary
@app.route('/api/server_datetime', methods=['GET'])
def server_datetime():
    now = datetime.now()
    return jsonify({"datetime": now.strftime("%Y-%m-%d %H:%M:%S")})


# Ruta para conectar el backend con el frontend (Register) -- Lu
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    customers_name = data.get('customers_name')
    customers_lastname = data.get('customers_lastname')
    customers_address = data.get('customers_address')

    if not email or not password or not customers_name or not customers_lastname or not customers_address:
        return jsonify({'error': 'Faltan datos'}), 400

    db = abrirConexion()
    cursor = db.cursor()

    # si el mail existe, no deja registrarse
    cursor.execute("SELECT * FROM customers WHERE customers_email = %s;", (email,))
    if cursor.fetchone():
        cursor.close()
        return jsonify({'error': 'El email ya está registrado'}), 409

    # inserta el nuevo usuario
    cursor.execute(
        "INSERT INTO customers (customers_email, customers_password, customers_name, customers_lastname, customers_address) VALUES (%s, %s, %s, %s, %s);",
        (email, password, customers_name, customers_lastname, customers_address)
    )
    db.commit()
    cursor.close()

    return jsonify({'message': 'Usuario registrado exitosamente'}), 201

# Endpoint para que el admin obtenga todos los pedidos -mary (preguntar mañana)
@app.route('/api/admin/receipt', methods=['GET'])
def admin_get_orders():
    db = abrirConexion()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM receipt;")
    orders = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(orders)


#endpoint en prueba -mary 
@app.route('/api/receipt', methods=['POST'])
def save_order():
    data = request.get_json()

    db = abrirConexion()
    cursor = db.cursor()

    query = """
    INSERT INTO receipt (customers_name, customers_email, payment, total, date, items)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (
        data.get('buyer_name'),
        data.get('buyer_email'),
        data.get('payment_method'),
        data.get('total'),
        data.get('date'),
        data.get('items')
    )

    cursor.execute(query, values)
    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Pedido guardado correctamente"}), 201


##luci
@app.route('/api/payment', methods=['GET'])
def list_bancos():
    db = abrirConexion()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM payment;")
    bancos = cursor.fetchall()
    cursor.close()
    return jsonify(bancos)
##lo que hace es que llama todos los metodos de pago y las muestra.

@app.route('/api/inventory', methods=['GET'])
def get_inventory_status():
    db = abrirConexion()
    cursor = db.cursor(dictionary=True)

    #obtiene el estado de los productos en inventario
    cursor.execute("""
        SELECT 
            i.inventory_id, 
            i.products_id, 
            i.stock, 
            i.location, 
            i.status_id
        FROM 
            inventory i
        INNER JOIN 
            products p ON i.products_id = p.products_id;
    """)
    inventory = cursor.fetchall()
    cursor.close()
    db.close()

    if not inventory:
        return jsonify({'message': 'No hay productos en inventario'}), 404

    return jsonify(inventory)

@app.route('/api/status', methods=['GET'])
def get_order_status():
    db = abrirConexion()
    cursor = db.cursor(dictionary=True)

    #obteniene el estado del pedido y su descripción
    cursor.execute("""
        SELECT 
            s.status_id, 
            s.status_name, 
            s.description, 
            s.shipping_id, 
            s.inventory_id
        FROM 
            status s;
    """)
    status_data = cursor.fetchall()
    cursor.close()
    db.close()

    if not status_data:
        return jsonify({'message': 'No hay estados de pedidos disponibles'}), 404

    return jsonify(status_data)

@app.route('/api/reviews', methods=['POST']) #maryyy
def add_review():
    #Guardar una nueva opinión
    data = request.get_json()
    customers_name = data.get('customers_name')
    customers_email = data.get('customers_email')
    rating = data.get('rating')
    comment = data.get('comment')

    if not customers_name or not comment:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    db = abrirConexion()
    cursor = db.cursor()

    try:
        cursor.execute("""
            INSERT INTO reviews (customers_name, customers_email, rating, comment)
            VALUES (%s, %s, %s, %s);
        """, (customers_name, customers_email, rating, comment))
        db.commit()
        review_id = cursor.lastrowid
        cursor.close()
        return jsonify({"message": "Opinión guardada correctamente", "review_id": review_id}), 201
    except Exception as e:
        db.rollback()
        cursor.close()
        return jsonify({"error": str(e)}), 500


@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    """Devuelve todas las reseñas ordenadas por fecha (las más recientes primero)."""
    db = abrirConexion()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT review_id, customers_name, customers_email, rating, comment, created_at FROM reviews ORDER BY created_at DESC;"
        )
        reviews = cursor.fetchall()
    except Exception as e:
        cursor.close()
        return jsonify({'error': str(e)}), 500
    cursor.close()
    # Devolver lista (puede estar vacía)
    return jsonify(reviews or [])



# SDK de Mercado Pago, PROBANDO MERCADOPAGO -- maryyy backend
# Crea un ítem en la preferencia
#ruta para crear la preferencia de pago

@app.route("/crear_preferencia", methods=["POST"])
def crear_preferencia():
    try:
        data = request.get_json()
        print("📦 Datos recibidos del frontend:", data)

        title = data.get("title", "Producto genérico")
        quantity = int(data.get("quantity", 1))
        price = float(data.get("price", 0))

        if price <= 0:
            return jsonify({"error": "El precio debe ser mayor a 0"}), 400

        preference_data = {
            "items": [
                {
                    "title": title,
                    "quantity": quantity,
                    "unit_price": price,
                    "currency_id": "ARS"
                }
            ],
           "back_urls": {
        "success": "https://www.tu-sitio/success",
        "failure": "https://www.tu-sitio/failure",
        "pending": "https://www.tu-sitio/pendings"
    },
    "auto_return": "approved"
        }

        preference_response = sdk.preference().create(preference_data)
        print("🧾 Respuesta de MP:", preference_response)

        if "response" not in preference_response or "id" not in preference_response["response"]:
            return jsonify({"error": "Error al crear preferencia", "details": preference_response}), 500

        preference = preference_response["response"]
        return jsonify({"id": preference["id"]})

    except Exception as e:
        print("Error al crear la preferencia:", e)
        return jsonify({"error": str(e)}), 500

def create_app():
    return app


#Todo tien que ir arriba de este if
if __name__ == "__main__":
    app.run(debug=True)  # Totalmente necesario correr la pag con flask run --debug
                         # para que refresque la pag y cambie los datos.



