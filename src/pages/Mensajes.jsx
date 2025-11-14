// src/components/Mensajes.jsx
import React, { useState, useEffect } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { db } from "../firebase";

export default function Mensajes() {
  const [mensajes, setMensajes] = useState([]);

  // 🔹 Leer mensajes directamente desde /datos (solo valores simples)
  useEffect(() => {
    const mensajesRef = ref(db, "datos");

    const unsubscribe = onValue(mensajesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // Convertir cada dato en un mensaje simple
        const lista = Object.entries(data).map(([id, texto]) => ({
          id,
          texto: typeof texto === "string" ? texto : JSON.stringify(texto),
          fecha: "Sin fecha",
          leido: false,
          tipo: "info",
        }));

        setMensajes(lista.reverse());
      } else {
        setMensajes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Marcar como leído
  const marcarLeido = (id) => {
    update(ref(db, `datos/${id}`), { leido: true });
  };

  // 🔹 Eliminar un mensaje
  const eliminarMensaje = (id) => {
    remove(ref(db, `datos/${id}`));
  };

  // 🔹 Borrar todos
  const borrarTodos = () => {
    remove(ref(db, "datos"));
  };

  // 🔹 Colores según el texto
  const getColor = (texto) => {
    if (texto.toUpperCase().includes("BAJA")) return "#b71c1c";
    if (texto.toUpperCase().includes("ALTA")) return "#b8860b";
    return "#2e7d32";
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "#fff",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 0 12px rgba(0,0,0,0.6)",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>Mensajes del Sistema</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button
          style={{
            backgroundColor: "#2ecc71",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={() => setMensajes([...mensajes])}
        >
          📩 Actualizar lista
        </button>

        <button
          style={{
            backgroundColor: "#e74c3c",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={borrarTodos}
        >
          🗑️ Borrar todos
        </button>
      </div>

      {mensajes.length > 0 ? (
        mensajes.map((msg) => (
          <div
            key={msg.id}
            style={{
              backgroundColor: getColor(msg.texto),
              borderRadius: "10px",
              padding: "12px",
              marginBottom: "10px",
              position: "relative",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              {msg.texto}
            </div>

            <div style={{ fontSize: "0.9em", opacity: 0.9 }}>
              📅 {msg.fecha}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {!msg.leido && (
                <button
                  onClick={() => marcarLeido(msg.id)}
                  style={{
                    backgroundColor: "#27ae60",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.85em",
                  }}
                >
                  ✔️ Marcar como leído
                </button>
              )}

              <button
                onClick={() => eliminarMensaje(msg.id)}
                style={{
                  backgroundColor: "#c0392b",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "0.85em",
                }}
              >
                🗑️ Eliminar
              </button>
            </div>

            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: msg.leido ? "#555" : "#00ff00",
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            ></div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "#bbb" }}>
          ⚠️ No hay mensajes en el sistema
        </p>
      )}
    </div>
  );
}
