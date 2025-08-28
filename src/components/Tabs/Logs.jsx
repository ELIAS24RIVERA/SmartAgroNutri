// Logs.jsx
import React from "react";

const Logs = ({ logs = [], limpiarLogs }) => {
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
        <button className="btn" onClick={limpiarLogs} style={{ marginTop: '15px' }}>
          <span>🗑️</span> Limpiar Logs xd
        </button>
      </div>
    </div>
  );
};

export default Logs;