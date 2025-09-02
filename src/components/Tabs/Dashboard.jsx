import React, { useState, useEffect, useRef } from "react";
import "../../styles/Dashboard.css";

// 🔹 Firebase Realtime Database
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

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

// Inicializamos Firebase solo si no está inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function MonitorSuelo() {
  const [esp32IP, setEsp32IP] = useState("192.168.43.114");
  const [isConnected, setIsConnected] = useState(false);

  const [sensores, setSensores] = useState({
    conductivity: { label: "Conductividad Eléctrica", value: "--", unit: "µS/cm", icon: "⚡", desc: "Concentración de sales y nutrientes" },
    temperature: { label: "Temperatura del Suelo", value: "--", unit: "°C", icon: "🌡️", desc: "Actividad microbiana y raíces" },
    light: { label: "Luz Ambiental", value: "--", unit: "%", icon: "💡", desc: "Midiendo intensidad de luz" },
  });

  const [statusMessage, setStatusMessage] = useState("🔄 Esperando conexión con ESP32...");
  const [statusClass, setStatusClass] = useState("status-bar status-connecting");
  const [lastUpdate, setLastUpdate] = useState("--");
  const [intervalo, setIntervalo] = useState(5);
  const [historial, setHistorial] = useState([]);

  const refreshIconRef = useRef(null);
  const intervalRef = useRef(null);

  // 🔹 Calibraciones (ajustadas a rangos más reales) -------------------
  // Conductividad típica en suelo: 0 - 5000 µS/cm
  const calibrarConductividad = (raw) => {
    const value = (raw / 4095) * 5000; // mapear a 0-5000 µS/cm
    return Number(value.toFixed(0));
  };

  // Temperatura: sensor suele dar valores en °C directos, solo afinamos offset
  const calibrarTemperatura = (raw) => {
    const value = raw * 0.1 + 20; // ejemplo: raw=200 → 40°C
    return Number(value.toFixed(1));
  };

  // Luz: 0 (oscuro) → 100% (máxima luz)
  const calibrarLuz = (raw) => {
    const value = 100 - (raw / 4095) * 100;
    return Number(Math.max(0, Math.min(100, value)).toFixed(1));
  };

  const updateStatusBar = (message, status) => {
    setStatusMessage(message);
    setStatusClass(`status-bar status-${status}`);
  };

  // 🔹 Obtener datos del ESP32
  const fetchSensorData = async () => {
    if (!esp32IP) {
      updateStatusBar("⚠️ Configura la IP del ESP32 primero", "offline");
      return;
    }

    if (refreshIconRef.current) refreshIconRef.current.classList.add("loading");

    try {
      const response = await fetch(`http://${esp32IP}/data`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      // Calibrar valores
      const cond = calibrarConductividad(data.conductivity);
      const temp = calibrarTemperatura(data.temperature);
      const luz = calibrarLuz(data.lightA0);

      // Actualizar estado dinámico
      setSensores({
        conductivity: { ...sensores.conductivity, value: cond },
        temperature: { ...sensores.temperature, value: temp },
        light: {
          ...sensores.light,
          value: luz,
          desc: data.lightDO === 0 ? "💡 Mucha luz detectada" : "🌑 Poca luz / sombra detectada",
        },
      });

      updateStatusBar("✅ ESP32 conectado y funcionando correctamente", "online");
      setIsConnected(true);
      const fecha = new Date().toLocaleString("es-ES");
      setLastUpdate(fecha);

      // Guardar en Firebase
      const lecturasRef = ref(db, "lecturas");
      await push(lecturasRef, {
        conductivity: cond,
        temperature: temp,
        light: luz,
        lightDesc: data.lightDO === 0 ? "Mucha luz" : "Poca luz",
        timestamp: Date.now(),
      });

      // Guardar historial local (máx 5 últimas lecturas)
      setHistorial((prev) => [{ cond, temp, luz, fecha }, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error("Error al conectar con ESP32:", error);
      updateStatusBar("❌ Error de conexión - Verifica la IP y el ESP32", "offline");
      setIsConnected(false);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // 🔄 Reintentar en 10s
      setTimeout(connectToESP32, 10000);
    } finally {
      if (refreshIconRef.current) refreshIconRef.current.classList.remove("loading");
    }
  };

  const connectToESP32 = () => {
    if (!esp32IP) {
      alert("Por favor ingresa la dirección IP del ESP32");
      return;
    }

    updateStatusBar("Conectando con ESP32...", "connecting");
    fetchSensorData().then(() => {
      if (isConnected) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchSensorData, intervalo * 1000);
      }
    });
  };

  // 🔹 Arrancar el envío automático al montar (sin grabar mensaje de prueba)
  useEffect(() => {
    connectToESP32();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esp32IP, intervalo]);

  return (
    <div className="main-container">
      <div className="header">
        <h1>🌱 Monitor de Análisis de Suelo</h1>
        <p>Sistema ESP32 para monitoreo de sensores en tiempo real</p>
      </div>

      {/* Configuración de conexión */}
      <div className="connection-setup">
        <h3>⚙️ Configuración de Conexión</h3>
        <div className="ip-input-group">
          <input
            type="text"
            className="ip-input"
            value={esp32IP}
            onChange={(e) => setEsp32IP(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && connectToESP32()}
            placeholder="Dirección IP del ESP32 (ej: 192.168.1.100)"
          />
          <select value={intervalo} onChange={(e) => setIntervalo(Number(e.target.value))}>
            <option value={5}>Cada 5s</option>
            <option value={10}>Cada 10s</option>
            <option value={30}>Cada 30s</option>
          </select>
          <button className="connect-btn" onClick={connectToESP32}>Conectar</button>
        </div>
      </div>

      {/* Barra de estado */}
      <div id="statusBar" className={statusClass}>{statusMessage}</div>

      {/* Tarjetas dinámicas de sensores */}
      <div className="sensors-grid">
        {Object.entries(sensores).map(([key, sensor]) => (
          <div key={key} className={`sensor-card ${key}-card`}>
            <div className="sensor-icon">{sensor.icon}</div>
            <div className="sensor-label">{sensor.label}</div>
            <div className="sensor-value">{sensor.value}</div>
            <div className="sensor-unit">{sensor.unit}</div>
            <div className="sensor-description">{sensor.desc}</div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <div className="controls">
        <button className="refresh-btn" onClick={fetchSensorData}>
          <span ref={refreshIconRef}>🔄</span> Actualizar Datos
        </button>
        <div className="last-update">Última actualización: {lastUpdate}</div>
      </div>

      {/* Historial local */}
      <div className="history">
        <h3>📜 Últimas Lecturas</h3>
        <ul>
          {historial.map((h, i) => (
            <li key={i}>
              {h.fecha} → 🌡️ {h.temp}°C | ⚡ {h.cond} µS/cm | 💡 {h.luz}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
