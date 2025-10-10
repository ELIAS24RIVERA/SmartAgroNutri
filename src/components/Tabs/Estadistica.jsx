import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig.js";
import "../../styles/Estadistica.css";
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

// Inicializar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Estadistica() {
  const [lecturas, setLecturas] = useState([]);
  const [rango, setRango] = useState("ultimo");
  const [orden, setOrden] = useState("default");

  // 🔹 Cargar lecturas desde Firebase
  useEffect(() => {
    const lecturasRef = ref(db, "lecturas");  // Accediendo a la base de datos en Firebase
    onValue(lecturasRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const valores = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        
        // Ordenar los datos según el estado de 'orden'
        const sortedLecturas = valores.sort((a, b) => {
          if (orden === "asc") {
            return a.temperatura - b.temperatura;  // Orden ascendente por temperatura
          } else if (orden === "desc") {
            return b.temperatura - a.temperatura;  // Orden descendente por temperatura
          }
          return 0; // Si es "default", no ordenar
        });

        setLecturas(sortedLecturas);  // Guardamos los datos en el estado
      } else {
        console.log("No hay datos disponibles");  // Para debugging
      }
    });
  }, [orden]);  // Agregar 'orden' como dependencia para actualizar cuando cambie

  // 🔹 Obtener la última lectura
  const ultimaLectura = lecturas[lecturas.length - 1] || {
    temperatura: 0,
    ce: 0,
    luz: 0,
  };

  // 🔹 Filtrar lecturas según rango de tiempo
  const filtrarPorRango = () => {
    if (rango === "ultimo") return [ultimaLectura];
    if (rango === "7dias") return lecturas.slice(-7);
    if (rango === "30dias") return lecturas.slice(-30);
    return lecturas;
  };

  const lecturasFiltradas = filtrarPorRango();

  // 🔹 Calcular estadísticas
  const calcularPromedios = (campo) =>
    (
      lecturasFiltradas.reduce((acc, item) => acc + (item[campo] || 0), 0) /
      lecturasFiltradas.length
    ).toFixed(2);

  const calcularMaximo = (campo) =>
    Math.max(...lecturasFiltradas.map((item) => item[campo] || 0));

  const calcularMinimo = (campo) =>
    Math.min(...lecturasFiltradas.map((item) => item[campo] || 0));

  // 🔹 Datos del gráfico de barras principal
  const barDataActual = {
    labels: ["Actual"],
    datasets: [
      {
        label: "CE",
        data: [ultimaLectura.ce || 0],
        backgroundColor: "#32C5FF",
      },
      {
        label: "Temperatura",
        data: [ultimaLectura.temperatura || 0],
        backgroundColor: "#8E6BFF",
      },
      {
        label: "Luz",
        data: [ultimaLectura.luz || 0],
        backgroundColor: "#FFD233",
      },
    ],
  };

  // 🔹 Datos del gráfico circular (última lectura)
  const pieData = {
    labels: ["CE", "Temperatura", "Luz"],
    datasets: [
      {
        data: [
          ultimaLectura.ce || 0,
          ultimaLectura.temperatura || 0,
          ultimaLectura.luz || 0,
        ],
        backgroundColor: ["#32C5FF", "#8E6BFF", "#FFD233"],
        borderWidth: 1,
      },
    ],
  };

  // 🔹 Datos para promedios, máximos y mínimos
  const generarDataBarras = (campo, color) => ({
    labels: ["Promedio", "Máximo", "Mínimo"],
    datasets: [
      {
        label: campo,
        data: [
          calcularPromedios(campo),
          calcularMaximo(campo),
          calcularMinimo(campo),
        ],
        backgroundColor: [color, "#FF6B6B", "#6BFF9E"],
      },
    ],
  });
  // ========= Chat flotante =========
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
  
    const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      setChatMessages((prev) => [...prev, { from: "user", text: chatInput }]);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { from: "bot", text: "🤖 Estoy aquí para ayudarte con el sistema de nutrición de áreas verdes 🌱" },
        ]);
      }, 800);
      setChatInput("");
    };

  return (
    <div className="estadistica-container">
      <h2 className="titulo">Rango de Tiempo</h2>

      <div className="filtros">
        <select
          value={rango}
          onChange={(e) => setRango(e.target.value)}
          className="dropdown"
        >
          <option value="ultimo">Último dato</option>
          <option value="7dias">Últimos 7 días</option>
          <option value="30dias">Últimos 30 días</option>
        </select>
      </div>

      <div className="graficos-superiores">
        <div className="grafico-barra">
          <Bar data={barDataActual} />
        </div>
        <div className="grafico-pie">
          <Pie data={pieData} />
        </div>
      </div>

      <h3 className="subtitulo">Barras de Promedio, Máximo y Mínimo</h3>

      <div className="filtros">
        <label>Rango:</label>
        <select
          value={rango}
          onChange={(e) => setRango(e.target.value)}
          className="dropdown"
        >
          <option value="7dias">Últimos 7 días</option>
          <option value="30dias">Últimos 30 días</option>
        </select>

        <label>Orden:</label>
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="dropdown"
        >
          <option value="default">Por defecto</option>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>

      <div className="graficos-inferiores">
        <div className="grafico-mini">
          <h4>CE (%)</h4>
          <Bar data={generarDataBarras("ce", "#32C5FF")} />
        </div>
        <div className="grafico-mini">
          <h4>Temperatura (%)</h4>
          <Bar data={generarDataBarras("temperatura", "#8E6BFF")} />
        </div>
        <div className="grafico-mini">
          <h4>Luz (%)</h4>
          <Bar data={generarDataBarras("luz", "#FFD233")} />
        </div>
      </div>
      {/* 💬 Chat flotante */}
      <div className="chat-fab" onClick={() => setIsChatOpen(!isChatOpen)}>💬</div>

      {isChatOpen && (
        <div className="chat-box">
          <div className="chat-header">Asistente Virtual 🌱</div>
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
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
