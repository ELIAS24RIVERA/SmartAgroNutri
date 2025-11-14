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

        // Conversión correcta a array
        const lista = Object.entries(data).map(([id, valores]) => ({
          id,
          ...valores,
        }));

        // Orden por timestamp real si existe
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
    return <p style={{ padding: "20px" }}>Cargando datos...</p>;
  }

  // Datos EXACTOS como están en tu Firebase
  const chartData = [
    { name: "Conductividad", valor: ultimo.conductivity ?? 0 },
    { name: "Temperatura", valor: ultimo.temperature ?? 0 },
    { name: "Luz (%)", valor: ultimo.porcentajeLuz ?? 0 },
  ];

  const colors = ["#3b82f6", "#f97316", "#10b981"];

  // Interpretación correcta del sensor DO (digital)
  const estadoLuz =
    ultimo.lightDO === 0
      ? "💡 Mucha luz"
      : ultimo.lightDO === 1
      ? "🌑 Poca luz"
      : "Sin datos";

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📊 Estadísticas en tiempo real</h2>

      <div
        style={{
          width: "100%",
          height: "300px",
          minHeight: "300px",
          marginTop: "20px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="valor" radius={[10, 10, 0, 0]}>
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

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <h3>Estado de Luz:</h3>
        <p style={{ fontSize: "1.5rem" }}>{estadoLuz}</p>
      </div>
    </div>
  );
};

export default Estadistica;
