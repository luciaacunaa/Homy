import React, { useState } from 'react';
import './register.css';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar los datos al backend
    alert('Registro enviado!');
  };

  return (
    <div className="register-container">
      <h2>Registrarse en Homy </h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" style={{marginBottom: '6px', marginTop: '16px'}}>Nombre Completo:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          placeholder="Nombre Completo"
          style={{marginBottom: '16px'}}
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
          style={{marginBottom: '16px'}}
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
