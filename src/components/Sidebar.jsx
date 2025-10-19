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

export default function Sidebar({ isOpen, onLogout, setVista }) {
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
          {/* 👇 además de navegar, actualiza la vista sin desmontar el componente */}
          <NavLink
            to="/dashboard"
            onClick={() => setVista("dashboard")}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaHome /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Estadistica"
            onClick={() => setVista("Estadistica")}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaCog /> Estadística
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Usuarios"
            onClick={() => setVista("Usuarios")}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaChartBar /> Usuarios
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mensajes"
            onClick={() => setVista("mensajes")}
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
