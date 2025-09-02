// Logs.jsx
import React, { useEffect, useState } from "react";

// 🔹 Firebase Realtime Database
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";

// Configuración de Firebase (misma que MonitorSuelo)
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

// 🔹 Evitar el error de "duplicate-app"
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logsRef = ref(db, "lecturas");

    // Escuchar en tiempo real
    onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const registros = Object.entries(data).map(([key, value]) => {
          const fecha = new Date(value.timestamp || key).toLocaleString("es-ES");

          return `📅 ${fecha} | 🌱 EC: ${value.conductivity ?? "N/A"} µS/cm | 🌡️ Temp: ${value.temperature ?? "N/A"} °C | 💡 Luz: ${value.light ?? "N/A"} %`;
        });

        setLogs(registros.reverse()); // Mostrar lo más reciente arriba
      } else {
        setLogs(["⚠️ No hay datos de sensores disponibles"]);
      }
    });

    // 🔴 Limpiar listener al desmontar
    return () => {
      off(logsRef);
    };
  }, []);

  const limpiarLogs = () => setLogs([]);

  return (
    <div id="logs" className="tab-content">
      <h2>Registro de Actividades</h2>

      <div className="control-section">
        <h3>Log en Tiempo Real</h3>

        <div
          className="log-container"
          id="log-container"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
          }}
        >
          {logs.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))}
        </div>

        <button
          className="btn"
          onClick={limpiarLogs}
          style={{ marginTop: "15px" }}
        >
          <span>🗑️</span> Limpiar Logs
        </button>
      </div>
    </div>
  );
};

export default Logs;
