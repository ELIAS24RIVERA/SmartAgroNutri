// src/pages/Estadistica.jsx
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const Estadistica = () => {
  const db = getDatabase(app);
  const [ultimo, setUltimo] = useState(null);

  useEffect(() => {
    const historialRef = ref(db, "historial");

    onValue(historialRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const lista = Object.entries(data).map(([id, valores]) => ({
          id,
          ...valores,
        }));

        const sorted = lista.sort((a, b) => {
          const aTime = Number(a.timestamp) || Number(a.id);
          const bTime = Number(b.timestamp) || Number(b.id);
          return aTime - bTime;
        });

        setUltimo(sorted[sorted.length - 1]);
      } else {
        setUltimo(null);
      }
    });
  }, [db]);

  if (!ultimo) {
    return (
      <p
        style={{
          padding: "20px",
          fontSize: "18px",
          textAlign: "center",
          opacity: 0.7,
        }}
      >
        Cargando datos...
      </p>
    );
  }

  const chartData = [
    { name: "Conductividad", valor: ultimo.conductivity ?? 0 },
    { name: "Temperatura", valor: ultimo.temperature ?? 0 },
    { name: "Luz (%)", valor: ultimo.porcentajeLuz ?? 0 },
  ];

  const colors = ["#3b82f6", "#f97316", "#10b981"];

  const estadoLuz =
    ultimo.lightDO === 0
      ? "💡 Mucha luz"
      : ultimo.lightDO === 1
      ? "🌑 Poca luz"
      : "Sin datos";

  return (
    <div
      style={{
        padding: "2rem",
        animation: "fadeIn 0.6s",
        maxWidth: "950px",
        margin: "0 auto",
      }}
    >
      {/* Título */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#1e293b",
          marginBottom: "25px",
        }}
      >
        📊 Estadísticas en Tiempo Real
      </h2>

      {/* Tarjeta del gráfico */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3
          style={{
            fontSize: "1.3rem",
            marginBottom: "15px",
            color: "#334155",
          }}
        >
          Valores Sensados
        </h3>

        <div
          style={{
            width: "100%",
            height: "330px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="name" tick={{ fill: "#475569" }} />
              <YAxis tick={{ fill: "#475569" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" radius={[12, 12, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tarjeta Estado de Luz */}
      <div
        style={{
          marginTop: "20px",
          padding: "18px",
          background: "linear-gradient(to right, #6366f1, #8b5cf6)",
          borderRadius: "16px",
          color: "white",
          textAlign: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        }}
      >
        <h3 style={{ fontSize: "1.4rem", marginBottom: "5px" }}>
          Estado de Luz
        </h3>
        <p style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{estadoLuz}</p>
      </div>
    </div>
  );
};

export default Estadistica;
