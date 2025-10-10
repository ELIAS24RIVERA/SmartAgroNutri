import React, { useState, useEffect, useRef } from "react";
import "../../styles/Dashboard.css";

// 🔹 Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// 🔹 Firebase Realtime Database
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

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

// Inicializamos Firebase solo una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// 🎨 Colores para los gráficos
const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function Dashboard() {
  const [esp32IP, setEsp32IP] = useState("192.168.43.114");
  const [isConnected, setIsConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState("🔄 Esperando conexión con ESP32...");
  const [statusClass, setStatusClass] = useState("status-bar status-connecting");
  const [lastUpdate, setLastUpdate] = useState("--");
  const [intervalo, setIntervalo] = useState(5);
  const [historial, setHistorial] = useState([]);

  const refreshIconRef = useRef(null);
  const intervalRef = useRef(null);
  const abortRef = useRef(null);

  // 🔹 Estados de sensores
  const [sensores, setSensores] = useState({
    conductivity: { label: "Conductividad Eléctrica", value: "--", unit: "µS/cm", icon: "⚡", desc: "Concentración de sales y nutrientes" },
    temperature: { label: "Temperatura del Suelo", value: "--", unit: "°C", icon: "🌡️", desc: "Actividad microbiana y raíces" },
    light: { label: "Luz Ambiental", value: "--", unit: "%", icon: "💡", desc: "Midiendo intensidad de luz" },
  });

  // ========= Funciones de calibración =========
  const calibrarConductividad = (raw) => (isNaN(raw) ? 0 : Number(((raw / 4095) * 5000).toFixed(0)));
  const calibrarTemperatura = (raw) => (isNaN(raw) ? 0 : Number((raw * 0.1 + 20).toFixed(1)));
  const calibrarLuz = (raw) => {
    if (isNaN(raw)) return 0;
    const value = 100 - (raw / 4095) * 100;
    return Number(Math.max(0, Math.min(100, value)).toFixed(1));
  };

  // ========= Estado de barra =========
  const updateStatusBar = (message, status) => {
    setStatusMessage(message);
    setStatusClass(`status-bar status-${status}`);
  };

  // ========= Obtener datos del ESP32 =========
  const fetchSensorData = async () => {
    if (!esp32IP) {
      updateStatusBar("⚠️ Configura la IP del ESP32 primero", "offline");
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    if (refreshIconRef.current) refreshIconRef.current.classList.add("loading");

    try {
      const response = await fetch(`http://${esp32IP}/data`, { signal });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const cond = calibrarConductividad(data.conductivity);
      const temp = calibrarTemperatura(data.temperature);
      const luz = calibrarLuz(data.lightA0);

      setSensores({
        conductivity: { ...sensores.conductivity, value: cond },
        temperature: { ...sensores.temperature, value: temp },
        light: {
          ...sensores.light,
          value: luz,
          desc: data.lightDO === 0 ? "💡 Mucha luz detectada" : "🌑 Poca luz / sombra detectada",
        },
      });

      setIsConnected(true);
      updateStatusBar("✅ ESP32 conectado y funcionando correctamente", "online");

      const fecha = new Date().toLocaleString("es-ES");
      setLastUpdate(fecha);

      // 🔹 Guardar lectura en Firebase
      await push(ref(db, "lecturas"), {
        conductivity: cond,
        temperature: temp,
        light: luz,
        lightDesc: data.lightDO === 0 ? "Mucha luz" : "Poca luz",
        timestamp: Date.now(),
      });

      setHistorial((prev) => [{ cond, temp, luz, fecha }, ...prev.slice(0, 4)]);
    } catch (error) {
      console.warn("⚠️ Fallo temporal de conexión:", error.message);
      updateStatusBar("⚠️ Reintentando conexión con ESP32...", "connecting");
      setIsConnected(false);
    } finally {
      if (refreshIconRef.current) refreshIconRef.current.classList.remove("loading");
    }
  };

  // ========= Conexión =========
  const connectToESP32 = () => {
    if (!esp32IP) {
      alert("Por favor ingresa la dirección IP del ESP32");
      return;
    }
    updateStatusBar("Conectando con ESP32...", "connecting");

    if (intervalRef.current) clearInterval(intervalRef.current);
    fetchSensorData();
    intervalRef.current = setInterval(fetchSensorData, intervalo * 1000);
  };

  useEffect(() => {
    connectToESP32();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [esp32IP, intervalo]);

  // ========= Estados adicionales =========
  const [humedad, setHumedad] = useState("--%");
  const [tiempoRestante, setTiempoRestante] = useState("0 S");
  const [estadoESP, setEstadoESP] = useState("No");
  const [ultimaConexion, setUltimaConexion] = useState("-- S");
  const [ipESP, setIpESP] = useState("192.168.43.114");
  const [timesync, setTimesync] = useState("--");

  useEffect(() => {
    const interval = setInterval(() => {
      setHumedad("45%");
      setTiempoRestante("30 S");
      setEstadoESP("Sí");
      setUltimaConexion(new Date().toLocaleString());
      setTimesync("OK");
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="main-container">
      <div className="header">
        <h1>🌱 Monitor de Análisis de Suelo</h1>
        <p>Sistema ESP32 para monitoreo de sensores en tiempo real</p>
      </div>

      {/* Configuración */}
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
          <button className="connect-btn" onClick={connectToESP32}>
            Conectar
          </button>
        </div>
      </div>

      <div id="statusBar" className={statusClass}>{statusMessage}</div>

      {/* Sensores */}
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

      {/* Botón de actualización */}
      <div className="controls">
        <button className="refresh-btn" onClick={fetchSensorData}>
          <span ref={refreshIconRef}>🔄</span> Actualizar Datos
        </button>
        <div className="last-update">Última actualización: {lastUpdate}</div>
      </div>

      {/* Panel adicional */}
      <div className="dashboard-container">
        <div className="status-panel">
          <div className="status-item"><span className="status-title">Humedad</span><span className="status-value">{humedad}</span></div>
          <div className="status-item"><span className="status-title">Tiempo Restante</span><span className="status-value">{tiempoRestante}</span></div>
          <div className="status-item"><span className="status-title">Estado de ESP</span><span className="status-value">{estadoESP}</span></div>
          <div className="status-item"><span className="status-title">Última Conexión</span><span className="status-value">{ultimaConexion}</span></div>
          <div className="status-item"><span className="status-title">IP del ESP32</span><span className="status-value">{ipESP}</span></div>
          <div className="status-item"><span className="status-title">Timesync</span><span className="status-value">{timesync}</span></div>
        </div>
      </div>

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
