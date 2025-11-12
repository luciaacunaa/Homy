import json

def test_usuario_inexistente(client):
    data = {
        "email": "noexiste@ejemplo.com",
        "password": "1234"
    }
    response = client.post("/login", data=json.dumps(data), content_type="application/json")
    assert response.status_code == 401  
    json_data = response.get_json()
    assert "error" in json_data
    assert json_data["error"] == "Credenciales incorrectas"
