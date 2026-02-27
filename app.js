          // Firebase Config
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

// Triple Attempt Timer Variables
let attempt = 1;
let timer;
let seconds = 60;

function startSmartTimer() {
    clearInterval(timer);
    if(attempt == 1) seconds = 60;
    if(attempt == 2) seconds = 50;
    if(attempt == 3) seconds = 40;

    document.getElementById('attempt-tag').innerText = "Attempt " + attempt;
    
    timer = setInterval(() => {
        seconds--;
        document.getElementById('timer-box').innerText = seconds + "s";

        if(seconds <= 0) {
            clearInterval(timer);
            if(attempt < 3) {
                attempt++;
                document.getElementById('submit-ans-btn').disabled = true; // Lock Submit
                alert("Time's Up! Attempt " + attempt + " starts now. You can only view.");
                startSmartTimer();
            } else {
                alert("Quiz Over for this question.");
                location.reload();
            }
        }
    }, 1000);
}

// Teacher Gallery Upload
function previewImg(input) {
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('img-preview').src = e.target.result;
        document.getElementById('img-preview').classList.remove('hidden');
    }
    reader.readAsDataURL(input.files[0]);
}

async function uploadQuestion() {
    const imgData = document.getElementById('img-preview').src;
    const ans = document.getElementById('correct-ans').value;
    
    await db.collection("quizzes").add({
        image: imgData,
        answer: ans,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Uploaded to Student App! ✅");
}

// Navigation Logic
function toggleView(id) {
    document.getElementById('reg-box').classList.add('hidden');
    document.getElementById('auth-inputs').classList.add('hidden');
    document.getElementById(id).classList.remove('hidden');
}

function handleLogin() {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(e, p).then(res => {
        db.collection("users").doc(res.user.uid).get().then(doc => {
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            if(doc.data().role === 'teacher') document.getElementById('teacher-panel').classList.add('active');
            else document.getElementById('student-panel').classList.add('active');
        });
    });
}
              
