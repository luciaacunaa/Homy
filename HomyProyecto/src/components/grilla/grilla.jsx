import React, { useEffect, useState } from "react";
import "./grilla.css";

const ProductList = ({ addToCart, removeFromCart, cartItems }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products") 
      .then((res) => res.json())
      .then((data) => {
        const productosConId = data.map((prod) => ({
          ...prod,
          id: prod.products_id,
          name: prod.products_name,
          image_url: `http://127.0.0.1:5000/api/image/${prod.products_id}`
 
        }));
        setProducts(productosConId);
      })
      .catch((err) => console.error("Error al traer productos:", err));
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#48601c" }}>
        Lista de Productos
      </h1>

      <div className="product-container">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              {/* Mostrar la imagen si existe */}
              <img
                src={product.image_url}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/placeholder.png"; // imagen por defecto si no hay imagen en DB
                }}
              />

              <p>{product.products_name}</p>
              <p>
                <strong>Precio:</strong> ${product.price}
              </p>

              {(() => {
                const cartItem = cartItems?.find(
                  (item) => item.id === product.id
                );
                if (cartItem) {
                  return (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <button onClick={() => removeFromCart(product)}>-</button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => addToCart(product)}>+</button>
                    </div>
                  );
                } else {
                  return (
                    <button onClick={() => addToCart(product)}>
                      Agregar al carrito
                    </button>
                  );
                }
              })()}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>Cargando productos...</p>
        )}
      </div>
    </>
  );
};

export default ProductList;
