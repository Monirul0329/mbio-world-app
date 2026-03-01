// ===== AUTH SYSTEM =====

function login(){
let email = document.getElementById("email").value
let role = document.getElementById("role").value

if(!email) return alert("Enter Email")

localStorage.setItem("user", JSON.stringify({email, role}))

if(role==="teacher"){
window.location="admin.html"
}else{
window.location="app.html"
}
}

function logout(){
localStorage.removeItem("user")
window.location="index.html"
}

let user = JSON.parse(localStorage.getItem("user"))

if(!user && !window.location.pathname.includes("index.html")){
window.location="index.html"
}

// ===== DATABASE =====

let usersData = JSON.parse(localStorage.getItem("usersData")) || {}
let questions = JSON.parse(localStorage.getItem("questions")) || [
{
q:"Cell is unit of?",
options:["Life","Energy","Plant","Atom"],
answer:0
}
]

// create student data if not exists
if(user && user.role==="student" && !usersData[user.email]){
usersData[user.email]={
purchased:false,
attempts:0,
correct:0
}
saveUsers()
}

function saveUsers(){
localStorage.setItem("usersData", JSON.stringify(usersData))
}

function saveQuestions(){
localStorage.setItem("questions", JSON.stringify(questions))
}

// ===== TEACHER =====

function addQuestion(){
let q=document.getElementById("q").value
let o1=document.getElementById("o1").value
let o2=document.getElementById("o2").value
let o3=document.getElementById("o3").value
let o4=document.getElementById("o4").value
let ans=parseInt(document.getElementById("ans").value)

if(!q) return alert("Enter Question")

questions.push({
q:q,
options:[o1,o2,o3,o4],
answer:ans
})

saveQuestions()
alert("Question Added")
}

// ===== STUDENT HOME =====

function home(){
if(!usersData[user.email].purchased){
document.getElementById("content").innerHTML=`
<div class="card">
<h3>Buy Course First</h3>
<button onclick="buy()">Buy Now</button>
</div>`
return
}

document.getElementById("content").innerHTML=`
<div class="card">
<h3>Welcome ${user.email}</h3>
<p>Total Questions: ${questions.length}</p>
<button onclick="practice()">Start Quiz</button>
</div>`
}

// ===== BUY =====

function buy(){
usersData[user.email].purchased=true
saveUsers()
home()
}

// ===== QUIZ =====

let current=0
let score=0

function practice(){
current=0
score=0
showQuestion()
}

function showQuestion(){
let q=questions[current]

document.getElementById("content").innerHTML=`
<div class="card">
<h4>Question ${current+1}/${questions.length}</h4>
<p>${q.q}</p>
${q.options.map((opt,i)=>
`<div><input type="radio" name="opt" value="${i}"> ${opt}</div>`
).join("")}
<button onclick="nextQuestion()">Next</button>
</div>`
}

function nextQuestion(){
let selected=document.querySelector("input[name='opt']:checked")
if(selected && parseInt(selected.value)===questions[current].answer){
score++
}

current++

if(current<questions.length){
showQuestion()
}else{
finishQuiz()
}
}

function finishQuiz(){

usersData[user.email].attempts++
usersData[user.email].correct+=score
saveUsers()

let accuracy=(score/questions.length)*100

// leaderboard
let board=Object.keys(usersData).map(email=>({
email,
score:usersData[email].correct
})).sort((a,b)=>b.score-a.score)

document.getElementById("content").innerHTML=`
<div class="card">
<h3>Result</h3>
<p>Score: ${score}/${questions.length}</p>
<p>Accuracy: ${accuracy.toFixed(2)}%</p>
<button onclick="home()">Back Home</button>
</div>

<div class="card">
<h3>Leaderboard</h3>
${board.map((b,i)=>`<p>${i+1}. ${b.email} - ${b.score}</p>`).join("")}
</div>`
}

// ===== PROFILE =====

function profile(){
let data=usersData[user.email]
let acc=data.attempts===0?0:(data.correct/(data.attempts*questions.length))*100

document.getElementById("content").innerHTML=`
<div class="card">
<h3>Profile</h3>
<p>Email: ${user.email}</p>
<p>Attempts: ${data.attempts}</p>
<p>Total Correct: ${data.correct}</p>
<p>Accuracy: ${acc.toFixed(2)}%</p>
</div>`
}

// auto load home
if(window.location.pathname.includes("app.html")){
home()
}
