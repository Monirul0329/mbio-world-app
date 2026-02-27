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

// --- 📸 TEACHER: DIRECT GALLERY UPLOAD ---
function previewImg(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = e => {
            document.getElementById('preview').src = e.target.result;
            document.getElementById('preview').classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

async function teacherUpload() {
    const file = document.getElementById('file-input').files[0];
    const ans = document.getElementById('correct-ans').value.toUpperCase();
    const diff = document.getElementById('diff-level').value;

    if(!file || !ans) return alert("Image and Answer are required!");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        await db.collection("questions").add({
            img: reader.result, // Base64 direct upload (Free)
            answer: ans,
            difficulty: diff,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Question Published Live! ✅");
        location.reload();
    };
}

// --- ⏱️ STUDENT: SMART TIMER QUIZ (60-50-40) ---
let currentAttempt = 1;
let quizTimer;
let timeLeft = 60;

async function loadQuiz() {
    const snap = await db.collection("questions").orderBy("createdAt", "desc").limit(1).get();
    if(snap.empty) return alert("No questions available!");
    
    snap.forEach(doc => {
        document.getElementById('q-img').src = doc.data().img;
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('quiz-engine').classList.remove('hidden');
        startTimer();
    });
}

function startTimer() {
    if(currentAttempt == 2) timeLeft = 50;
    if(currentAttempt == 3) timeLeft = 40;
    
    document.getElementById('attempt-info').innerText = `Attempt ${currentAttempt}/3`;
    
    quizTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').innerText = timeLeft + "s";
        
        if(timeLeft <= 0) {
            clearInterval(quizTimer);
            if(currentAttempt < 3) {
                currentAttempt++;
                alert("Time up! Next attempt starts.");
                startTimer();
            } else {
                alert("Quiz Over! No more attempts.");
                location.reload();
            }
        }
    }, 1000);
}

function submitAns(opt) {
    clearInterval(quizTimer);
    alert("You selected: " + opt + ". Result calculation under maintenance.");
    location.reload();
}

// --- 🔐 AUTH LOGIC ---
function handleLogin() {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(e, p).then(res => {
        db.collection("users").doc(res.user.uid).get().then(doc => {
            document.getElementById('auth-section').classList.add('hidden');
            if(doc.data().role === "teacher") {
                document.getElementById('teacher-panel').classList.remove('hidden');
            } else {
                document.getElementById('student-panel').classList.remove('hidden');
                document.getElementById('user-name-display').innerText = doc.data().name;
            }
        });
    }).catch(err => alert(err.message));
}

function handleRegister() {
    const n = document.getElementById('reg-name').value;
    const e = document.getElementById('reg-email').value;
    const p = document.getElementById('reg-password').value;
    auth.createUserWithEmailAndPassword(e, p).then(res => {
        db.collection("users").doc(res.user.uid).set({ name: n, role: "student" })
        .then(() => location.reload());
    });
}

function toggleAuth(type) {
    document.getElementById('login-box').classList.toggle('hidden', type==='reg');
    document.getElementById('reg-box').classList.toggle('hidden', type==='login');
}
function logout() { auth.signOut().then(() => location.reload()); }
function forgotPW() {
    const e = document.getElementById('email').value;
    if(!e) return alert("Enter email first");
    auth.sendPasswordResetEmail(e).then(() => alert("Reset link sent!"));
    }
                  
