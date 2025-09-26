import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartLine,
  FaHome,
  FaChartBar,
  FaCog,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({ isOpen, onLogout }) {
  return (
    <div className={`sidebar ${isOpen ? "active" : ""}`}>
      <div className="sidebar-header">
        <h2>
          <FaChartLine style={{ marginRight: "10px", color: "#60a5fa" }} /> Mi
          Dashboard
        </h2>
      </div>

      <ul>
        <li>
          {/* 👈 aquí cambiamos de "/" a "/dashboard" */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaHome /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/configuracion"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaCog /> Configuración
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/logs"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaChartBar /> Logs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mensajes"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaEnvelope /> Mensajes
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">R.R.</div>
          <div>
            <div style={{ fontWeight: 500 }}>Hamlet Rivera</div>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Administrador
            </div>
          </div>
        </div>

        {/* ✅ Botón de cerrar sesión */}
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
