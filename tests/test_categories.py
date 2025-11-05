def test_lista_categories(client): #Test que lista todas las categorías
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    if data:
        assert "category_id" in data[0]
        assert "category_name" in data[0]
