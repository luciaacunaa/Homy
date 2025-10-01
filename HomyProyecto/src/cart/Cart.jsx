import React, { useState } from 'react';
import './cart.css';
import { MdOutlineShoppingCart } from "react-icons/md";

function Cart({ onClose, visible, items = [], goToCheckout }) {
  if (!visible) return null;


  return (
    <div className={`cart-container${visible ? ' cart-visible' : ''}`}>
      <div className="cart-header">
        <h3>Mi Carrito</h3>
        <button className="cart-close" onClick={onClose}>×</button>
      </div>
      {items.length > 0 ? (

        <>
          <div className="cart-items">
            {items.map((item, idx) => {
              const price = Number(item.price);
              return (
                <div key={idx} className="cart-item">
                  {item.name} - ${price} x {item.quantity}
                </div>
              );
            })}
          </div>
          <button className="cart-summary-btn" onClick={goToCheckout}>
            Ir al carrito de compras
          </button>
        </>
        
      ) : (
        <div className="cart-empty">
           <MdOutlineShoppingCart size={78}/>
          <p className="cart-empty-text"><strong>Tu carrito está vacío</strong></p>
            <span className="cart-empty-subtext">
              Muchos productos y promociones<br/>
              <span className="cart-empty-subtext-small">te están esperando</span>
            </span>
        </div>
      )}
    </div>
  );
}

export default Cart;
