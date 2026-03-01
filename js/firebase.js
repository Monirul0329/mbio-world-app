// Firebase SDK v8

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKXxxeu9fn612qsxDI9qC7akPg_pXsN5o",
  authDomain: "mbio-world-a0d5d.firebaseapp.com",
  projectId: "mbio-world-a0d5d",
  storageBucket: "mbio-world-a0d5d.firebasestorage.app",
  messagingSenderId: "69950902482",
  appId: "1:69950902482:web:ad9b01d35788da17d81d0b",
  measurementId: "G-PNCKRM9DEW"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
