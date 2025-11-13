from flask import Flask, request, jsonify

app = Flask(__name__)

#  Base simulada de productos
PRODUCTS = [
    {"products_id": 1, "products_name": "Silla", "price": 2500},
    {"products_id": 2, "products_name": "Mesa", "price": 4500},
    {"products_id": 3, "products_name": "Comoda", "price": 1200},
]

#  Endpoint para calcular el total del carrito
@app.route("/api/receipt/usuario", methods=["POST"])
def total_compra_seleccionados():
    data = request.get_json()
    productos = data.get("productos")

    if not productos or not isinstance(productos, list):
        return jsonify({"error": "Debes enviar una lista de productos"}), 400

    total = 0
    for item in productos:
        pid = item.get("products_id")
        cantidad = item.get("cantidad", 1)
        producto = next((p for p in PRODUCTS if p["products_id"] == pid), None)
        if producto:
            total += producto["price"] * cantidad
        else:
            return jsonify({"error": f"Producto con id {pid} no encontrado"}), 404

    return jsonify({"total_compra": total}), 200


#  Endpoint opcional: ver los productos simulados
@app.route("/api/products", methods=["GET"])
def list_products():
    return jsonify(PRODUCTS), 200


def create_app():
    return app


if __name__ == "__main__":
    app.run(debug=True)
