import React, { useState, useEffect } from "react";
import "./checkout.css";

const TEST_CARDS = [
  { brand: "Visa (test)", number: "4111111111111111" },
  { brand: "Mastercard (test)", number: "5555555555554444" },
  { brand: "Amex (test)", number: "378282246310005" },
];

const Checkout = ({ cartItems, setCartItems }) => {
  const [total, setTotal] = useState(0);
  const [paid, setPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const [cardData, setCardData] = useState({
    number: "",
    brand: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const totalCompra = cartItems.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.quantity),
      0
    );
    setTotal(totalCompra);
  }, [cartItems]);

  // obtener estados desde backend (para mostrar estado en detalles)
  useEffect(() => {
    let mounted = true;
    fetch('http://127.0.0.1:5000/api/status')
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (mounted) setStatuses(data || []); })
      .catch(() => { /* ignore */ });
    return () => { mounted = false };
  }, []);

  const handlePayment = (e) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (!buyer.name || !buyer.email || !paymentMethod) {
      setError("Completá nombre, email y método de pago.");
      return;
    }

    if (paymentMethod === "tarjeta") {
      const { number, expiry, cvv } = cardData;
      if (!number || !expiry || !cvv) {
        setError("Completá los datos de la tarjeta.");
        return;
      }
      // validación simple del número (dígitos)
      const raw = number.replace(/\s+/g, "");
      if (!/^\d{13,19}$/.test(raw)) {
        setError("Número de tarjeta inválido (13-19 dígitos).");
        return;
      }
      // expiry simple MM/AA o MM/YYYY (comprobar fecha futura)
      const parts = expiry.split("/").map(p => p.trim());
      if (parts.length !== 2) {
        setError("Fecha de expiración inválida. Usá MM/AA o MM/YYYY.");
        return;
      }
      const month = parseInt(parts[0], 10);
      let year = parseInt(parts[1], 10);
      if (parts[1].length === 2) year += 2000;
      const now = new Date();
      const expDate = new Date(year, month - 1, 1);
      if (isNaN(expDate.getTime()) || month < 1 || month > 12 || expDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
        setError("La tarjeta está vencida o la fecha es inválida.");
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError("CVV inválido (3 o 4 dígitos).");
        return;
      }
    }

    // Simular procesamiento
    setTimeout(() => {
      // Guardar orden (opcional) en localStorage
      const newOrder = {
        id: Date.now(),
        buyer,
        paymentMethod,
        total,
        date: new Date().toLocaleString(),
        items: cartItems,
      };
      const prevOrders = JSON.parse(localStorage.getItem("orders")) || [];
      localStorage.setItem("orders", JSON.stringify([...prevOrders, newOrder]));
      // guardar en estado para poder mostrar detalles inmediatamente
      setOrderDetails(newOrder);

      // VACIAR carrito en estado y en localStorage
      if (typeof setCartItems === "function") {
        setCartItems([]);
      }
      try {
        localStorage.removeItem("cartItems");
      } catch (err) {
        console.warn("No se pudo limpiar localStorage cartItems:", err);
      }

      // Marcar pago completado y mostrar pantalla de éxito
      setPaid(true);
    }, 800);
  };

  if (paid) {
    const masked =
      paymentMethod === "tarjeta"
        ? `**** **** **** ${cardData.number.slice(-4)}`
        : paymentMethod === "efectivo"
        ? "Efectivo al recibir"
        : "Transferencia bancaria";
    const openDetails = () => {
      // obtener el último pedido guardado en localStorage (orders)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const last = orders.length ? orders[orders.length - 1] : null;
      if (last) setOrderDetails(last);
      setShowDetails(true);
    };

    const closeDetails = () => setShowDetails(false);

    return (
      <div className="checkout-container" style={{ textAlign: "center" }}>
        <h2 className="checkout-title" style={{ color: "green" }}>
           Pago completado
        </h2>
        <p>Gracias, <b>{buyer.name}</b>.</p>
        <p>Enviamos confirmación a: <b>{buyer.email}</b></p>
        <p>Método: <b>{paymentMethod}</b> — {masked}</p>
        <p>Total abonado: <b>${total}</b></p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
          <button onClick={openDetails} className="confirm-btn">Detalles de la compra</button>
          <button onClick={() => (window.location.href = "/products")} className="confirm-btn">Volver a la tienda</button>
        </div>

        {showDetails && (
          <div className="modal-overlay" onClick={closeDetails}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Detalles de la compra</h3>
              {orderDetails ? (
                <div className="order-details">
                  <p><strong>Comprador:</strong> {orderDetails.buyer.name} — {orderDetails.buyer.email}</p>
                  <p><strong>Fecha:</strong> {orderDetails.date}</p>
                  <p><strong>Método:</strong> {orderDetails.paymentMethod}</p>
                  <p><strong>Total:</strong> ${orderDetails.total}</p>
                  <h4>Productos</h4>
                  <ul>
                    {orderDetails.items.map((it, i) => (
                      <li key={i}>{it.name} — ${Number(it.price)} x {it.quantity}</li>
                    ))}
                  </ul>
                  <p><strong>Estado:</strong> { (orderDetails.status_name) || (statuses.length ? statuses[0].status_name : 'Enviado') }</p>
                </div>
              ) : (
                <p>No se encontró el detalle del pedido guardado.</p>
              )}
              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <button onClick={closeDetails} className="confirm-btn">Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Atrás
        </button>
        <h2 className="checkout-title">No hay productos en el carrito</h2>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Atrás
      </button>

      <h2 className="checkout-title">Resumen de la compra</h2>
      <ul className="checkout-list">
        {cartItems.map((item, idx) => (
          <li key={idx}>
            <span>{item.name} x {item.quantity}</span>
            <span>${Number(item.price) * Number(item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="checkout-total">Total: ${total}</div>

      <form onSubmit={handlePayment} className="checkout-form">
        <h3>Datos del comprador</h3>
        <input
          type="text"
          placeholder="Nombre completo"
          value={buyer.name}
          onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={buyer.email}
          onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
        />

        <h3>Método de pago</h3>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="">Seleccioná uno...</option>
          <option value="transferencia">Transferencia bancaria</option>
          <option value="tarjeta">Tarjeta (simulada)</option>
        </select>

        {paymentMethod === "tarjeta" && (
          <div style={{ marginTop: "1rem" }}>
            <p style={{ fontSize: "0.9rem", marginBottom: "0.6rem" }}>
              Para pruebas podés usar:
              {TEST_CARDS.map((c, i) => (
                <span key={i} style={{ display: "block", fontSize: "0.85rem" }}>
                  • {c.brand}: <code>{c.number}</code>
                </span>
              ))}
            </p>

            <input
              type="text"
              placeholder="Número de tarjeta"
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Marca (Visa / Mastercard / Amex)"
              value={cardData.brand}
              onChange={(e) => setCardData({ ...cardData, brand: e.target.value })}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                type="text"
                placeholder="MM/AA"
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                style={{ width: "50%" }}
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                style={{ width: "50%" }}
              />
            </div>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" className="confirm-btn" style={{ marginTop: "1rem" }}>
          Confirmar pago simulado
        </button>
      </form>
    </div>
  );
};

export default Checkout;
