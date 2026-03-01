let totalAttempts = localStorage.getItem("totalAttempts") || 0
let totalCorrect = localStorage.getItem("totalCorrect") || 0
let purchased = localStorage.getItem("purchased") === "true"
let questions = JSON.parse(localStorage.getItem("questions")) || [
{
q:"Cell is unit of?",
options:["Life","Energy","Plant","Atom"],
answer:0
}
]

let current = 0
let score = 0
let timer
let timeLeft
let attempt = 1

function home(){
document.getElementById("content").innerHTML = `
<div class="card">
<h3>Biology Course</h3>
${purchased ? "Purchased ✅" : "<button onclick='buy()'>Buy Course</button>"}
</div>
`
}

function buy(){
purchased = true
localStorage.setItem("purchased","true")
home()
}

function practice(){
if(!purchased){
document.getElementById("content").innerHTML =
`<div class="card">Buy course first</div>`
return
}

document.getElementById("content").innerHTML =
`
<div class="card">
<h3>Topic Wise</h3>
<button onclick="startQuiz()">Cell Structure Quiz</button>
</div>

<div class="card">
<h3>Chapter Wise</h3>
<button onclick="startQuiz()">Chapter 1 Full Test</button>
</div>
`
}

document.getElementById("content").innerHTML =
`<div class="card">
<button onclick="startQuiz()">Start Quiz</button>
</div>`
}

function profile(){

let accuracyOverall = totalAttempts == 0 
? 0 
: ((totalCorrect/(totalAttempts*questions.length))*100)

document.getElementById("content").innerHTML =
`<div class="card">
<h3>Profile</h3>
<p>Total Attempts: ${totalAttempts}</p>
<p>Overall Accuracy: ${accuracyOverall.toFixed(2)}%</p>
</div>`
}
home()
let skipped = 0
let wrong = 0
let answers = []

function startQuiz(){
current = 0
score = 0
wrong = 0
skipped = 0
answers = []
attempt = 1
showQuestion()
}

function showQuestion(){
clearInterval(timer)

let q = questions[current]
timeLeft = attempt===1?60:attempt===2?50:40

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
<div class="option">
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

function submitQuiz(){
clearInterval(timer)

score = 0
wrong = 0

for(let i=0;i<questions.length;i++){
if(answers[i] === questions[i].answer){
score++
}else if(answers[i] !== -1){
wrong++
  totalAttempts++
totalCorrect = parseInt(totalCorrect) + score

localStorage.setItem("totalAttempts", totalAttempts)
localStorage.setItem("totalCorrect", totalCorrect)
}
}

let accuracy = (score/questions.length)*100

document.getElementById("content").innerHTML = `
<div class="card">
<h3>Quiz Result</h3>
<p>Total: ${questions.length}</p>
<p>Correct: ${score}</p>
<p>Wrong: ${wrong}</p>
<p>Skipped: ${skipped}</p>
<p>Accuracy: ${accuracy.toFixed(2)}%</p>
let leaderboard = [
{ name:"Topper", score:questions.length },
{ name:"You", score:score }
]

leaderboard.sort((a,b)=>b.score-a.score)

document.getElementById("content").innerHTML += `
<div class="card">
<h3>Leaderboard</h3>
${leaderboard.map(l=>`<p>${l.name} - ${l.score}</p>`).join("")}
</div>
`
<button onclick="startQuiz()">Reattempt</button>
<button onclick="home()">Back Home</button>
</div>
`
}
