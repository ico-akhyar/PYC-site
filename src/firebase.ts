// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHpg6Olt1oYUP0ivOxKtA2_rHCvPqZPB0",
  authDomain: "pyc-official.firebaseapp.com",
  projectId: "pyc-official",
  storageBucket: "pyc-official.firebasestorage.app",
  messagingSenderId: "51535591568",
  appId: "1:51535591568:web:c85e0cc5cda07f2ed2c015",
  measurementId: "G-Z5WN7G13W6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
