def test_server_datetime(client):#Verifica que /api/server_datetime devuelva la fecha y hora
    response = client.get("/api/server_datetime")
    assert response.status_code == 200
    data = response.get_json()
    assert "datetime" in data
