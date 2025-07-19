// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-7699d.firebaseapp.com",
  projectId: "mern-estate-7699d",
  storageBucket: "mern-estate-7699d.firebasestorage.app",
  messagingSenderId: "750229100598",
  appId: "1:750229100598:web:8235fcc78058b62817a097",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
