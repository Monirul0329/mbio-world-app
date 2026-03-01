// ================= USER SYSTEM =================

let currentUser = JSON.parse(localStorage.getItem("currentUser"))
let usersData = JSON.parse(localStorage.getItem("usersData")) || {}

if(currentUser && !usersData[currentUser.email]){
usersData[currentUser.email] = {
purchased:false,
attempts:0,
correct:0
}
localStorage.setItem("usersData", JSON.stringify(usersData))
}

function logout(){
localStorage.removeItem("currentUser")
window.location.href = "index.html"
}

// ================= COURSE SYSTEM =================

function isPurchased(){
return usersData[currentUser.email].purchased
}

function buy(){
usersData[currentUser.email].purchased = true
localStorage.setItem("usersData", JSON.stringify(usersData))
home()
}

// ================= QUESTIONS =================

let questions = [
{
q:"Cell is unit of?",
options:["Life","Energy","Plant","Atom"],
answer:0
}
]

let current = 0
let score = 0
let wrong = 0
let skipped = 0
let answers = []
let timer
let timeLeft

// ================= HOME =================

function home(){

if(!isPurchased()){
document.getElementById("content").innerHTML = `
<div class="card">
<h3>Biology Course</h3>
<button onclick="buy()">Buy Course</button>
</div>`
return
}

document.getElementById("content").innerHTML = `
<div class="card">
<h3>Course Dashboard</h3>
<button onclick="practice()">Practice</button>
<button onclick="profile()">Profile</button>
</div>`
}

// ================= PRACTICE =================

function practice(){
document.getElementById("content").innerHTML = `
<div class="card">
<h3>Topic Wise</h3>
<button onclick="startQuiz()">Start Quiz</button>
</div>`
}

// ================= QUIZ =================

function startQuiz(){
current = 0
score = 0
wrong = 0
skipped = 0
answers = []
showQuestion()
}

function showQuestion(){

clearInterval(timer)

let q = questions[current]
timeLeft = 30

document.getElementById("content").innerHTML = `
<div class="card">
<h4>Question ${current+1}/${questions.length}</h4>
<p>${q.q}</p>
<div id="opts"></div>
<p>Time: <span id="time">${timeLeft}</span>s</p>
<button onclick="prevQuestion()">Previous</button>
<button onclick="nextQuestion()">Next</button>
<button onclick="submitQuiz()">Submit Quiz</button>
</div>
`

let optDiv = document.getElementById("opts")

q.options.forEach((o,i)=>{
optDiv.innerHTML += `
<div>
<input type="radio" name="opt" value="${i}"> ${o}
</div>`
})

startTimer()
}

function startTimer(){
timer = setInterval(()=>{
timeLeft--
document.getElementById("time").innerText = timeLeft

if(timeLeft<=0){
clearInterval(timer)
skipped++
answers[current] = -1
nextQuestion()
}
},1000)
}

function nextQuestion(){

clearInterval(timer)

let selected = document.querySelector("input[name='opt']:checked")

if(selected){
answers[current] = parseInt(selected.value)
}else{
answers[current] = -1
}

current++

if(current < questions.length){
showQuestion()
}else{
submitQuiz()
}
}

function prevQuestion(){
if(current>0){
current--
showQuestion()
}
}

// ================= RESULT =================

function submitQuiz(){

clearInterval(timer)

score = 0
wrong = 0

for(let i=0;i<questions.length;i++){
if(answers[i] === questions[i].answer){
score++
}else if(answers[i] !== -1){
wrong++
}
}

// SAVE USER PROGRESS
usersData[currentUser.email].attempts++
usersData[currentUser.email].correct += score
localStorage.setItem("usersData", JSON.stringify(usersData))

let accuracy = (score/questions.length)*100

// LEADERBOARD
let board = []

for(let email in usersData){
board.push({
email:email,
score:usersData[email].correct
})
}

board.sort((a,b)=>b.score-a.score)

document.getElementById("content").innerHTML = `
<div class="card">
<h3>Quiz Result</h3>
<p>Total: ${questions.length}</p>
<p>Correct: ${score}</p>
<p>Wrong: ${wrong}</p>
<p>Skipped: ${skipped}</p>
<p>Accuracy: ${accuracy.toFixed(2)}%</p>
<button onclick="startQuiz()">Reattempt</button>
<button onclick="home()">Back Home</button>
</div>

<div class="card">
<h3>Leaderboard</h3>
${board.map((b,i)=>`<p>${i+1}. ${b.email} - ${b.score}</p>`).join("")}
</div>
`
}

// ================= PROFILE =================

function profile(){

let user = usersData[currentUser.email]

let accuracy = user.attempts === 0 
? 0 
: (user.correct/(user.attempts*questions.length))*100

document.getElementById("content").innerHTML = `
<div class="card">
<h3>Profile</h3>
<p>Email: ${currentUser.email}</p>
<p>Total Attempts: ${user.attempts}</p>
<p>Total Correct: ${user.correct}</p>
<p>Accuracy: ${accuracy.toFixed(2)}%</p>
<button onclick="home()">Back</button>
</div>
`
}
function addQuestion(){

let q = document.getElementById("q").value
let o1 = document.getElementById("o1").value
let o2 = document.getElementById("o2").value
let o3 = document.getElementById("o3").value
let o4 = document.getElementById("o4").value
let ans = parseInt(document.getElementById("ans").value)

if(!q) return alert("Enter question")

questions.push({
q:q,
options:[o1,o2,o3,o4],
answer:ans
})

alert("Question Added")
}

home()
