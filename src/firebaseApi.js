// src/firebaseApi.js
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";

// ✅ Ya exportamos db si lo necesitas en otros lados
export { db };

/**
 * Escucha los datos actuales (nodo /datos)
 */
export const listenDatos = (callback) => {
  const datosRef = ref(db, "datos");
  onValue(datosRef, (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Escucha el historial completo (nodo /historial)
 */
export const listenHistorial = (callback) => {
  const historialRef = ref(db, "historial");
  onValue(historialRef, (snapshot) => {
    const data = snapshot.val();

    if (data) {
      // Convierte el objeto {timestamp: {...}} en un arreglo
      const formatted = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      callback(formatted);
    } else {
      callback([]);
    }
  });
};
