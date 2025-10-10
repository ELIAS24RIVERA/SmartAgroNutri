import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // Importamos la autenticación

// 🔹 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDo-YMXIBublt25kf_7UD99opWgZzfopZI",
  authDomain: "elias-82a93.firebaseapp.com",
  databaseURL: "https://elias-82a93-default-rtdb.firebaseio.com",
  projectId: "elias-82a93",
  storageBucket: "elias-82a93.firebasestorage.app",
  messagingSenderId: "339817378222",
  appId: "1:339817378222:web:927d026e3df14f9351983f",
  measurementId: "G-Q8M91HHTNQ",
};

// Inicializamos Firebase solo una vez
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Obtenemos la referencia a la base de datos de Firebase
const auth = getAuth(app);  // Obtenemos la instancia de autenticación

// Exportamos `db` y `auth` para usarlos en otros archivos
export { db, auth }; 
