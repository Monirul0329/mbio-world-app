function register(){
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const role = document.getElementById("role").value;

if(!email || !password){
alert("Fill all fields");
return;
}

auth.createUserWithEmailAndPassword(email,password)
.then(userCredential=>{
const user = userCredential.user;

db.collection("users").doc(user.uid).set({
email: email,
role: role
});

alert("Registered Successfully");
})
.catch(error=>{
alert(error.message);
});
}

function login(){
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

auth.signInWithEmailAndPassword(email,password)
.then(userCredential=>{
const user = userCredential.user;

db.collection("users").doc(user.uid).get()
.then(doc=>{
const data = doc.data();

if(data.role === "teacher"){
window.location.href = "teacher.html";
}else{
window.location.href = "student.html";
}
});
})
.catch(error=>{
alert(error.message);
});
}
