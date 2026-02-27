// 1. আপনার দেওয়া সঠিক Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2AInXXuMjhhTgu6dQ438bfO7SIE0Twag",
  authDomain: "mbio-world.firebaseapp.com",
  projectId: "mbio-world",
  storageBucket: "mbio-world.firebasestorage.app",
  messagingSenderId: "423038302215",
  appId: "1:423038302215:web:6d241c7e89af55a2fdd2a2",
  measurementId: "G-NRNGST3D3K"
};

// 2. Firebase Initialize
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 3. Login Function (স্টুডেন্ট এবং টিচার আলাদা করবে)
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorText = document.getElementById('auth-error');

    if (!email || !password) {
        errorText.innerText = "দয়া করে ইমেইল এবং পাসওয়ার্ড দিন।";
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Logged in as:", user.email);
            // ডাটাবেস থেকে ইউজারের রোল (Student/Teacher) চেক করা
            checkUserRole(user.uid);
        })
        .catch((error) => {
            errorText.innerText = "ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।";
        });
}

// 4. User Role Checker Function
function checkUserRole(uid) {
    db.collection("users").doc(uid).get().then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            if (userData.role === "teacher") {
                // টিচার প্যানেল দেখাও
                document.getElementById('auth-screen').style.display = 'none';
                document.getElementById('teacher-dashboard').style.display = 'block';
            } else {
                // স্টুডেন্ট ড্যাশবোর্ড দেখাও
                document.getElementById('auth-screen').style.display = 'none';
                document.getElementById('student-dashboard').style.display = 'block';
            }
        } else {
            alert("আপনার ইউজার প্রোফাইল ডাটাবেসে পাওয়া যায়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।");
        }
    }).catch((error) => {
        console.error("Error getting role:", error);
    });
}

// 5. Logout Function
function logout() {
    auth.signOut().then(() => {
        location.reload(); // পেজ রিলোড করে আবার লগইন স্ক্রিনে ফিরিয়ে নেওয়া
    });
              }

