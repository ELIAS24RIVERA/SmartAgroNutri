import React, { useState, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import "../../styles/Dashboard.css"

export default function MonitorSuelo() {
  const [esp32IP, setEsp32IP] = useState("192.168.1.100");
  const [isConnected, setIsConnected] = useState(false);
  const [conductivity, setConductivity] = useState("--");
  const [temperature, setTemperature] = useState("--");
  const [light, setLight] = useState("--");
  const [lightDesc, setLightDesc] = useState("Midiendo intensidad de luz en el entorno");
  const [statusMessage, setStatusMessage] = useState("🔄 Esperando conexión con ESP32...");
  const [statusClass, setStatusClass] = useState("status-bar status-connecting");
  const [lastUpdate, setLastUpdate] = useState("--");
  const refreshIconRef = useRef(null);
  const intervalRef = useRef(null);

  const updateStatusBar = (message, status) => {
    setStatusMessage(message);
    setStatusClass(`status-bar status-${status}`);
  };

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
      setConductivity(data.conductivity.toFixed(1));
      setTemperature(data.temperature.toFixed(1));
      setLight(data.lightA0);
      setLightDesc(data.lightDO === 0 ? "💡 Mucha luz detectada" : "🌑 Poca luz / sombra detectada");
      updateStatusBar("✅ ESP32 conectado y funcionando correctamente", "online");
      setIsConnected(true);
      setLastUpdate(new Date().toLocaleString("es-ES"));
    } catch (error) {
      console.error("Error al conectar con ESP32:", error);
      updateStatusBar("❌ Error de conexión - Verifica la IP y que el ESP32 esté encendido", "offline");
      setIsConnected(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } finally {
      if (refreshIconRef.current) refreshIconRef.current.classList.remove("loading");
    }
  };

  const connectToESP32 = () => {
    if (!esp32IP) {
      alert("Por favor ingresa la dirección IP del ESP32");
      return;
    }
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(esp32IP)) {
      alert("Por favor ingresa una dirección IP válida");
      return;
    }
    updateStatusBar("Conectando con ESP32...", "connecting");
    fetchSensorData().then(() => {
      if (isConnected) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchSensorData, 3000);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="main-container">
      
      <div className="header">
        <h1>🌱 Monitor de Análisis de Suelo</h1>
        <p>Sistema ESP32 para monitoreo de conductividad, temperatura y luz ambiental</p>
      </div>

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
          <button className="connect-btn" onClick={connectToESP32}>Conectar</button>
        </div>
        <p><strong>Nota:</strong> Verifica la IP de tu ESP32 en el Monitor Serie de Arduino IDE</p>
      </div>

      <div id="statusBar" className={statusClass}>
        {statusMessage}
      </div>

      <div className="sensors-grid">
        <div className="sensor-card conductivity-card">
          <div className="sensor-icon">⚡</div>
          <div className="sensor-label">Conductividad Eléctrica</div>
          <div className="sensor-value">{conductivity}</div>
          <div className="sensor-unit">µS/cm</div>
          <div className="sensor-description">Indica la concentración de sales y nutrientes en el suelo</div>
        </div>

        <div className="sensor-card temperature-card">
          <div className="sensor-icon">🌡️</div>
          <div className="sensor-label">Temperatura del Suelo</div>
          <div className="sensor-value">{temperature}</div>
          <div className="sensor-unit">°C</div>
          <div className="sensor-description">Afecta la actividad microbiana y el crecimiento de raíces</div>
        </div>

        <div className="sensor-card light-card">
          <div className="sensor-icon">💡</div>
          <div className="sensor-label">Luz Ambiental</div>
          <div className="sensor-value">{light}</div>
          <div className="sensor-unit">Nivel (A0)</div>
          <div className="sensor-description">{lightDesc}</div>
        </div>
      </div>

      <div className="controls">
        <button className="refresh-btn" onClick={fetchSensorData}>
          <span ref={refreshIconRef}>🔄</span> Actualizar Datos
        </button>
        <div className="last-update">Última actualización: {lastUpdate}</div>
      </div>
    </div>
  );
}
