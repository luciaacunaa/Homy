from flask import Flask, g, jsonify
import mysql.connector
from flask import Flask, g, request, jsonify
from flask_cors import CORS 


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


# Ruta para login
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

products = []
@app.route('/api/products', methods=['POST']) # Agregar producto    
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



#Todo tien que ir arriba de este if
if __name__ == "__main__":
    app.run(debug=True)  # Totalmente necesario correr la pag con flask run --debug
                         # para que refresque la pag y cambie los datos.