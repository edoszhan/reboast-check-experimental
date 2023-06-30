// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWVoPYPaslSEqKti8whKwRDcUk_P49nao",
  authDomain: "rough-app-70eeb.firebaseapp.com",
  projectId: "rough-app-70eeb",
  storageBucket: "rough-app-70eeb.appspot.com",
  messagingSenderId: "612904933044",
  appId: "1:612904933044:web:282e26c55429100c1e29e1"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);