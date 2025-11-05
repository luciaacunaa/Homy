def test_register_user(client):
    new_user = {
        "email": "test@example.com",
        "password": "123456",
        "customers_name": "Test",
        "customers_lastname": "User",
        "customers_address": "123 Fake St"
    }
    response = client.post("/api/register", json=new_user)
    assert response.status_code in (201, 409)  # 409 si el email ya está registrado conflicto
    data = response.get_json()
    assert "message" in data or "error" in data


def test_login_user(client):
    login_data = {
        "email": "test@example.com",
        "password": "123456"
    }
    response = client.post("/login", json=login_data)
    assert response.status_code in (200, 401)
    data = response.get_json()
    assert "message" in data or "error" in data
