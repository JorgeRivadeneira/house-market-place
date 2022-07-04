// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCZ7NXxo2NmrZX34QjeuGw2UWZ9ZbpvKnI",
  authDomain: "house-market-place-c1739.firebaseapp.com",
  projectId: "house-market-place-c1739",
  storageBucket: "house-market-place-c1739.appspot.com",
  messagingSenderId: "1008808143990",
  appId: "1:1008808143990:web:958a390fdb8b86c6a08357",
  measurementId: "G-3QWP7926HW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();