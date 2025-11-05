def test_obtener_imagenes_url(client):
    product_id = 1  # Asegúrate de que este ID exista en tu base de datos de prueba
    response = client.get(f'/api/images/{product_id}')
    assert response.status_code == 200
    data = response.get_json()
    assert "image_url" in data
    assert isinstance(data["image_url"], str)

