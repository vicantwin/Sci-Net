import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmQTCr8NtKksCL4kK_y9Vid2BL6IoGTfY",
  authDomain: "spaceapps-nasa.firebaseapp.com",
  projectId: "spaceapps-nasa",
  storageBucket: "gs://spaceapps-nasa.appspot.com",
  messagingSenderId: "1000729244923",
  appId: "1:1000729244923:web:f93ceee71da316c5276c5e",
  measurementId: "G-1FELZR2J5E",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
