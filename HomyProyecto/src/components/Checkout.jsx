import React, { useEffect, useState } from "react";
import "./checkout.css";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

const Checkout = ({ cartItems }) => {
  const [total, setTotal] = useState(0);
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Inicializar Mercado Pago
  useEffect(() => {
    initMercadoPago("APP_USR-7b4915cf-80ba-4578-9dda-909db7026e16");
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
    if (cartItems.length > 0) {
      const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotal(totalAmount);

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

          const data = await response.json();
          if (data.id) {
            setPreferenceId(data.id);
            console.log("✅ Preferencia creada:", data);
          } else {
            console.error("❌ Error en preferencia:", data);
          }
        } catch (err) {
          console.error("Error al crear preferencia:", err);
        }
      };

      createPreference();
    }
  }, [cartItems]);
   useEffect(() => {
    if (cartItems.length === 0) {
      setTotal(0);
      setPreferenceId(null);
      setLoading(false);
      return;
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);

    const createPreference = async () => {
      try {
        setLoading(true);
        setError("");

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

        const data = await response.json();

        if (data.id) {
          setPreferenceId(data.id);
          console.log("✅ Preferencia creada:", data);
        } else {
          setError("No se pudo crear la preferencia.");
          console.error("❌ Error en preferencia:", data);
        }
      } catch (err) {
        setError("Error al crear la preferencia.");
        console.error("❌ Error al crear preferencia:", err);
      } finally {
        setLoading(false);
      }
    };

    createPreference();
  }, [cartItems]);

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
            {cartItems.map((item, idx) => (
              <li key={idx}>
                <span>{item.name} x {item.quantity}</span>
                <span>${Number(item.price) * item.quantity}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-total">Total: ${total}</div>

          {loading && <p>Cargando botón de pago...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && preferenceId && (
            <div
              className="wallet-container"
              style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
            >
              <Wallet initialization={{ preferenceId }} />
            </div>
          )}
        </>
      )}
    </div>
  );
};


export default Checkout;
