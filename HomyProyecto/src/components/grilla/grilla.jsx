import React, { useEffect, useState } from "react";
import "./grilla.css";

const ProductList = ({ addToCart, removeFromCart, cartItems }) => {
  const [products, setProducts] = useState([]); // estado para los productos

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Productos desde la API:", data);
        setProducts(data); // guardamos productos en el estado
      })
      .catch((err) => console.error("Error al traer productos:", err));
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#48601c" }}>Lista de Productos</h1>
      <div className="product-container">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.products_id} className="product-card">
              {product.image && <img src={product.image} alt={product.name} />}
              <h2>{product.products_name}</h2>
              <p>{product.description}</p>
              <p>
                <strong>Precio:</strong> ${product.price}
              </p>
              {(() => {
                const cartItem = cartItems?.find((item) => item.id === product.id);
                if (cartItem) {
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button onClick={() => removeFromCart(product)}>-</button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => addToCart(product)}>+</button>
                    </div>
                  );
                } else {
                  return (
                    <button onClick={() => addToCart(product)}>Agregar al carrito</button>
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
