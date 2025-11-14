// src/firebaseApi.js
import { ref, onValue, off } from "firebase/database";
import { db } from "./firebase";

export { db };

/**
 * Escucha los datos actuales (nodo /datos)
 */
export const listenDatos = (callback) => {
  const datosRef = ref(db, "datos");

  // ⚠️ La corrección necesaria:
  const unsubscribe = onValue(datosRef, (snapshot) => {
    callback(snapshot.val());
  });

  return () => off(datosRef);   // ← ESTA ES LA ÚNICA COSA QUE FALTABA
};

/**
 * Escucha el historial completo (nodo /historial)
 */
export const listenHistorial = (callback) => {
  const historialRef = ref(db, "historial");
  onValue(historialRef, (snapshot) => {
    const data = snapshot.val();

    if (data) {
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
