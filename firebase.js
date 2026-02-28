import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyA2AInXXuMjhhTgu6dQ438bfO7SIE0Twag",
    authDomain: "mbio-world.firebaseapp.com",
    projectId: "mbio-world",
    storageBucket: "mbio-world.firebasestorage.app",
    messagingSenderId: "423038302215",
    appId: "1:423038302215:web:6d241c7e89af55a2fdd2a2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
