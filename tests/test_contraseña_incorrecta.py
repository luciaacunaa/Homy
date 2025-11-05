import json

def test_contraseña_incorrecta(client):
    
    # Datos de login incorrectos
    data = {
        "email": "usuario@ejemplo.com",
        "password": "contraseña_incorrecta"
    }

    response = client.post("/login", data=json.dumps(data), content_type="application/json")

    assert response.status_code == 401

    json_data = response.get_json()
    assert "error" in json_data
    assert json_data["error"] == "Credenciales incorrectas"
