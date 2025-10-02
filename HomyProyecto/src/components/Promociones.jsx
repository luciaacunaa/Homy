import React from "react";
import "./promociones.css";

export default function Promociones({ images }) {
  return (
    <section style={{ background: "#f5edce", padding: "16px 0 32px 0" }}>
      <h2 style={{ textAlign: "center", color: "#48601c", marginBottom: 24, fontSize: 44, fontWeight: 800, letterSpacing: 1, marginTop: 0 }}>Promociones</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
        {images && images.length > 0 ? images.map((img, idx) => (
          <img key={idx} src={img} alt={`promo-${idx}`} className="promo-img" />
        )) : <span style={{ color: '#888' }}>No hay imágenes de promociones aún.</span>}
      </div>
    </section>
  );
}
