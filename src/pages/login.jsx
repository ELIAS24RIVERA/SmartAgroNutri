import React, { useState } from "react";
import "../styles/login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // asegúrate de exportar auth en firebase.js

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, pass);

      if (onLogin) onLogin();
      navigate("/dashboard");
    } catch (err) {
      console.error(err.code, err.message);
      switch (err.code) {
        case "auth/user-not-found":
          setError("Usuario no registrado.");
          break;
        case "auth/wrong-password":
          setError("Contraseña incorrecta.");
          break;
        case "auth/invalid-email":
          setError("Correo inválido.");
          break;
        case "auth/configuration-not-found":
          setError(
            "Método de inicio de sesión no habilitado. Actívalo en la consola de Firebase."
          );
          break;
        default:
          setError("Error al iniciar sesión: " + err.message);
      }
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <div className="login-container">
      {/* Columna izquierda */}
      <div className="login-left">
        <div className="login-image">
          <img src="/portada.png" alt="Campo de cultivo" />
        </div>
        <div className="login-left-text">
          <h3>Sistema Inteligente</h3>
          <p>Gestión de sistema de nutricional de agrícola</p>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="login-right">
        <div className="login-box">
          <img src="/logo.png" alt="Logo SmartRiego" className="login-logo" />
          <h2 className="login-title">Iniciar sesión</h2>

          {error && <p className="login-error">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="email"
                placeholder="Correo electrónico *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              INICIAR SESION
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
