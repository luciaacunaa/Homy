import React, { useState } from "react";
import { FaRegTrashAlt, FaArrowAltCircleLeft } from "react-icons/fa";
import "./promociones.css";

export default function Promociones({ images = [], isAdmin = false }) {
  const [promoImages, setPromoImages] = useState(images);
  const [deletedPromos, setDeletedPromos] = useState([]);

  const handleDelete = (idx) => {
    const removed = promoImages[idx];
    if (removed === undefined) return;
    setPromoImages((prev) => prev.filter((_, i) => i !== idx));
    setDeletedPromos((d) => [...d, { id: Date.now() + idx, src: removed }]);
  };

  const handleRestore = (id) => {
    const item = deletedPromos.find((p) => p.id === id);
    if (!item) return;
    setPromoImages((p) => [...p, item.src]);
    setDeletedPromos((d) => d.filter((x) => x.id !== id));
  };

  return (
    <section style={{ background: "#f5edce", padding: "16px 0 32px 0" }}>
      <h2
        style={{
          textAlign: "center",
          color: "#48601c",
          marginBottom: 24,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: 1,
          marginTop: 0,
        }}
      >
        Promociones
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
        }}
      >
        {promoImages && promoImages.length > 0 ? (
          promoImages.map((img, idx) => (
            <div
              key={idx}
              style={{ position: "relative", display: "inline-block" }}
            >
              <img src={img} alt={`promo-${idx}`} className="promo-img" />
              {isAdmin && (
                <button
                  onClick={() => handleDelete(idx)}
                  title="Eliminar promoción"
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
                  <FaRegTrashAlt size={22} color="#c00" />
                </button>
              )}
            </div>
          ))
        ) : (
          <span style={{ color: "#888" }}>
            No hay imágenes de promociones aún.
          </span>
        )}
      </div>

      {isAdmin && deletedPromos.length > 0 && (
        <section
          style={{
            marginTop: 24,
            padding: 12,
            background: "#fff6f6",
            borderRadius: 8,
          }}
        >
          <h3 style={{ color: "#861111", marginTop: 0 }}>
            Promociones eliminadas
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {deletedPromos.map((d) => (
              <div
                key={d.id}
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  src={d.src}
                  alt={`deleted-${d.id}`}
                  className="promo-img"
                />
                <button
                  onClick={() => handleRestore(d.id)}
                  title="Restaurar promoción"
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
                  <FaArrowAltCircleLeft size={20} color="#0a7b0a" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
