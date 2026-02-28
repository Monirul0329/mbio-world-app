import { db } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.createQuiz = async function () {

    const title = document.getElementById("quizTitle").value;

    await addDoc(collection(db, "quizzes"), {
        title: title,
        createdAt: new Date()
    });

    alert("Quiz Created!");
}
