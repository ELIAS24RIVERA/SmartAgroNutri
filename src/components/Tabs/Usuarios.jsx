import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { initializeApp, getApps } from "firebase/app";

// ✅ Configuración de Firebase
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

// ✅ Evita inicializar Firebase más de una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // ✅ Leer usuarios en tiempo real
  useEffect(() => {
    const usuariosRef = ref(db, "usuarios");
    const unsubscribe = onValue(usuariosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista = Object.entries(data).map(([id, value]) => ({
          id,
          nombre: value.nombre || "Sin nombre",
          email: value.email || "Sin email",
          rol: value.rol || "USER",
        }));
        setUsuarios(lista);
      } else {
        setUsuarios([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Cambiar rol del usuario en la base de datos
  const handleRolChange = (id, nuevoRol) => {
    const userRef = ref(db, `usuarios/${id}`);
    update(userRef, { rol: nuevoRol });
  };

  // ✅ Colores según el rol
  const getBadgeColor = (rol) => {
    if (rol === "ADMIN") return "#e74c3c";
    if (rol === "USER") return "#2ecc71";
    return "#7f8c8d";
  };

  // ✅ Chat interno
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { from: "user", text: chatInput }]);
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "🤖 Estoy aquí para ayudarte con el sistema de nutrición de áreas verdes 🌱",
        },
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
        borderRadius: "12px",
        boxShadow: "0 0 12px rgba(0,0,0,0.6)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Control de Usuarios</h2>

      {/* ✅ Tabla de usuarios */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#1c1c1c",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#222" }}>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Rol Actual</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: "1px solid #333",
                  textAlign: "center",
                  height: "60px",
                }}
              >
                <td style={tdStyle}>{user.nombre}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      backgroundColor: getBadgeColor(user.rol),
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    {user.rol}
                  </span>
                </td>
                <td style={tdStyle}>
                  <select
                    value={user.rol === "ADMIN" ? "Administrador" : "Invitado"}
                    onChange={(e) => {
                      const nuevoRol =
                        e.target.value === "Administrador" ? "ADMIN" : "USER";
                      handleRolChange(user.id, nuevoRol);
                    }}
                    style={{
                      backgroundColor: "#2c2c2c",
                      color: "#fff",
                      border: "1px solid #444",
                      borderRadius: "6px",
                      padding: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <option>Administrador</option>
                    <option>Invitado</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle} colSpan="4">
                No hay usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 💬 Chat flotante */}
      <div
        className="chat-fab"
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#60a5fa",
          color: "#fff",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "24px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        💬
      </div>

      {isChatOpen && (
        <div
          className="chat-box"
          style={{
            position: "fixed",
            bottom: "100px",
            right: "30px",
            backgroundColor: "#1c1c1c",
            color: "#fff",
            borderRadius: "10px",
            width: "300px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            className="chat-header"
            style={{
              backgroundColor: "#222",
              padding: "10px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Asistente Virtual 🌱
          </div>
          <div
            className="chat-messages"
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              maxHeight: "200px",
            }}
          >
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor:
                      msg.from === "user" ? "#60a5fa" : "#333",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: "10px",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div
            className="chat-input"
            style={{
              display: "flex",
              borderTop: "1px solid #333",
            }}
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              style={{
                flex: 1,
                backgroundColor: "#111",
                color: "#fff",
                border: "none",
                padding: "8px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                backgroundColor: "#60a5fa",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Estilos base
const thStyle = {
  padding: "12px",
  textAlign: "center",
  fontWeight: "bold",
  color: "#ddd",
  borderBottom: "2px solid #333",
};

const tdStyle = {
  padding: "10px",
  color: "#ccc",
  textAlign: "center",
};

export default Usuarios;
