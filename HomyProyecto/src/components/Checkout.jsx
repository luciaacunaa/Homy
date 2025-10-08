import React, { useEffect, useState } from "react";
import "./checkout.css";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

const Checkout = ({ cartItems }) => {
  const [total, setTotal] = useState(0);
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inicializar Mercado Pago
  useEffect(() => {
    initMercadoPago("APP_USR-45709760-c0b0-4e36-941c-27008e49bf53");
  }, []);

  // Calcular total pidiendo a backend
  useEffect(() => {
    if (cartItems.length === 0) {
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);

    const productos = cartItems.map(item => ({
      products_id: item.id || item.products_id,
      cantidad: item.quantity,
    }));

    fetch("http://127.0.0.1:5000/api/receipt/usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos }),
    })
      .then(res => res.json())
      .then(data => {
        setTotal(data.total_compra);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al obtener el total");
        setLoading(false);
      });
  }, [cartItems]);

  // Crear preferencia cuando ya tengo total, fetch al backend. El backend hace fetch a MP, 
  //modifique el endpoint /crear_preferencia en app.py para que reciba items
  useEffect(() => {
    if (total > 0) {
      const createPreference = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/crear_preferencia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cartItems.map(item => ({
                title: item.name,
                quantity: item.quantity,
                unit_price: Number(item.price),
              })),
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setPreferenceId(data.id);
            console.log("Preferencia creada:", data);
          }
        } catch (err) {
          console.error("Error al crear preferencia:", err);
        }
      };

      createPreference();
    }
  }, [total, cartItems]);

  return (
    <div className="checkout-container" style={{ position: "relative" }}>
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
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <>
              <div className="checkout-total">Total: ${total}</div>

              {preferenceId && (
                <div className="wallet-container">
                  <Wallet initialization={{ preferenceId }} style={{ display: 'block', margin: '0 auto' }} />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
