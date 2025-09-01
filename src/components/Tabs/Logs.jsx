// Logs.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig"; // tu configuración de Firebase

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logsRef = ref(db, "lecturas");
    onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const registros = Object.entries(data).map(([key, value]) => {
          return `📅 ${new Date(Number(key)).toLocaleString()} | 🌱 EC: ${value.ec} dS/m | 🌡️ Temp: ${value.temperatura} °C | 💡 Luz: ${value.luz} lx`;
        });
        setLogs(registros.reverse()); // para que el último aparezca arriba
      } else {
        setLogs(["⚠️ No hay datos de sensores disponibles"]);
      }
    });
  }, []);

  const limpiarLogs = () => setLogs([]);

  return (
    <div id="logs" className="tab-content">
      <h2>Registro de Actividades</h2>
      <div className="control-section">
        <h3>Log en Tiempo Real</h3>
        <div className="log-container" id="log-container">
          {logs.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))}
        </div>
        <button className="btn" onClick={limpiarLogs} style={{ marginTop: "15px" }}>
          <span>🗑️</span> Limpiar Logs
        </button>
      </div>
    </div>
  );
};

export default Logs;
