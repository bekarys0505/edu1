// Firebase конфигурация
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvWDhmgbbGStO5zG6pEsdiWWvAC3HKvvM",
  authDomain: "prob1-c8abe.firebaseapp.com",
  projectId: "prob1-c8abe",
  storageBucket: "prob1-c8abe.firebasestorage.app",
  messagingSenderId: "346549546310",
  appId: "1:346549546310:web:14599cebcc1e343c918947"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
