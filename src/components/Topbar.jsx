// src/components/Topbar.jsx
import React from "react";

const Topbar = ({ onToggleMenu }) => {
  return (
    <div className="topbar">
      {/* Botón menú hamburguesa */}
      <button className="menu-toggle" onClick={onToggleMenu}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Buscador */}
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="Buscar..." />
      </div>

      {/* Menú usuario */}
      <div className="user-menu">
        <div className="notification-bell">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </div>
        <div className="user-avatar" style={{ background: "#10b981" }}>
          AH
        </div>
      </div>
    </div>
  );
};

export default Topbar;
