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

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/"; // 👈 aquí te manda al Home sólo al cerrar sesión
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
          {/* Páginas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registrar />} />

          {/* Layout privado persistente */}
          <Route
            path="/*"
            element={
              <div className="app">
                <Sidebar isOpen={sidebarOpen} onLogout={handleLogout} />
                <div className={`main-content ${sidebarOpen ? "" : "no-margin"}`}>
                  <Topbar onToggleMenu={() => setSidebarOpen((v) => !v)} />
                  <div className="content-area">
                    <Routes>
                      <Route path="dashboard" element={<Inicio />} />
                      <Route path="Usuarios" element={<Usuarios />} />
                      <Route path="Estadistica" element={<Estadistica />} />
                      <Route path="mensajes" element={<Mensajes />} />
                    </Routes>
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
