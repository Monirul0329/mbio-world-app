const firebaseConfig = {
  apiKey: "AIzaSyA2AInXXuMjhhTgu6dQ438bfO7SIE0Twag",
  authDomain: "mbio-world.firebaseapp.com",
  projectId: "mbio-world",
  storageBucket: "mbio-world.firebasestorage.app",
  messagingSenderId: "423038302215",
  appId: "1:423038302215:web:6d241c7e89af55a2fdd2a2"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function toggleAuth(type) {
    document.getElementById('login-box').classList.toggle('hidden', type === 'reg');
    document.getElementById('reg-box').classList.toggle('hidden', type === 'login');
}

function handleLogin() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, pass).then(res => {
        db.collection("users").doc(res.user.uid).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('auth-section').classList.add('hidden');
                
                if (userData.role === "teacher") {
                    document.getElementById('teacher-panel').classList.remove('hidden');
                } else {
                    document.getElementById('student-panel').classList.remove('hidden');
                    document.getElementById('display-name').innerText = "Hi, " + userData.name;
                }
            }
        });
    }).catch(err => alert(err.message));
}

function handleRegister() {
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;

    auth.createUserWithEmailAndPassword(email, pass).then(res => {
        db.collection("users").doc(res.user.uid).set({
            name: name,
            role: "student",
            email: email
        }).then(() => location.reload());
    }).catch(err => alert(err.message));
}

function logout() { auth.signOut().then(() => location.reload()); }

// Smart Timer Logic
let timeLeft = 60;
function startQuiz() {
    document.getElementById('quiz-area').classList.remove('hidden');
    let timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft + "s";
        if(timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's Up!");
        }
    }, 1000);
}
