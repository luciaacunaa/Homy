

import React, { useEffect, useState } from "react";
import "./checkout.css";

const Checkout = ({ cartItems }) => {
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    // Preparamos los datos para el backend
    const productos = cartItems.map(item => ({
      products_id: item.id || item.products_id,
      cantidad: item.quantity
    }));
    fetch("http://127.0.0.1:5000/api/receipt/usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos })
    })
      .then(res => res.json())
      .then(data => {
        setTotal(data.total_compra);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al obtener el total");
        setLoading(false);
      });
  }, [cartItems]);

  return ( //boton de atrás lindo
    <div className="checkout-container" style={{ position: 'relative' }}>
      <button className="back-btn" onClick={() => window.history.back()}>
        &#8592; Atrás
      </button>
      <h2 className="checkout-title">Resumen de la compra</h2>
      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="checkout-list">
            {cartItems.map((item, idx) => {
              const price = Number(item.price);
              return (
                <li key={idx}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>${price * item.quantity}</span>
                </li>
              );
            })}
          </ul>
          {loading ? (
            <p>Calculando total...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <>
              <div className="checkout-total">Total: ${total}</div>
              <button className="checkout-btn">
                Continuar con la compra
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
