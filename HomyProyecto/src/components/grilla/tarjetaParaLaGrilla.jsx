import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const tarjetaParaLaGrilla = (
  isFav,
  product,
  cartItems = [], // 👈 valor por defecto vacío
  addToCart = () => {},
  removeFromCart = () => {},
  toggleFavorite = () => {}
) => {
  const inCart = cartItems.find((item) => item.id === product.id);

  return (
    <div className="product-card" key={product.id}>
      <div className="image-container">
        <img
          src={product.image_url || "/vite.svg"}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = "/vite.svg")}
          style={{ width: "100%", height: 180, objectFit: "cover" }}
        />

        <button className="fav-button" onClick={() => toggleFavorite(product)}>
          {isFav ? <FaHeart color="red" /> : <FaRegHeart color="#888" />}
        </button>
      </div>

      <h3>{product.name}</h3>
      <p>Precio: ${product.price}</p>

      {inCart ? (
        <div className="cart-controls">
          <button onClick={() => removeFromCart(product)}>-</button>
          <span>{inCart.quantity}</span>
          <button onClick={() => addToCart(product)}>+</button>
        </div>
      ) : (
        <button className="add-cart-btn" onClick={() => addToCart(product)}>
          Agregar al carrito
        </button>
      )}
    </div>
  );
};

export default tarjetaParaLaGrilla;
