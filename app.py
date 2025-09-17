from flask import Flask, g, jsonify
import mysql.connector
from flask_cors import CORS  # Importa flask-cors

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

if __name__ == '__main__':
    app.run(debug=True)
