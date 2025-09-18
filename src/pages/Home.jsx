// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Sistema Nutricional de Áreas Verdes – ISTAP</h1>
      </header>

      <main className="flex-1">
        <section className="home-section">
          <motion.img
            src="/images/areas-verdes.jpg"
            alt="Áreas verdes con sensor"
            className="home-image"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          />

          <motion.h2
            className="home-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Monitoreo inteligente de tus áreas verdes
          </motion.h2>

          <motion.p
            className="home-paragraph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Con sensores de conductividad eléctrica, temperatura del suelo y luz,
            optimiza el riego y los nutrientes para mantener tus áreas verdes saludables.
          </motion.p>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/login" className="home-button">
              Ir al Dashboard
            </Link>
          </motion.div>
        </section>

        <section className="home-cards">
          <motion.div
            className="home-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="home-card-icon">💧</div>
            <h3 className="home-card-title">Conductividad</h3>
            <p className="home-card-text">
              Mide la salinidad y nutrientes del suelo.
            </p>
          </motion.div>

          <motion.div
            className="home-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="home-card-icon">☀️</div>
            <h3 className="home-card-title">Temperatura</h3>
            <p className="home-card-text">
              Controla la temperatura del suelo en tiempo real.
            </p>
          </motion.div>

          <motion.div
            className="home-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="home-card-icon">💡</div>
            <h3 className="home-card-title">Luz</h3>
            <p className="home-card-text">
              Analiza la cantidad de luz recibida.
            </p>
          </motion.div>
        </section>
      </main>

      <footer className="home-footer">
        © 2025 ISTAP – Sistema Nutricional de Áreas Verdes
      </footer>
    </div>
  );
}
