import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { initializeApp, getApps } from "firebase/app";

// ✅ Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGoGj_ecO1OOZjXA5EJZVWJK-ygPsOSNI",
  authDomain: "apppruebi.firebaseapp.com",
  databaseURL: "https://apppruebi-default-rtdb.firebaseio.com",
  projectId: "apppruebi",
  storageBucket: "apppruebi.firebasestorage.app",
  messagingSenderId: "381833616823",
  appId: "1:381833616823:web:8236f28228abf0b1d45c32",
  measurementId: "G-J4NKTB2KHS",
};

// ✅ Evita inicializar Firebase más de una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  // ✅ Leer usuarios en tiempo real
  useEffect(() => {
    const usuariosRef = ref(db, "usuarios");
    const unsubscribe = onValue(usuariosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista = Object.entries(data).map(([id, value]) => ({
          id,
          nombre: value.nombre || "Sin nombre",
          email: value.email || "Sin email",
          rol: value.rol || "USER",
        }));
        setUsuarios(lista);
      } else {
        setUsuarios([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Cambiar rol del usuario en la base de datos
  const handleRolChange = (id, nuevoRol) => {
    const userRef = ref(db, `usuarios/${id}`);
    update(userRef, { rol: nuevoRol });
  };

  // ✅ Colores según el rol
  const getBadgeColor = (rol) => {
    if (rol === "ADMIN") return "#e74c3c";
    if (rol === "USER") return "#2ecc71";
    return "#7f8c8d";
  };

  // ✅ Estilos comunes
  const thStyle = {
    padding: "12px",
    borderBottom: "2px solid #333",
    color: "#00b894",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #333",
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 0 12px rgba(0,0,0,0.6)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Control de Usuarios</h2>

      {/* ✅ Tabla de usuarios */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#1c1c1c",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#222" }}>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Rol Actual</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: "1px solid #333",
                  textAlign: "center",
                  height: "60px",
                }}
              >
                <td style={tdStyle}>{user.nombre}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      backgroundColor: getBadgeColor(user.rol),
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    {user.rol}
                  </span>
                </td>
                <td style={tdStyle}>
                  <select
                    value={user.rol === "ADMIN" ? "Administrador" : "Invitado"}
                    onChange={(e) => {
                      const nuevoRol =
                        e.target.value === "Administrador" ? "ADMIN" : "USER";
                      handleRolChange(user.id, nuevoRol);
                    }}
                    style={{
                      backgroundColor: "#2c2c2c",
                      color: "#fff",
                      border: "1px solid #444",
                      borderRadius: "6px",
                      padding: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <option>Administrador</option>
                    <option>Invitado</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle} colSpan="4">
                No hay usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
