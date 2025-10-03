import React, { useState } from 'react';
import './cart.css';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";

// Componente Cart
// Props relevantes:
//  - onClose: función para cerrar el carrito
//  - visible: boolean para mostrar/ocultar
//  - items: array con productos
//  - goToCheckout: navegar al checkout
//  - onClear: función (desde App) que vacía todo el carrito

function Cart({ onClose, visible, items = [], goToCheckout, onClear }) {
  if (!visible) return null;


  return (
    <div className={`cart-container${visible ? ' cart-visible' : ''}`}>
      <div className="cart-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3>Mi Carrito</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Botón para vaciar el carrito: llama a onClear (definido en App) */}
          <button className="cart-clear" onClick={onClear} title="Vaciar carrito"><FaRegTrashCan /></button>
          {/* Botón para cerrar el drawer del carrito */}
          <button className="cart-close" onClick={onClose} title="Cerrar">×</button>
        </div>
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
