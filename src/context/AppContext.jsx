import React, { createContext, useState, useEffect, useRef } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [espIP, setEspIP] = useState(localStorage.getItem('esp-ip') || '192.168.1.100');
  const [espPort, setEspPort] = useState(localStorage.getItem('esp-port') || '80');
  const [connected, setConnected] = useState(false);
  const [datos, setDatos] = useState({
    temperatura: undefined,
    humedadAmbiental: undefined,
    humedad: undefined,
    bomba: false,
    automatico: false,
    humedadMinima: undefined,
    enEspera: false,
    tiempoEsperaRestante: 0,
    ultimoRiego: undefined,
    timestamp: undefined,
  });
  const [intervaloActualizacion, setIntervaloActualizacion] = useState(2000);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const updateInterval = useRef(null);
  const logContainerRef = useRef(null);

  useEffect(() => {
    agregarLog('Sistema iniciado');
    return () => {
      if (updateInterval.current) clearInterval(updateInterval.current);
    };
  }, []);

  const agregarLog = (msg) => {
    const newLog = `[${new Date().toLocaleTimeString()}] ${msg}`;
    setLogs((prev) => [...prev, newLog]);
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  };

  const mostrarAlerta = (mensaje, tipo) => {
    const id = Math.random();
    setAlerts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 4000);
  };

  const handleConnect = () => {
    if (!espIP) {
      mostrarAlerta('Por favor, ingresa la IP del ESP8266', 'error');
      return;
    }
    localStorage.setItem('esp-ip', espIP);
    localStorage.setItem('esp-port', espPort);
    if (updateInterval.current) clearInterval(updateInterval.current);
    updateInterval.current = setInterval(obtenerDatos, intervaloActualizacion);
    obtenerDatos();
    agregarLog(`Intentando conectar a ${espIP}:${espPort}`);
    mostrarAlerta('Intentando conectar con ESP8266...', 'warning');
  };

  const desconectarESP = () => {
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
    }
    setConnected(false);
    agregarLog('Desconectado manualmente');
    mostrarAlerta('Desconectado del ESP8266', 'error');
  };

  const obtenerDatos = async () => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/datos`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const newDatos = await response.json();
      setDatos(newDatos);
      if (!connected) {
        setConnected(true);
        agregarLog(`✅ Conectado exitosamente a ${espIP}:${espPort}`);
        mostrarAlerta('Conectado exitosamente', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      if (connected) {
        setConnected(false);
        agregarLog(`❌ Error de conexión: ${error.message}`);
        mostrarAlerta('Error de conexión', 'error');
      }
    }
  };

  const controlarBomba = async (encender) => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/bomba`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: encender }),
      });
      if (!response.ok) throw new Error('Error HTTP');
      agregarLog(encender ? 'Bomba ENCENDIDA' : 'Bomba APAGADA');
      mostrarAlerta(`Bomba ${encender ? 'encendida' : 'apagada'}`, encender ? 'success' : 'error');
      obtenerDatos();
    } catch (err) {
      agregarLog(`❌ Error al controlar bomba: ${err.message}`);
      mostrarAlerta('Error al enviar comando', 'error');
    }
  };

  const cambiarModo = async (modo) => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/modo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ automatico: modo }),
      });
      if (!response.ok) throw new Error('Error HTTP');
      agregarLog(`Modo automático ${modo ? 'ACTIVADO' : 'DESACTIVADO'}`);
      mostrarAlerta(`Modo automático ${modo ? 'activado' : 'desactivado'}`, 'warning');
      obtenerDatos();
    } catch (err) {
      agregarLog(`❌ Error al cambiar modo: ${err.message}`);
      mostrarAlerta('Error al cambiar modo', 'error');
    }
  };

  const actualizarUmbral = async (umbral) => {
    try {
      const response = await fetch(`http://${espIP}:${espPort}/api/umbral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ humedadMinima: parseInt(umbral) }),
      });
      if (!response.ok) throw new Error('Error HTTP');
      agregarLog(`Umbral de humedad actualizado a ${umbral}%`);
      mostrarAlerta(`Umbral actualizado a ${umbral}%`, 'success');
      obtenerDatos();
    } catch (err) {
      agregarLog(`❌ Error al actualizar umbral: ${err.message}`);
      mostrarAlerta('Error al actualizar umbral', 'error');
    }
  };

  const actualizarIntervalo = (valor) => {
    const newInterval = parseInt(valor) * 1000;
    if (newInterval >= 1000) {
      setIntervaloActualizacion(newInterval);
      if (updateInterval.current) clearInterval(updateInterval.current);
      updateInterval.current = setInterval(obtenerDatos, newInterval);
      agregarLog(`Intervalo de actualización cambiado a ${valor} s`);
      mostrarAlerta(`Intervalo: ${valor} segundos`, 'success');
    } else {
      mostrarAlerta('Intervalo inválido', 'error');
    }
  };

  const limpiarHistorial = () => {
    localStorage.clear();
    agregarLog('Historial de configuración limpiado');
    mostrarAlerta('Historial limpiado', 'warning');
    setEspIP('192.168.1.100');
    setEspPort('80');
  };

  const exportarDatos = () => {
    const exportData = {
      temperatura: datos.temperatura !== undefined ? datos.temperatura.toFixed(1) + '°C' : '--',
      humedadAmbiental: datos.humedadAmbiental !== undefined ? datos.humedadAmbiental.toFixed(1) + '%' : '--',
      humedadSuelo: datos.humedad !== undefined ? datos.humedad + '%' : '--',
      umbral: datos.humedadMinima !== undefined ? datos.humedadMinima + '%' : '--',
      ultimoRiego: datos.ultimoRiego !== undefined ? datos.ultimoRiego + ' s' : '--',
      timestamp: datos.timestamp || '--',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos_riego.json';
    a.click();
    URL.revokeObjectURL(url);
    agregarLog('Datos exportados');
    mostrarAlerta('Datos exportados en JSON', 'success');
  };

  const limpiarLogs = () => {
    setLogs([]);
    agregarLog('Logs limpiados');
  };

  return (
    <AppContext.Provider
      value={{
        espIP,
        setEspIP,
        espPort,
        setEspPort,
        connected,
        datos,
        handleConnect,
        desconectarESP,
        controlarBomba,
        cambiarModo,
        actualizarUmbral,
        actualizarIntervalo,
        limpiarHistorial,
        exportarDatos,
        logs,
        limpiarLogs,
        logContainerRef,
        agregarLog,
        mostrarAlerta,
        alerts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
