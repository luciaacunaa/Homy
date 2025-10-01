import React, { useState } from 'react';
import './register.css';
import { IoMdArrowRoundBack } from "react-icons/io";


function Register({ onBack }) {
  const [form, setForm] = useState({
    customers_name: '',
    customers_lastname: '',
    customers_address: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación para correo de Gmail
    if (!/^[\w-]+(\.[\w-]+)*@gmail\.com$/.test(form.email)) {
      setError("El correo debe ser de Gmail.");
      return;
    } else {
      setError("");
    }
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          customers_name: form.customers_name,
          customers_lastname: form.customers_lastname,
          customers_address: form.customers_address
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Usuario registrado exitosamente');
        if (onBack) onBack(); // Vuelve al login
      } else {
        alert('Error: ' + (data.error || 'No se pudo registrar'));
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="register-container" style={{ position: 'relative' }}>
      {onBack && (
        <button type="button" onClick={onBack} className="close-login-btn">
          <IoMdArrowRoundBack />
        </button>
      )}
      <h2>Registrarse en Homy </h2>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <label htmlFor="customers_name" style={{marginBottom: '6px', marginTop: '16px'}}>Nombre:</label>
        <input
          type="text"
          id="customers_name"
          name="customers_name"
          value={form.customers_name}
          onChange={handleChange}
          required
          placeholder="Nombre"
          style={{marginBottom: '8px'}}
        />
        <label htmlFor="customers_lastname" style={{marginBottom: '6px', marginTop: '8px'}}>Apellido:</label>
        <input
          type="text"
          id="customers_lastname"
          name="customers_lastname"
          value={form.customers_lastname}
          onChange={handleChange}
          required
          placeholder="Apellido"
          style={{marginBottom: '8px'}}
        />
        <label htmlFor="customers_address" style={{marginBottom: '6px', marginTop: '8px'}}>Dirección:</label>
        <input
          type="text"
          id="customers_address"
          name="customers_address"
          value={form.customers_address}
          onChange={handleChange}
          required
          placeholder="Dirección"
          style={{marginBottom: '8px'}}
        />
        <label htmlFor="email" style={{marginBottom: '6px', marginTop: '8px'}}>Correo electrónico:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Correo electrónico"
          style={{marginBottom: '8px'}}
        />
        <label htmlFor="password" style={{marginBottom: '6px', marginTop: '8px'}}>Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Contraseña"
          style={{marginBottom: '16px'}}
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
