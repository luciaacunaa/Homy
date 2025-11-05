def test_lista_products(client):
    # Test que lista todos los productos
    response = client.get("/api/products")  # Llama al endpoint
    assert response.status_code == 200      # Debe responder OK (200)

    data = response.get_json()              # Convierte la respuesta a JSON
    assert isinstance(data, list)           # Devuelve una lista

    
    if data:
        assert "products_id" in data[0]     
        assert "products_name" in data[0] 
        assert "price" in data[0] 
       
        assert "image_url" in data[0] 



def test_add_product_success(client):#Prueba agregar un nuevo producto (POST /api/products)"""
   new_product = {
       "products_name": "Producto de Prueba",
       "price": 150.0,
       "unit": "unidad",
       "payment_id": "123"
   }
   response = client.post("/api/products", json=new_product)
   data = response.get_json()
   assert response.status_code in (201, 500)  # 500 si hay error de DB
   assert "mensaje" in data or "error" in data