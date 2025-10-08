from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

# Conexión a MySQL
db = mysql.connector.connect(
    host="10.9.120.5",
    user="homy",
    password="homy1234",
    database="homy"
)

@app.route("/api/products", methods=["GET"])
def get_productos():
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT products_id, products_name, price FROM products")
        productos = cursor.fetchall()
        return jsonify(productos)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)
