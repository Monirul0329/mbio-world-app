import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async function () {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.data().role;

    document.getElementById("authSection").classList.add("hidden");

    if (role === "teacher") {
        document.getElementById("teacherDashboard").classList.remove("hidden");
    } else {
        document.getElementById("studentDashboard").classList.remove("hidden");
    }
}
