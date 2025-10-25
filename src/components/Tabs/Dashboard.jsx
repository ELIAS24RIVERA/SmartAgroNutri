import React, { useEffect, useState } from "react";
import { listenDatos } from "../../firebaseApi";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Escuchar cambios en tiempo real del nodo /datos
    listenDatos((newData) => setData(newData));
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🌡️ Dashboard IoTsssssssssss</h1>

      {data ? (
        <div
          style={{
            background: "#f3f4f6",
            padding: 20,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <p>
            <b>Conductividad:</b> {data.conductivity?.toFixed(2)} µS/cm
          </p>
          <p>
            <b>Temperatura:</b> {data.temperature?.toFixed(2)} °C
          </p>
          <p>
            <b>Sensor A0:</b> {data.lightA0}
          </p>
          <p>
            <b>DO:</b> {data.lightDO}
          </p>
          <p>
            <b>Luz:</b> {data.porcentajeLuz} %
          </p>
          <p>
            <b>Estado:</b> {data.estadoLuz}
          </p>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}
