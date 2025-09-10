// src/App.jsx
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
import Login from "./pages/Login.jsx"; // 👈 nuevo import

import "./styles/sidebar.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 👈 login state

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Si no está logueado → mostrar Login
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // Si está logueado → mostrar Dashboard
  return (
    <AppProvider>
      <Router>
        <div className="app">
          {/* ✅ Pasamos onLogout al Sidebar */}
          <Sidebar isOpen={sidebarOpen} onLogout={() => setIsLoggedIn(false)} />
          <div className={`main-content ${sidebarOpen ? "" : "no-margin"}`}>
            <Topbar onToggleMenu={() => setSidebarOpen((v) => !v)} />
            <div className="content-area">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/mensajes" element={<Mensajes />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}
