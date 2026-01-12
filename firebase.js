import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARspLzJ37ApREuJ3mK1DfAt3OrF76Y6Sc",
  authDomain: "golden-bulls-80ccc.firebaseapp.com",
  projectId: "golden-bulls-80ccc",
  storageBucket: "golden-bulls-80ccc.firebasestorage.app",
  messagingSenderId: "1037591734244",
  appId: "1:1037591734244:web:7b3da6fabdb265001709f1",
  measurementId: "G-VY7XM07089"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();