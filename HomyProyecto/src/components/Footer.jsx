import React from "react";
import "./header.css";

export default function Footer() {
  return (
    <footer className="footer" style={{
      width: "100%",
      background: "#48601c",
      color: "#f5edce",
      textAlign: "center",
      padding: "32px 0 24px 0",
      fontSize: 15,
      position: "static",
      left: 0,
      bottom: 0,
      zIndex: 100,
      boxShadow: "0 -2px 8px #0001"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        <span>
          © {new Date().getFullYear()} Homy. Todos los derechos reservados. | Esta página es solo para fines informativos y no constituye una oferta vinculante. Las promociones, bancos y condiciones pueden variar sin previo aviso.
        </span>
      </div>
    </footer>
  );
}
