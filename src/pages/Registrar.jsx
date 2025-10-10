// src/pages/Registrar.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebaseConfig"; // ✅ ruta corregida
import "../styles/register.css";

export default function RegistrarUsuario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, "usuarios/" + user.uid), {
        nombre,
        email,
        rol: "USER",
        createdAt: new Date().toISOString(),
      });

      alert("✅ Usuario registrado correctamente");
      setEmail("");
      setPassword("");
      setNombre("");
      setError("");
    } catch (err) {
      console.error("Error al registrar:", err);
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Crear cuenta</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre completo *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
      <p>
        ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
      </p>
    </div>
  );
}
