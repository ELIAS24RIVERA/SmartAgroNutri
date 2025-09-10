// src/pages/Login.jsx
import React, { useState } from "react";
import "../styles/login.css"

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 👉 Aquí puedes poner validación real o Firebase Auth
    if (user === "admin" && pass === "1234") {
      onLogin(); // activa sesión
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
