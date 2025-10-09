from flask import Flask, jsonify
import mysql.connector
from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Conexión a MySQL
db = mysql.connector.connect(
    host="10.9.120.5",
    user="homy",
    password="homy1234",
    database="homy"
)


@app.route('/api/products', methods=['GET'])
def get_products():
    """Devuelve productos con un campo image_url (puede ser None)."""
    try:
        cursor = db.cursor(dictionary=True)
        query = (
            "SELECT p.products_id, p.products_name, p.price, "
            "(SELECT image_url FROM images WHERE products_id = p.products_id LIMIT 1) AS image_url "
            "FROM products p"
        )
        cursor.execute(query)
        products = cursor.fetchall()
        cursor.close()
        return jsonify(products)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/images', methods=['POST'])
def add_image():
    data = request.get_json() or {}
    products_id = data.get('products_id')
    image_url = data.get('image_url')

    if not products_id or not image_url:
        return jsonify({'error': 'Faltan datos (products_id o image_url)'}), 400

    try:
        cursor = db.cursor()
        query = "INSERT INTO images (products_id, image_url) VALUES (%s, %s)"
        cursor.execute(query, (products_id, image_url))
        db.commit()
        cursor.close()
        return jsonify({'message': 'Imagen agregada correctamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
    cursor = mysql.connection.cursor()
