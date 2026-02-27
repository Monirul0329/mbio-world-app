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

// --- THE SMART QUIZ LOGIC ---
let quizData = { currentAttempt: 1, timeLeft: 60, timer: null };

const app = {
    showScreen: (id) => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },
    login: () => {
        const e = document.getElementById('login-email').value;
        const p = document.getElementById('login-pass').value;
        auth.signInWithEmailAndPassword(e, p).then(res => {
            db.collection("users").doc(res.user.uid).get().then(doc => {
                const role = doc.data().role;
                if(role === 'teacher') app.showScreen('screen-teacher');
                else app.showScreen('screen-dashboard');
                document.getElementById('user-display-name').innerText = doc.data().name;
            });
        });
    },
    logout: () => auth.signOut().then(() => location.reload())
};

const quiz = {
    startTimer: () => {
        clearInterval(quizData.timer);
        if(quizData.currentAttempt === 2) quizData.timeLeft = 50;
        if(quizData.currentAttempt === 3) quizData.timeLeft = 40;

        quizData.timer = setInterval(() => {
            quizData.timeLeft--;
            document.getElementById('quiz-timer').innerText = quizData.timeLeft + "s";
            if(quizData.timeLeft <= 0) {
                clearInterval(quizData.timer);
                if(quizData.currentAttempt < 3) {
                    quizData.currentAttempt++;
                    document.getElementById('submit-ans-btn').disabled = true;
                    alert("Time Up! Moving to Attempt " + quizData.currentAttempt);
                    quiz.startTimer();
                } else { alert("Quiz Finished!"); location.reload(); }
            }
        }, 1000);
    },
    submitAnswer: () => {
        // Here we handle the suggest 2: Error Vault
        // If wrong, add to 'users/uid/errorVault/questionID'
        alert("Answer Submitted!");
    }
};

const teacher = {
    preview: (input) => {
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('preview-box').src = e.target.result;
            document.getElementById('preview-box').classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    },
    publish: async () => {
        const img = document.getElementById('preview-box').src;
        const ans = document.getElementById('q-ans').value;
        const ncert = document.getElementById('ncert-link').value; // Suggest 1: NCERT Link
        
        await db.collection("quizzes").add({
            img, ans, ncert, diff: document.getElementById('q-diff').value,
            time: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Published!");
    }
};
                                    
