// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
import { apiKey } from "./api_key";

const firebaseConfig = {
  apiKey: apiKey,
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