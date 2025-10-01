
import React, { useState } from "react";
import "./login.css";
import { IoLogInOutline } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import Register from "../register/Register";



export default function Login({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (onLoginSuccess) onLoginSuccess(data.user);
      } else {
        alert("Error: " + (data.error || "No se pudo iniciar sesión"));
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  if (showRegister) {
    return (
      <Register onBack={() => setShowRegister(false)} />
    );
  }
  return (
    <div className="login-container">
      <h2>Iniciar Sesión en Homy</h2>
      <form onSubmit={handleSubmit} className="login-form" style={{ position: 'relative' }}>
        {onClose && (
          <button type="button" onClick={onClose} className="close-login-btn">
            <IoMdArrowRoundBack />
          </button>
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      <div style={{ marginTop: '18px', textAlign: 'center' }}>
        ¿No tenés una cuenta?  
        <span 
          style={{ 
            color: '#48601c', 
            cursor: 'pointer', 
            textDecoration: 'underline', 
            display: 'inline-flex', 
            alignItems: 'center',
          }}
          onClick={() => setShowRegister(true)}
        >
             Registrarse<IoLogInOutline size={18} style={{ verticalAlign: 'middle' }} />
        </span>
      </div>
    </div>
  );
}
