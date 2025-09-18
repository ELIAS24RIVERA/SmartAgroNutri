// src/pages/Login.jsx
import React, { useState } from "react";
import "../styles/login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === "admin" && pass === "1234") {
      setError("");
      if (onLogin) onLogin(); // 👈 avisa al App.jsx
      navigate("/dashboard"); // 👈 entra al dashboard
    } else {
      setError("Credenciales incorrectas, inténtalo de nuevo.");
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-image">
          <img src="/portada.png" alt="Campo de cultivo" />
        </div>
        <div className="login-left-text">
          <h3>Sistema Inteligente</h3>
          <p>Gestión de sistema de nutricional de agrícola</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <img src="/logo.png" alt="Logo SmartRiego" className="login-logo" />
          <h2 className="login-title">Iniciar sesión</h2>

          {error && <p className="login-error">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Usuario *"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Contraseña *"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">
              ACCEDER
            </button>
          </form>

          <p className="register-text">
            ¿No tienes una cuenta?{" "}
            <a href="/register" onClick={handleRegisterClick}>
              Regístrate aquí
            </a>
          </p>

          <div className="android-icon">
            <img src="/Android.png" alt="Disponible en Android" />
          </div>
        </div>
      </div>
    </div>
  );
}
