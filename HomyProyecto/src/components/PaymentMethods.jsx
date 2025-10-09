import React from "react";

// Lista de bancos (nombre y archivo de imagen)
const bancos = [
  "/bancos/Banco Ciudad.png",
  "/bancos/Banco hipotecario.png",
  "/bancos/BNA.png",
  "/bancos/BPN.png",
  "/bancos/Cenco Pay.png",
  "/bancos/Club La Nacion.png",
  "/bancos/Club LosAndess Pass.png",
  "/bancos/Club Rio Negro.png",
  "/bancos/Galicia.png",
  "/bancos/Naranja X.png",
  "/bancos/Patagonia365.png",
  "/bancos/Superville.png",
  "/bancos/Visa.png",
];

const PaymentMethods = () => {
  return (
    <div style={{ padding: 32, minHeight: "80vh" }}>
      <h1 style={{ color: "#48601c", marginBottom: 32, textAlign: "center", fontSize: 36, fontWeight: 700 }}>Medios de Pago</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "center" }}>
        {bancos.map((img, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 240,
              height: 180,
              justifyContent: "center"
            }}
          >
            <img
              src={img}
              alt={"Banco"}
              style={{
                width: 180,
                height: 120,
                objectFit: "contain",
                borderRadius: 12,
                boxShadow: "0 2px 12px #0002",
                background: "#fff",
                transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
                cursor: "pointer"
              }}
              onMouseOver={e => (e.currentTarget.style.transform = "scale(1.13)")}
              onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
