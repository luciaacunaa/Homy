import React, { useState } from 'react';
import './cart.css';

function Cart() {
  // Estado del carrito: array de productos
  const [items, setItems] = useState([]);

  return (
    <div className="cart-container">
      <h3>Carrito</h3>
      {items.length === 0 ? (
        <div className="cart-empty">
          <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Carrito vacío" className="cart-icon" />
          <p>El carrito está vacío</p>
        </div>
      ) : (
        <div className="cart-items">
          {/* Aquí se mostrarán los productos */}
          {items.map((item, idx) => (
            <div key={idx} className="cart-item">
              {item.name} - ${item.price}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;
