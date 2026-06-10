import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCNTo3xDpVgUKH-NIcp5PO1aWuAuX2Rl6U",
    authDomain: "portfolio-admin-8bfbf.firebaseapp.com",
    projectId: "portfolio-admin-8bfbf",
    storageBucket: "portfolio-admin-8bfbf.firebasestorage.app",
    messagingSenderId: "354523202496",
    appId: "1:354523202496:web:e1bcb9e3d3c48c15883e25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
