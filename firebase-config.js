// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCegO0yHTgJtTYBOblrJmpPJh4uURzkI_s",
    authDomain: "club-car-f1-predictions.firebaseapp.com",
    databaseURL: "https://club-car-f1-predictions-default-rtdb.firebaseio.com",
    projectId: "club-car-f1-predictions",
    storageBucket: "club-car-f1-predictions.firebasestorage.app",
    messagingSenderId: "686864874589",
    appId: "1:686864874589:web:331047ac6cf285b28861b4",
    measurementId: "G-QXCH8WCGDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);
