import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.login = function () {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
};
