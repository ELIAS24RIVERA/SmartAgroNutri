import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Inicio from "./components/Tabs/Dashboard.jsx";
import Logs from "./components/Tabs/Logs.jsx";
import Configuracion from "./components/Tabs/Configuracion.jsx";
import Mensajes from "./pages/Mensajes.jsx";
import Login from "./pages/Login.jsx";
import Registrar from "./pages/Registrar.jsx";
import Home from "./pages/Home.jsx";

import "./styles/sidebar.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ función para cerrar sesión
  const handleLogout = () => {
    // Borra cualquier dato de sesión
    localStorage.removeItem("usuario"); // si usas localStorage
    // Redirige al inicio
    window.location.href = "/"; // 👈 aquí te manda al inicio (Home)
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/dashboard"
            element={
              <div className="app">
                {/* ✅ pasamos handleLogout aquí */}
                <Sidebar isOpen={sidebarOpen} onLogout={handleLogout} />
                <div className={`main-content ${sidebarOpen ? "" : "no-margin"}`}>
                  <Topbar onToggleMenu={() => setSidebarOpen((v) => !v)} />
                  <div className="content-area">
                    <Inicio />
                  </div>
                </div>
              </div>
            }
          />

          <Route path="/logs" element={<Logs />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/mensajes" element={<Mensajes />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registrar />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}
