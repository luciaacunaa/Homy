from flask import Flask
import mysql.connector
from flask import Flask, g, request, jsonify


def abrirConexion():
    if 'db' not in g:
        g.db = mysql.connector.connect(
    host="10.9.120.5",     # ip del serv
    port=3306,            # puerto (3306 por defecto)
    user="homy",    # php
    password="homy1234", 
    database="homy" )
        
    return g.db

def cerrarConexion(e=None):
    db = g.pop('db', None)
    if db is not None and db.is_connected():
        db.close()

app = Flask(__name__)
app.teardown_appcontext(cerrarConexion)

@app.route('/api/products', methods=['GET'])
def list_products():
    db = abrirConexion()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products;")
    products = cursor.fetchall()
    cursor.close()
    return jsonify(products)