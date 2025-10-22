import React, { useState } from "react";
import { FaRegTrashAlt, FaArrowAltCircleLeft } from "react-icons/fa";

// Lista de bancos (ruta de imagen)
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
const PaymentMethods = ({ isAdmin = false }) => {
  const [methods, setMethods] = useState(bancos);
  const [deletedMethods, setDeletedMethods] = useState([]);

  const handleDeleteMethod = (idx) => {
    const removed = methods[idx];
    if (!removed) return;
    setMethods((m) => m.filter((_, i) => i !== idx));
    setDeletedMethods((d) => [...d, { id: Date.now() + idx, src: removed }]);
  };

  const handleRestoreMethod = (id) => {
    const item = deletedMethods.find((d) => d.id === id);
    if (!item) return;
    setMethods((m) => [...m, item.src]);
    setDeletedMethods((d) => d.filter((x) => x.id !== id));
  };

  return (
    <div style={{ padding: 32, minHeight: "80vh" }}>
      <h1
        style={{
          color: "#48601c",
          marginBottom: 32,
          textAlign: "center",
          fontSize: 36,
          fontWeight: 700,
        }}
      >
        Medios de Pago
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          justifyContent: "center",
        }}
      >
        {methods.map((img, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 240,
              height: 180,
              justifyContent: "center",
              position: "relative",
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
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.13)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            {isAdmin && (
              <button
                onClick={() => handleDeleteMethod(idx)}
                title="Eliminar método"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "#f5edce",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 6,
                }}
              >
                <FaRegTrashAlt size={20} color="#c00" />
              </button>
            )}
          </div>
        ))}
      </div>

      {isAdmin && deletedMethods.length > 0 && (
        <section
          style={{
            marginTop: 24,
            padding: 12,
            background: "#fff6f6",
            borderRadius: 8,
          }}
        >
          <h3 style={{ color: "#861111", marginTop: 0 }}>Métodos eliminados</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {deletedMethods.map((d) => (
              <div
                key={d.id}
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  src={d.src}
                  alt={`deleted-${d.id}`}
                  style={{
                    width: 180,
                    height: 120,
                    objectFit: "contain",
                    borderRadius: 12,
                    background: "#fff",
                  }}
                />
                <button
                  onClick={() => handleRestoreMethod(d.id)}
                  title="Restaurar método"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#f5edce",
                    border: "none",
                    cursor: "pointer",
                    padding: 6,
                    borderRadius: 6,
                  }}
                >
                  <FaArrowAltCircleLeft size={18} color="#0a7b0a" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PaymentMethods;
