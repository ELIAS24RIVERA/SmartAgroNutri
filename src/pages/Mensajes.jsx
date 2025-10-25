// Mensajes.jsx
import React, { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";

// 🔹 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGoGj_ecO1OOZjXA5EJZVWJK-ygPsOSNI",
  authDomain: "apppruebi.firebaseapp.com",
  databaseURL: "https://apppruebi-default-rtdb.firebaseio.com",
  projectId: "apppruebi",
  storageBucket: "apppruebi.firebasestorage.app",
  messagingSenderId: "381833616823",
  appId: "1:381833616823:web:8236f28228abf0b1d45c32",
  measurementId: "G-J4NKTB2KHS",
};

// 🔹 Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function Mensajes() {
  const [mensajes, setMensajes] = useState([]);

  // 🔹 Leer mensajes en tiempo real
  useEffect(() => {
    const mensajesRef = ref(db, "mensajes");
    onValue(mensajesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista = Object.entries(data).map(([id, item]) => ({
          id,
          texto: item.texto,
          fecha: new Date(item.timestamp).toLocaleString("es-ES"),
          leido: item.leido || false,
          tipo: item.tipo || "info",
        }));
        setMensajes(lista.reverse());
      } else {
        setMensajes([]);
      }
    });
  }, []);

  // 🔹 Marcar un mensaje como leído
  const marcarLeido = (id) => {
    const msgRef = ref(db, `mensajes/${id}`);
    update(msgRef, { leido: true });
  };

  // 🔹 Eliminar un mensaje
  const eliminarMensaje = (id) => {
    const msgRef = ref(db, `mensajes/${id}`);
    remove(msgRef);
  };

  // 🔹 Borrar todos los mensajes
  const borrarTodos = () => {
    const mensajesRef = ref(db, "mensajes");
    remove(mensajesRef);
  };

  // 🔹 Estilo del color de alerta
  const getColor = (texto) => {
    if (texto.includes("BAJA")) return "#b71c1c"; // rojo oscuro
    if (texto.includes("ALTA")) return "#b8860b"; // amarillo oscuro
    return "#2e7d32"; // verde
  };
  // ========= Chat flotante =========
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
  
    const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      setChatMessages((prev) => [...prev, { from: "user", text: chatInput }]);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { from: "bot", text: "🤖 Estoy aquí para ayudarte con el sistema de nutrición de áreas verdes 🌱" },
        ]);
      }, 800);
      setChatInput("");
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
          📩 Todos los mensajes
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

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "8px",
              }}
            >
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

            {/* Punto verde si está activo */}
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
      {/* 💬 Chat flotante */}
      <div className="chat-fab" onClick={() => setIsChatOpen(!isChatOpen)}>💬</div>

      {isChatOpen && (
        <div className="chat-box">
          <div className="chat-header">Asistente Virtual 🌱</div>
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.from === "user" ? "user-msg" : "bot-msg"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}
