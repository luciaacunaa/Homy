from flask import Flask, g, jsonify
import mysql.connector, os
from flask import Flask, g, request, jsonify
from flask_cors import CORS 
from dotenv import load_dotenv
from datetime import datetime
import mercadopago
# Agrega credenciales
sdk = mercadopago.SDK("APP_USR-4690612447740135-100209-172bfed90c4a08167a042ed317ae801b-1260263239")
load_dotenv(".env/paty.env")  # Carga las variables de entorno desde el archivo .env
secret_key = os.getenv("SECRET_KEY")


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

app = Flask(__name__)

CORS(app)  # Habilita CORS para todas las rutas de todos los orígenes

app.teardown_appcontext(cerrarConexion)
CORS(app)  # permite peticiones desde React

@app.route('/api/products', methods=['GET']) # Listar productos -- Lu
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


    # Busca el usuario por email y contraseña --
    cursor.execute(
        "SELECT * FROM customers WHERE customers_email = %s AND customers_password = %s;",
        (email, password)
    )
    user = cursor.fetchone()
    cursor.close()

    if user:
        return jsonify({"message": "Login exitoso", "user": user}), 200
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401

products = []
@app.route('/api/products', methods=['POST']) # Agregar producto   -- Lu
def agregar_producto():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    
    if not name or not price:
        return jsonify({'error': 'Datos faltantes'}), 400
    
    product ={
        'Nombre': name,
        'Precio': price}

    products.append(product) 
    return jsonify({'mensaje': 'El producto fue agregado', 'Producto': product}), 201





@app.route('/api/category', methods=['GET']) # Abi
def list_categories():
    db = abrirConexion()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM category;")
    categories = cursor.fetchall()
    cursor.close()
    return jsonify(categories)


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
    receipt = orders
    cursor.close()
    return jsonify(receipt)



# SDK de Mercado Pago, PROBANDO MERCADOPAGO -- maryyy
# Crea un ítem en la preferencia
#ruta para crear la preferencia de pago

@app.route('/crear_preferencia', methods=['POST'])
def crear_preferencia(): 
    try:
        preference_data = {
            "items": [
                {
                    "title": "Mi producto",
                    "quantity": 1,
                    "unit_price": 75.76,
                }
            ]
        }

        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]

        # Devuelvo el ID de la preferencia para usarlo en el frontend
        return jsonify({"id": preference.get("id")})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Todo tien que ir arriba de este if
if __name__ == "__main__":
    app.run(debug=True)  # Totalmente necesario correr la pag con flask run --debug
                         # para que refresque la pag y cambie los datos.



