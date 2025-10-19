// src/pages/Registrar.jsx
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import "../styles/register.css";

export default function RegistrarUsuario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  // ✅ Inicializamos Auth y Database aquí (evita conflictos con múltiples inicializaciones)
  const auth = getAuth();
  const db = getDatabase();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // ✅ Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Guardar información del usuario en Realtime Database
      await set(ref(db, "usuarios/" + user.uid), {
        nombre: nombre,
        email: user.email,
        rol: "USER", // puedes cambiar a "ADMIN" si lo necesitas
        createdAt: new Date().toISOString(),
      });

      alert("✅ Usuario registrado correctamente");

      // ✅ Limpiar los campos
      setEmail("");
      setPassword("");
      setNombre("");
      setError("");
    } catch (err) {
      console.error("Error al registrar:", err);
      setError("❌ " + err.message);
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
