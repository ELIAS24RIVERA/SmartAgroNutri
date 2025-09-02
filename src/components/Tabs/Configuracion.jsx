// src/components/Tabs/Configuracion.jsx
import React, { useState, useRef } from "react";
import "../../styles/Configuracion.css";

// 🔹 Firebase Realtime Database
import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove, get } from "firebase/database";

// Configuración de Firebase
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

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Configuracion() {
  const [esp32IP, setEsp32IP] = useState("192.168.43.114");
  const [intervalo, setIntervalo] = useState(5); // segundos
  const intervalRef = useRef(null);

  // 🔹 Función para aplicar intervalo de actualización
  const aplicarIntervalo = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      console.log("📡 Consultando ESP32 cada", intervalo, "segundos...");
      fetch(`http://${esp32IP}/data`)
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ Datos recibidos:", data);
        })
        .catch((err) => console.error("❌ Error conexión ESP32:", err));
    }, intervalo * 1000);

    alert(`⏱️ Intervalo aplicado: ${intervalo} segundos`);
  };

  // 🔹 Función para limpiar historial de lecturas en Firebase
  const limpiarHistorial = async () => {
    try {
      await remove(ref(db, "lecturas"));
      alert("🧹 Historial de sensores eliminado con éxito");
    } catch (error) {
      console.error("Error al limpiar historial:", error);
      alert("❌ No se pudo limpiar el historial");
    }
  };

  // 🔹 Función para exportar datos (descargar JSON)
  const exportarDatos = async () => {
    try {
      const snapshot = await get(ref(db, "lecturas"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "lecturas_sensores.json";
        a.click();
        URL.revokeObjectURL(url);
        alert("📤 Datos exportados con éxito");
      } else {
        alert("⚠️ No hay datos para exportar");
      }
    } catch (error) {
      console.error("Error al exportar:", error);
      alert("❌ No se pudieron exportar los datos");
    }
  };

  return (
    <div className="tab-content">
      <h2>⚙️ Configuración del Sistema Nutrición - ISTAP</h2>

      <div className="control-section">
        <div className="control-grid">
          {/* Configuración de ESP32 */}
          <div className="control-group">
            <div className="control-title">
              <span role="img" aria-label="conexion">
                🌐
              </span>{" "}
              Conexión con ESP32
            </div>

            <div className="form-group">
              <label className="form-label">Dirección IP del ESP32:</label>
              <input
                type="text"
                className="form-input"
                value={esp32IP}
                onChange={(e) => setEsp32IP(e.target.value)}
              />
            </div>
          </div>

          {/* Configuración de Intervalo */}
          <div className="control-group">
            <div className="control-title">
              <span role="img" aria-label="reloj">
                ⏱️
              </span>{" "}
              Intervalo de Sensores
            </div>

            <div className="form-group">
              <label className="form-label">
                Intervalo de actualización (segundos):
              </label>
              <input
                type="number"
                className="form-input"
                min="1"
                max="60"
                value={intervalo}
                onChange={(e) => setIntervalo(Number(e.target.value))}
              />
            </div>
            <button className="btn" onClick={aplicarIntervalo}>
              Aplicar Intervalo
            </button>
          </div>

          {/* Control de Datos */}
          <div className="control-group">
            <div className="control-title">
              <span role="img" aria-label="grafico">
                📈
              </span>{" "}
              Gestión de Datos de Sensores
            </div>
            <button className="btn warning" onClick={limpiarHistorial}>
              🧹 Limpiar Historial de Sensores
            </button>
            <button className="btn" onClick={exportarDatos}>
              📤 Exportar Datos de Sensores
            </button>
          </div>

          {/* Sensores Activos */}
          <div className="control-group">
            <div className="control-title">
              <span role="img" aria-label="lupa">
                🔍
              </span>{" "}
              Sensores Activos
            </div>
            <ul>
              <li>⚡ Sensor de Conductividad Eléctrica (EC)</li>
              <li>🌡️ Sensor de Temperatura del Suelo</li>
              <li>💡 Sensor de Luz Ambiental</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
