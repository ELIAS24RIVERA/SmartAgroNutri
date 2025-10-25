// src/pages/Estadistica.jsx
import React, { useEffect, useState } from "react";
import { listenHistorial } from "../../firebaseApi";
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
  const [ultimo, setUltimo] = useState(null);

  useEffect(() => {
    listenHistorial((data) => {
      if (data && data.length > 0) {
        // Ordena por timestamp y toma el último registro
        const sorted = data.sort((a, b) => a.id - b.id);
        setUltimo(sorted[sorted.length - 1]);
      }
    });
  }, []);

  if (!ultimo) {
    return <p>Cargando datos...</p>;
  }

  // Datos del gráfico
  const chartData = [
    { name: "Conductividad", valor: ultimo.conductivity },
    { name: "Temperatura", valor: ultimo.temperature },
    { name: "Luz", valor: ultimo.porcentajeLuz },
  ];

  // Colores por barra
  const colors = ["#3b82f6", "#f97316", "#10b981"]; // azul, naranja, verde

  // Estado visual
  const estadoLuz = ultimo.lightDO === 0 ? "💡 Mucha luz" : "🌑 Poca luz / sombra";

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📊 Estadísticas en tiempo real</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="valor" radius={[10, 10, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <h3>Estado de Luz:</h3>
        <p style={{ fontSize: "1.5rem" }}>{estadoLuz}</p>
      </div>
    </div>
  );
};

export default Estadistica;
