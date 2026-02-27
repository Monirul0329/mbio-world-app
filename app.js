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
    document.getElementById('login-form').classList.toggle('hidden', type === 'register');
    document.getElementById('register-form').classList.toggle('hidden', type === 'login');
}

// Student Registration
function handleRegister() {
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;

    auth.createUserWithEmailAndPassword(email, pass).then(res => {
        db.collection("users").doc(res.user.uid).set({
            name: name,
            email: email,
            role: "student", // ডিফল্টভাবে সবাই স্টুডেন্ট
            status: "active"
        }).then(() => {
            alert("Registration Successful!");
            location.reload();
        });
    }).catch(err => alert(err.message));
}

// Login with Role Check
function handleLogin() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, pass).then(res => {
        db.collection("users").doc(res.user.uid).get().then(doc => {
            document.getElementById('auth-section').classList.add('hidden');
            if (doc.data().role === "teacher") {
                document.getElementById('teacher-dashboard').classList.remove('hidden');
            } else {
                document.getElementById('student-dashboard').classList.remove('hidden');
            }
        });
    }).catch(err => alert("Login Failed: " + err.message));
}

function forgotPassword() {
    const email = document.getElementById('email').value;
    if(!email) return alert("Please enter your email first");
    auth.sendPasswordResetEmail(email).then(() => alert("Password reset link sent to email!"));
}

function logout() { auth.signOut().then(() => location.reload()); }
