import React, { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../../firebaseConfig.js";
import "../../styles/Estadistica.css";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Registrar componentes Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Estadistica() {
  const [lecturas, setLecturas] = useState([]);
  const [rango, setRango] = useState("ultimo");
  const [orden, setOrden] = useState("default");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // 🔹 Cargar lecturas desde Firebase
  useEffect(() => {
    const lecturasRef = ref(db, "lecturas");

    const listener = onValue(lecturasRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // 🔧 Adaptamos las claves de los sensores a tus nombres reales
        const valores = Object.keys(data).map((key) => ({
          id: key,
          temperatura: data[key].temperature || 0,
          ce: data[key].conductivity || 0,
          luz: data[key].light || 0,
          lightDesc: data[key].lightDesc || "",
          timestamp: data[key].timestamp || 0,
        }));

        // 🔹 Ordenar según el valor de "orden"
        const sorted = [...valores].sort((a, b) => {
          if (orden === "asc") return a.temperatura - b.temperatura;
          if (orden === "desc") return b.temperatura - a.temperatura;
          return 0;
        });

        setLecturas(sorted);
      } else {
        console.warn("⚠️ No hay datos disponibles en Firebase");
        setLecturas([]);
      }
    });

    // Limpieza del listener
    return () => off(lecturasRef, "value", listener);
  }, [orden]);

  // 🔹 Obtener última lectura o valores predeterminados
  const ultimaLectura =
    lecturas.length > 0 ? lecturas[lecturas.length - 1] : { temperatura: 0, ce: 0, luz: 0 };

  // 🔹 Filtrar lecturas por rango
  const filtrarPorRango = () => {
    switch (rango) {
      case "7dias":
        return lecturas.slice(-7);
      case "30dias":
        return lecturas.slice(-30);
      default:
        return [ultimaLectura];
    }
  };

  const lecturasFiltradas = filtrarPorRango();

  // 🔹 Cálculos de estadísticas
  const calcularPromedios = (campo) =>
    (
      lecturasFiltradas.reduce((acc, item) => acc + (item[campo] || 0), 0) /
      (lecturasFiltradas.length || 1)
    ).toFixed(2);

  const calcularMaximo = (campo) =>
    Math.max(...lecturasFiltradas.map((i) => i[campo] || 0), 0);

  const calcularMinimo = (campo) =>
    Math.min(...lecturasFiltradas.map((i) => i[campo] || 0), 0);

  // 🔹 Datos para los gráficos
  const barDataActual = {
    labels: ["Actual"],
    datasets: [
      { label: "CE", data: [ultimaLectura.ce], backgroundColor: "#32C5FF" },
      { label: "Temperatura", data: [ultimaLectura.temperatura], backgroundColor: "#8E6BFF" },
      { label: "Luz", data: [ultimaLectura.luz], backgroundColor: "#FFD233" },
    ],
  };

  const pieData = {
    labels: ["CE", "Temperatura", "Luz"],
    datasets: [
      {
        data: [ultimaLectura.ce, ultimaLectura.temperatura, ultimaLectura.luz],
        backgroundColor: ["#32C5FF", "#8E6BFF", "#FFD233"],
        borderWidth: 1,
      },
    ],
  };

  const generarDataBarras = (campo, color) => ({
    labels: ["Promedio", "Máximo", "Mínimo"],
    datasets: [
      {
        label: campo.toUpperCase(),
        data: [calcularPromedios(campo), calcularMaximo(campo), calcularMinimo(campo)],
        backgroundColor: [color, "#FF6B6B", "#6BFF9E"],
      },
    ],
  });

  // 🔹 Chat flotante
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { from: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const botReply = {
        from: "bot",
        text: "🤖 ¡Hola! Estoy aquí para ayudarte con el sistema de nutrición de áreas verdes 🌱",
      };
      setChatMessages((prev) => [...prev, botReply]);
    }, 600);

    setChatInput("");
  };

  return (
    <div className="estadistica-container">
      <h2 className="titulo">📊 Estadísticas del Sistema</h2>

      {/* Filtros superiores */}
      <div className="filtros">
        <label>Rango:</label>
        <select value={rango} onChange={(e) => setRango(e.target.value)} className="dropdown">
          <option value="ultimo">Último dato</option>
          <option value="7dias">Últimos 7 días</option>
          <option value="30dias">Últimos 30 días</option>
        </select>

        <label>Orden:</label>
        <select value={orden} onChange={(e) => setOrden(e.target.value)} className="dropdown">
          <option value="default">Por defecto</option>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>

      {/* Gráficos superiores */}
      <div className="graficos-superiores">
        <div className="grafico-barra">
          <Bar data={barDataActual} />
        </div>
        <div className="grafico-pie">
          <Pie data={pieData} />
        </div>
      </div>

      <h3 className="subtitulo">📈 Promedio, Máximo y Mínimo</h3>

      {/* Gráficos inferiores */}
      <div className="graficos-inferiores">
        <div className="grafico-mini">
          <h4>CE (µS/cm)</h4>
          <Bar data={generarDataBarras("ce", "#32C5FF")} />
        </div>
        <div className="grafico-mini">
          <h4>Temperatura (°C)</h4>
          <Bar data={generarDataBarras("temperatura", "#8E6BFF")} />
        </div>
        <div className="grafico-mini">
          <h4>Luz (%)</h4>
          <Bar data={generarDataBarras("luz", "#FFD233")} />
        </div>
      </div>

      {/* 💬 Chat flotante */}
      <div className="chat-fab" onClick={() => setIsChatOpen(!isChatOpen)}>
        💬
      </div>

      {isChatOpen && (
        <div className="chat-box">
          <div className="chat-header">Asistente Virtual 🌱</div>
          <div className="chat-messages">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${msg.from === "user" ? "user-msg" : "bot-msg"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}
