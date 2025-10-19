import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

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

// ✅ Inicializa Firebase solo si no existe una app previa
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔹 Inicializa los servicios de Firebase
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
