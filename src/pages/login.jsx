// src/pages/Login.jsx
import React, { useState } from "react";
import "../styles/login.css";

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === "admin" && pass === "1234") {
      onLogin();
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      {/* Columna izquierda */}
      <div className="login-left">
        <div className="logo-container">
          {/* ✅ Usa rutas relativas a /public */}
          <img src="/logho.png" alt="Logo" className="logo" />
          <h2>SMARTAGRONUTRI</h2>
        </div>
        <div className="illustration">
          <img src="/portada.png" alt="Illustration" />
        </div>
        <h3>Bienvenido de nuevo!</h3>
        <p>Sistema de nutricional para área verdes - ISTAP</p>
      </div>

      {/* Columna derecha */}
      <div className="login-right">
        <div className="login-box">
          <img src="/logo.png" alt="Logo empresa" className="login-logo" />
          <h2>INICIO DE SESIÓN</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <button type="submit">Iniciar sesión</button>
          </form>
          <small>
            ¿Problemas con tu acceso? Contacta al{" "}
            <a href="mailto:admin@istap.com">administrador</a>
          </small>
        </div>
      </div>
    </div>
  );
}
