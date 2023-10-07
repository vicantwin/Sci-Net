import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmQTCr8NtKksCL4kK_y9Vid2BL6IoGTfY",
  authDomain: "spaceapps-nasa.firebaseapp.com",
  projectId: "spaceapps-nasa",
  storageBucket: "spaceapps-nasa.appspot.com",
  messagingSenderId: "1000729244923",
  appId: "1:1000729244923:web:f93ceee71da316c5276c5e",
  measurementId: "G-1FELZR2J5E",
};

// Initialize Firebase

export const firebase_app = initializeApp(firebaseConfig);
export const auth = getAuth(firebase_app);
export const db = getFirestore(firebase_app);
