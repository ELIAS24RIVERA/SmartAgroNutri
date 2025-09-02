// Mensaje.jsx
import React, { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

// 🔹 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDo-YMXIBublt25kf_7UD99opWgZzfopZI",
  authDomain: "elias-82a93.firebaseapp.com",
  databaseURL: "https://elias-82a93-default-rtdb.firebaseio.com",
  projectId: "elias-82a93",
  storageBucket: "elias-82a93.firebasestorage.app",
  messagingSenderId: "339817378222",
  appId: "1:339817378222:web:927d026e3df14f9351983f",
  measurementId: "G-Q8M91HHTNQ",
};

// 🔹 Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function Mensaje() {
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    const sensoresRef = ref(db, "lecturas");

    onValue(sensoresRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const ultimoKey = Object.keys(data).pop(); // última lectura
        const { temperatura, luz, ec } = data[ultimoKey];

        let mensajesGenerados = [];

        // 🔹 Reglas de mensajes por sensor
        if (temperatura > 35) {
          mensajesGenerados.push("⚠️ La temperatura es muy alta 🌡️");
        } else if (temperatura < 15) {
          mensajesGenerados.push("⚠️ La temperatura es muy baja 🥶");
        } else {
          mensajesGenerados.push("✅ Temperatura dentro del rango 🌡️");
        }

        if (ec < 1) {
          mensajesGenerados.push("⚠️ Baja conductividad, faltan nutrientes 🌱");
        } else {
          mensajesGenerados.push("✅ Nutrientes adecuados 🌱");
        }

        if (luz < 200) {
          mensajesGenerados.push("⚠️ Baja luz, fotosíntesis insuficiente ☀️");
        } else {
          mensajesGenerados.push("✅ Luz suficiente ☀️");
        }

        // 🔹 Guardar mensajes en Firebase (historial)
        const mensajesRef = ref(db, "mensajes");
        mensajesGenerados.forEach((msg) => {
          push(mensajesRef, {
            texto: msg,
            timestamp: Date.now(),
          });
        });
      }
    });
  }, []);

  // 🔹 Leer historial en tiempo real
  useEffect(() => {
    const mensajesRef = ref(db, "mensajes");

    onValue(mensajesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista = Object.values(data).map((item) => ({
          texto: item.texto,
          fecha: new Date(item.timestamp).toLocaleString("es-ES"),
        }));
        setMensajes(lista.reverse()); // último arriba
      } else {
        setMensajes([]);
      }
    });
  }, []);

  return (
    <div className="main-container">
      <h1>💬 Mensajes Automáticos en Tiempo Real</h1>
      <p>Se generan mensajes individuales por cada sensor.</p>

      <h3>📜 Historial de mensajes</h3>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
        }}
      >
        {mensajes.length > 0 ? (
          mensajes.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
                padding: "8px",
                borderRadius: "6px",
                backgroundColor: msg.texto.startsWith("⚠️")
                  ? "#ffebee"
                  : "#e8f5e9",
              }}
            >
              📝 {msg.texto}
              <br />
              <small>📅 {msg.fecha}</small>
            </div>
          ))
        ) : (
          <p>⚠️ No hay mensajes aún</p>
        )}
      </div>
    </div>
  );
}
