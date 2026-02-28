import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadQuizzes() {

    const snapshot = await getDocs(collection(db, "quizzes"));
    let html = "";

    snapshot.forEach(doc => {
        html += `<div>${doc.data().title}</div>`;
    });

    document.getElementById("quizList").innerHTML = html;
}

loadQuizzes();
