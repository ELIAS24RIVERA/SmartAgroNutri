// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { listenDatos } from "../../firebaseApi";
import "../../styles/Dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stopListening = listenDatos((newData) => {
      console.log("📥 Datos desde Firebase:", newData);

      if (newData && typeof newData === "object") {
        setData(newData);
      } else {
        setData(null);
      }
    });

    return () => {
      if (typeof stopListening === "function") stopListening();
    };
  }, []);

  // CHAT flotante (NO SE TOCÓ)
  useEffect(() => {
    if (document.getElementById("n8n-chat-script")) return;

    const link = document.createElement("link");
    link.id = "n8n-chat-style";
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.id = "n8n-chat-script";
    script.type = "module";
    script.textContent = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      createChat({
        webhookUrl: 'https://chatenf.app.n8n.cloud/webhook/8fee68ab-336a-4679-99d3-379cf1395630/chat',
        target: '#n8n-chat',
        mode: 'window',
        defaultLanguage: 'es',
        initialMessages: [
          '¡Hola! 👋',
          'Mi nombre es Nathan. ¿En qué puedo ayudarte hoy?'
        ],
        i18n: {
          es: {
            title: '¡Hola! 👋',
            subtitle: 'Inicia un chat. Estamos aquí para ayudarte 24/7.',
            inputPlaceholder: 'Escribe tu pregunta...'
          }
        }
      });
    `;
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">PANEL DE CONTROL</h1>

      <div className="connection-section">
        <label>IP:</label>
        <input type="text" placeholder="192.168.43.114" />
        <button>Conectar</button>
      </div>

      {data ? (
        <>
          <div className="cards-container">

            {/* 🔹 Conductividad */}
            <div className="card temp">
              <h2>{data.conductivity ?? "--"} µS/cm</h2>
              <p>CONDUCTIVIDAD ELÉCTRICA</p>
            </div>

            {/* 🔹 Temperatura */}
            <div className="card hum">
              <h2>{data.temperature ?? "--"} °C</h2>
              <p>TEMPERATURA</p>
            </div>

            {/* 🔹 Luz */}
            <div className="card luz">
              <h2>{data.porcentajeLuz ?? "--"}%</h2>
              <p>LUZ</p>
            </div>

          </div>

          <div className="info-panel">
            <p><b>Estado de Luz:</b> {data.estadoLuz ?? "--"}</p>
            <p><b>Light A0:</b> {data.lightA0 ?? "--"}</p>
            <p><b>Light Digital:</b> {data.lightDO ?? "--"}</p>
            <p><b>Timestamp:</b> {data.timestamp ?? "--"}</p>
          </div>
        </>
      ) : (
        <p className="loading-text">Cargando datos desde Firebase...</p>
      )}

      <div id="n8n-chat"></div>
    </div>
  );
}
