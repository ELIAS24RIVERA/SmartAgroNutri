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
          
          {/* Grupo de actualización */}
          <div className="control-group">
            <div className="control-title">
              <span>🔧</span>
              Configuración de Actualización
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
            <button className="btn" onClick={() => actualizarIntervalo(intervalo)}>
              <span>⏱️</span> Aplicar Intervalo
            </button>
          </div>

          {/* Grupo de datos */}
          <div className="control-group">
            <div className="control-title">
              <span>📊</span>
              Configuración de Datos
            </div>
            <button className="btn warning" onClick={limpiarHistorial}>
              <span>🗑️</span> Limpiar Historial
            </button>
            <button className="btn" onClick={exportarDatos}>
              <span>📥</span> Exportar Datos
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Configuracion;
