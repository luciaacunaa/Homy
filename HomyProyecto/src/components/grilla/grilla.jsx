import React, { useEffect, useState } from "react";
import "./grilla.css";

<<<<<<< HEAD
const ProductList = ({ addToCart, removeFromCart, cartItems }) => {
  const [products, setProducts] = useState([]);
=======
const ProductList = ({ addToCart, removeFromCart, cartItems, user }) => {
  const [products, setProducts] = useState([]);
  const [hiddenProducts, setHiddenProducts] = useState([]); // para ocultar productos
>>>>>>> 3185b1308974cfa86799548decb70ce4d715c4f3

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products") 
      .then((res) => res.json())
      .then((data) => {
        const productosConId = data.map((prod) => ({
          ...prod,
          id: prod.products_id,
<<<<<<< HEAD
          name: prod.products_name,
          image_url: `http://127.0.0.1:5000/api/image/${prod.products_id}`
 
=======
          name: prod.products_name
>>>>>>> 3185b1308974cfa86799548decb70ce4d715c4f3
        }));
        setProducts(productosConId);
      })
      .catch((err) => console.error("Error al traer productos:", err));
  }, []);

  // función para ocultar un producto
  const handleHideProduct = (id) => {
    setHiddenProducts((prev) => [...prev, id]);
  };

  const visibleProducts = products.filter(
    (product) => !hiddenProducts.includes(product.id)
  );

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#48601c" }}>
        Lista de Productos
      </h1>

      <div className="product-container">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <div key={product.id} className="product-card">
<<<<<<< HEAD
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

=======
              {user?.is_admin && (
                <button
                  onClick={() => handleHideProduct(product.id)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    width: "25px",
                    height: "25px",
                  }}
                >
                  ×
                </button>
              )}

              {product.image && <img src={product.image} alt={product.name} />}
              <p>{product.products_name}</p>
              <p><strong>Precio:</strong> ${product.price}</p>
              
>>>>>>> 3185b1308974cfa86799548decb70ce4d715c4f3
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
