// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyDGoGj_ecO1OOZjXA5EJZVWJK-ygPsOSNI",
  authDomain: "apppruebi.firebaseapp.com",
  databaseURL: "https://apppruebi-default-rtdb.firebaseio.com/",
  projectId: "apppruebi",
  storageBucket: "apppruebi.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefg12345",
};

// Inicialización
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app); 

// Exporta todo lo que necesites
export { app, db, auth };
