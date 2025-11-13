import pytest
from carrito_backend import create_app

# Configuración del cliente de pruebas Flask
@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    client = app.test_client()
    yield client



#  TESTS DEL CARRITO


def test_total_compra_valida(client):
    """Calcula el total correctamente con productos válidos"""
    data = {
        "productos": [
            {"products_id": 1, "cantidad": 2},  # 2 x 2500
            {"products_id": 3, "cantidad": 1},  # 1 x 1200
        ]
    }
    response = client.post("/api/receipt/usuario", json=data)
    assert response.status_code == 200
    body = response.get_json()
    assert "total_compra" in body
    assert body["total_compra"] == 6200


def test_total_compra_producto_inexistente(client):
    """Debe fallar si se envía un producto que no existe"""
    data = {"productos": [{"products_id": 99, "cantidad": 1}]}
    response = client.post("/api/receipt/usuario", json=data)
    assert response.status_code == 404
    assert "error" in response.get_json()


def test_total_compra_lista_invalida(client):
    """Debe fallar si productos no es una lista"""
    data = {"productos": "no es una lista"}
    response = client.post("/api/receipt/usuario", json=data)
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_total_compra_faltan_datos(client):
    """Debe fallar si falta el campo productos"""
    response = client.post("/api/receipt/usuario", json={})
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_lista_productos(client):
    """Verifica que la ruta de productos devuelva lista"""
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "products_name" in data[0]


