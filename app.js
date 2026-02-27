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

// 🕒 Smart Attempt Timer Logic
let attempt = 1;
let timeLeft = 60;
let timerId;

function startQuiz() {
    document.getElementById('quiz-area').classList.remove('hidden');
    // Load first question logic here
    runTimer();
}

function runTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft + "s";
        if(timeLeft <= 0) {
            clearInterval(timerId);
            if(attempt < 3) {
                attempt++;
                timeLeft = attempt === 2 ? 50 : 40;
                alert(`Time Up! Switching to Attempt ${attempt}`);
                document.getElementById('attempt-info').innerText = `Attempt: ${attempt}/3 (${timeLeft}s)`;
                runTimer();
            } else {
                alert("Game Over! Max attempts reached.");
                location.reload();
            }
        }
    }, 1000);
}

// 📤 ImgBB Direct Upload Logic
async function uploadToImgBB() {
    const file = document.getElementById('upload-file').files[0];
    const apiKey = "YOUR_IMGBB_API_KEY"; // এখানে আপনার API Key বসান
    if(!file) return alert("Select File");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData
    });
    const data = await res.json();
    const url = data.data.url;

    // Save to Firestore
    await db.collection("questions").add({
        img: url,
        ans: document.getElementById('correct-opt').value,
        time: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Question Published Live! ✅");
}

// 🔐 Auth Handlers
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
                document.getElementById('student-name').innerText = "Hello, " + doc.data().name;
            }
        });
    }).catch(err => alert(err.message));
}

function handleRegister() {
    const e = document.getElementById('reg-email').value;
    const p = document.getElementById('reg-password').value;
    const n = document.getElementById('reg-name').value;
    auth.createUserWithEmailAndPassword(e, p).then(res => {
        db.collection("users").doc(res.user.uid).set({
            name: n, role: "student", joined: new Date()
        }).then(() => location.reload());
    });
}

function toggleAuth(x) {
    document.getElementById('login-box').classList.toggle('hidden', x==='reg');
    document.getElementById('reg-box').classList.toggle('hidden', x==='login');
}

function logout() { auth.signOut().then(() => location.reload()); }
              
