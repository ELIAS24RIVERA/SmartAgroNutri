// Logs.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // animaciones modernas

// 🔹 Firebase Realtime Database
import { initializeApp, getApps } from "firebase/app";
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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logsRef = ref(db, "lecturas");

    onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const registros = Object.entries(data).map(([key, value]) => {
          const fecha = new Date(value.timestamp || key).toLocaleString("es-ES");
          return {
            id: key,
            fecha,
            conductivity: value.conductivity ?? "N/A",
            temperature: value.temperature ?? "N/A",
            light: value.light ?? "N/A",
          };
        });

        setLogs(registros.reverse());
      } else {
        setLogs([]);
      }
    });

    return () => off(logsRef);
  }, []);

  const limpiarLogs = () => setLogs([]);

  // 🔹 Función para dar color dinámico
  const getBadgeColor = (type, value) => {
    if (value === "N/A") return "#999";

    if (type === "temperature") {
      if (value > 30) return "#e74c3c"; // rojo
      if (value < 15) return "#3498db"; // azul
      return "#2ecc71"; // verde
    }

    if (type === "light") {
      return value < 30 ? "#f39c12" : "#f1c40f"; // amarillo/naranja
    }

    if (type === "conductivity") {
      return value < 500 ? "#9b59b6" : "#8e44ad"; // púrpura
    }

    return "#555";
  };

  return (
    <div id="logs" className="tab-content">
      <h2>📜 Registro de Actividades</h2>

      <div className="control-section">
        <h3>Log en Tiempo Real</h3>

        <div
          className="log-container"
          id="log-container"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "12px",
            backgroundColor: "#fdfdfd",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <AnimatePresence>
            {logs.length > 0 ? (
              logs.map((log) => (
                <motion.div
                  key={log.id}
                  className="log-entry"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    marginBottom: "12px",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "#fff",
                    boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    📅 {log.fecha}
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "8px",
                        background: getBadgeColor("conductivity", log.conductivity),
                        color: "#fff",
                        fontSize: "0.85em",
                      }}
                    >
                      🌱 EC: {log.conductivity} µS/cm
                    </span>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "8px",
                        background: getBadgeColor("temperature", log.temperature),
                        color: "#fff",
                        fontSize: "0.85em",
                      }}
                    >
                      🌡️ Temp: {log.temperature} °C
                    </span>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "8px",
                        background: getBadgeColor("light", log.light),
                        color: "#fff",
                        fontSize: "0.85em",
                      }}
                    >
                      💡 Luz: {log.light} %
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p style={{ color: "#777", textAlign: "center" }}>
                ⚠️ No hay datos de sensores disponibles
              </p>
            )}
          </AnimatePresence>
        </div>

        <button
          className="btn"
          onClick={limpiarLogs}
          style={{
            marginTop: "15px",
            padding: "10px 18px",
            borderRadius: "8px",
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          🗑️ Limpiar Logs
        </button>
      </div>
    </div>
  );
};

export default Logs;
