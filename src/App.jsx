import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Inicio from "./components/Tabs/Dashboard.jsx";
import Logs from "./components/Tabs/Usuarios.jsx";
import Estadistica from "./components/Tabs/Estadistica.jsx";
import Mensajes from "./pages/Mensajes.jsx";
import Login from "./pages/Login.jsx";
import Registrar from "./pages/Registrar.jsx";
import Home from "./pages/Home.jsx";

import "./styles/sidebar.css";
import Usuarios from "./components/Tabs/Usuarios.jsx";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [vista, setVista] = useState("dashboard"); // 👈 Estado actual de la vista

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/"; // 👈 Regresa al Home solo al cerrar sesión
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* 🔹 Páginas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registrar />} />

          {/* 🔹 Layout privado persistente */}
          <Route
            path="/*"
            element={
              <div className="app">
                <Sidebar
                  isOpen={sidebarOpen}
                  onLogout={handleLogout}
                  setVista={setVista} // 👈 Pasamos la función para cambiar vista
                />
                <div className={`main-content ${sidebarOpen ? "" : "no-margin"}`}>
                  <Topbar onToggleMenu={() => setSidebarOpen((v) => !v)} />
                  <div className="content-area">
                    {/* 👇 Mantiene todos los componentes montados y visibles según vista */}
                    <div style={{ display: vista === "dashboard" ? "block" : "none" }}>
                      <Inicio />
                    </div>
                    <div style={{ display: vista === "Usuarios" ? "block" : "none" }}>
                      <Usuarios />
                    </div>
                    <div style={{ display: vista === "Estadistica" ? "block" : "none" }}>
                      <Estadistica />
                    </div>
                    <div style={{ display: vista === "mensajes" ? "block" : "none" }}>
                      <Mensajes />
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </AppProvider>
    </Router>
  );
}
