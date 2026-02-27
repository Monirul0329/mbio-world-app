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

// 🚀 Core View Switcher (Fixes the overlapping screens)
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

// --- AUTH LOGIC ---
function toggleAuth(type) {
    if(type === 'reg') {
        document.getElementById('login-box').classList.add('hidden');
        document.getElementById('reg-box').classList.remove('hidden');
    } else {
        document.getElementById('reg-box').classList.add('hidden');
        document.getElementById('login-box').classList.remove('hidden');
    }
}

async function handleLogin() {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    try {
        const res = await auth.signInWithEmailAndPassword(e, p);
        const doc = await db.collection("users").doc(res.user.uid).get();
        if(doc.data().role === 'teacher') showView('screen-teacher');
        else {
            document.getElementById('user-name').innerText = doc.data().name;
            showView('screen-student');
        }
    } catch(err) { alert(err.message); }
}

async function handleRegister() {
    const n = document.getElementById('reg-name').value;
    const e = document.getElementById('reg-email').value;
    const p = document.getElementById('reg-password').value;
    try {
        const res = await auth.createUserWithEmailAndPassword(e, p);
        await db.collection("users").doc(res.user.uid).set({ name: n, role: 'student' });
        location.reload();
    } catch(err) { alert(err.message); }
}

// --- TEACHER UPLOAD ---
function previewFile(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = e => {
            document.getElementById('upload-preview').src = e.target.result;
            document.getElementById('upload-preview').classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

async function teacherUpload() {
    const img = document.getElementById('upload-preview').src;
    const ans = document.getElementById('ans-input').value;
    const ncert = document.getElementById('ncert-link').value;
    if(!img || !ans) return alert("Fill all details!");

    await db.collection("questions").add({ img, ans, ncert, time: new Date() });
    alert("Question Published!");
    location.reload();
}

// --- QUIZ LOGIC (Simplified for View Test) ---
function openModule(type) {
    if(type === 'quiz') {
        showView('screen-quiz');
        // Logic to load questions goes here
    }
}

function logout() { auth.signOut().then(() => location.reload()); }
          
