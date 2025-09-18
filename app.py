from flask import Flask, g, jsonify
import mysql.connector
from flask import Flask, g, request, jsonify
from flask_cors import CORS 
from datetime import datetime

def abrirConexion():
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host="10.9.120.5",     # IP del servidor
            port=3306,             # Puerto (3306 por defecto)
            user="homy",           # Usuario
            password="homy1234",   # Contraseña
            database="homy"        # Base de datos
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

@app.route('/api/products', methods=['GET'])
def list_products():
    db = abrirConexion()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products;")
    products = cursor.fetchall()
    cursor.close()
    return jsonify(products)

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    db = abrirConexion()
    cursor = db.cursor()
    
    cursor.execute("DELETE FROM products WHERE products_id = %s;", (product_id,))
    db.commit()  # 🔹 importante para que el DELETE se aplique
    
    deleted = cursor.rowcount
    cursor.close()
    
    if deleted == 0:
        return jsonify({'message': f'Producto {product_id} no encontrado'}), 404
    else:
        return jsonify({'message': f'Producto {product_id} eliminado'})
    

# Ruta para login NO LO TOQUEN
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Faltan datos"}), 400

    db = abrirConexion()
    cursor = db.cursor()

    # Guarda login en tabla (asegúrate de tener la tabla usuarios o logins)
    cursor.execute(
        "INSERT INTO customers (email, password) VALUES (%s, %s);",
        (email, password)
    )
    db.commit()

    cursor.close()

    return jsonify({"message": "Login registrado exitosamente"}), 201



@app.route('/api/category', methods=['GET'])
def list_categories():
    cursor = db.cursor(dictionary=True)  
    productos = cursor.fetchall()
    cursor.close()
    return jsonify(category)


if __name__ == "__main__":
    app.run(debug=True)

# Ruta para actualizar un producto, endpoint PUT

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


# Ruta para el total, endpoint GET (esto de parte del usuario)
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


# Nueva ruta para obtener la fecha y hora del servidor, [estamos probando]
@app.route('/api/server_datetime', methods=['GET'])
def server_datetime():
    now = datetime.now()
    return jsonify({"datetime": now.strftime("%Y-%m-%d %H:%M:%S")})

