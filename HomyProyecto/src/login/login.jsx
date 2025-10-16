
  import React, { useState } from "react";
  import "./login.css";
  import { IoLogInOutline } from "react-icons/io5";
  import { IoMdArrowRoundBack } from "react-icons/io";
  import Register from "../register/Register";



  export default function Login({ onClose, onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showRegister, setShowRegister] = useState(false);
    const [error, setError] = useState("");
    
    const handleSubmit = async (e) => {
      e.preventDefault();


  // Validación para correo de Gmail
      if (!/^[\w-]+(\.[\w-]+)*@gmail\.com$/.test(email)) {
        setError("El correo debe ser de Gmail.");
        return;
      } else {
        setError(""); // Limpiar error si la validación es correcta
      }






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
    const userData = data.user || data; // 👈 si no hay data.user, usa data directo
    if (onLoginSuccess) onLoginSuccess(userData);
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
          {error && <div style={{ color: 'red', fontSize: '12px' }}>{error}</div>} {/* Mostrar mensaje de error */}

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
