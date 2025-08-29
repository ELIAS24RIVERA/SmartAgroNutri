// src/components/Tabs/Configuracion.jsx
import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Configuracion = () => {
  const { actualizarIntervalo, limpiarHistorial, exportarDatos } =
    useContext(AppContext);
  const [intervalo, setIntervalo] = useState(2);

  return (
    <div className="tab-content">
      <h2>Configuración del Sistema Nitricion - ISTAP</h2>

      <div className="control-section">
        <div className="control-grid">

          {/* Configuración de Sensores */}
          <div className="control-group">
            <div className="control-title">
              <span>🌿</span> Parámetros de Sensores ESP32
            </div>

            <div className="form-group">
              <label className="form-label">
                Intervalo de actualización de datos (segundos):
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
            <button className="btn" onClick={() => actualizarIntervalo(intervalo)}>
              <span>⏱️</span> Aplicar Intervalo
            </button>
          </div>

          {/* Control de Datos */}
          <div className="control-group">
            <div className="control-title">
              <span>📈</span> Gestión de Datos de Sensores
            </div>
            <button className="btn warning" onClick={limpiarHistorial}>
              <span>🧹</span> Limpiar Historial de Sensores
            </button>
            <button className="btn" onClick={exportarDatos}>
              <span>📤</span> Exportar Datos de Sensores
            </button>
          </div>

          {/* Información de Sensores */}
          <div className="control-group">
            <div className="control-title">
              <span>🔍</span> Sensores Activos
            </div>
            <ul>
              <li>🔌 Sensor de Conductividad Eléctrica (EC)</li>
              <li>🌡️ Sensor de Temperatura del Suelo</li>
              <li>💡 Sensor de Luz Ambiental</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Configuracion;
