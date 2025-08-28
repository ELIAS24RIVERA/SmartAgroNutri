// src/App.jsx
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from './context/AppContext';
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Inicio from "./components/Tabs/Dashboard.jsx";
import Logs from "./components/Tabs/Logs.jsx";
import Configuracion from "./components/Tabs/Configuracion.jsx";
import Mensajes from "./pages/Mensajes.jsx";

import "./styles/sidebar.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <AppProvider>
      <Router>
        <div className="app">
          <Sidebar isOpen={sidebarOpen} />
          <div className={`main-content ${sidebarOpen ? "" : "no-margin"}`}>
            <Topbar onToggleMenu={() => setSidebarOpen((v) => !v)} />
            <div className="content-area">
              <Routes>
                <Route path="/" element={<Inicio />} />
                {/* Reemplazamos Control por Inicio si no existe otro componente */}
                
                <Route path="/logs" element={<Logs />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/mensajes" element={<Mensajes />} />
              </Routes>
            </div>
            <div className="alerts-container">
              {/* Aquí puedes renderizar alertas globales */}
            </div>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}
