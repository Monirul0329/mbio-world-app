// Firebase config paste korbi ekhane
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2AInXXuMjhhTgu6dQ438bfO7SIE0Twag",
  authDomain: "mbio-world.firebaseapp.com",
  projectId: "mbio-world",
  storageBucket: "mbio-world.firebasestorage.app",
  messagingSenderId: "423038302215",
  appId: "1:423038302215:web:6d241c7e89af55a2fdd2a2",
  measurementId: "G-NRNGST3D3K"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
