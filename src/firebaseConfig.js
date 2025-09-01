// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

// Si ya existe una app inicializada, la usa; si no, inicializa una nueva
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getDatabase(app);

export { db };
