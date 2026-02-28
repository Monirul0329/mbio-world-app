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
`<div class="card">
<button onclick="startQuiz()">Start Quiz</button>
</div>`
}

function profile(){
document.getElementById("content").innerHTML =
`<div class="card">
Last Score: ${score}
</div>`
}

function startQuiz(){
current = 0
score = 0
attempt = 1
showQuestion()
}

function showQuestion(){
clearInterval(timer)
let q = questions[current]

timeLeft = attempt===1?60:attempt===2?50:40

document.getElementById("content").innerHTML =
`<div class="card">
<h4>Question ${current+1}/${questions.length}</h4>
<p>${q.q}</p>
<div id="opts"></div>
<p>Time: <span id="time">${timeLeft}</span></p>
<button onclick="submitAns()">Submit</button>
</div>`

let optDiv = document.getElementById("opts")
q.options.forEach((o,i)=>{
optDiv.innerHTML +=
`<div class="option">
<input type="radio" name="opt" value="${i}"> ${o}
</div>`
})

startTimer()
}

function startTimer(){
timer = setInterval(()=>{
timeLeft--
document.getElementById("time").innerText=timeLeft
if(timeLeft<=0){
clearInterval(timer)
submitAns(true)
}
},1000)
}

function submitAns(timeout=false){
clearInterval(timer)
let selected=document.querySelector("input[name='opt']:checked")
let ans=timeout?-1: selected?parseInt(selected.value):-1

if(ans===questions[current].answer) score++

current++

if(current<questions.length){
showQuestion()
}else{
showResult()
}
}

function showResult(){
let percent=(score/questions.length)*100
document.getElementById("content").innerHTML=
`<div class="card">
<h3>Result</h3>
<p>Total: ${questions.length}</p>
<p>Correct: ${score}</p>
<p>Wrong: ${questions.length-score}</p>
<p>Accuracy: ${percent.toFixed(2)}%</p>
<button onclick="home()">Back</button>
</div>`
}

function addQuestion(){
let newQ={
q:document.getElementById("q").value,
options:[
document.getElementById("o1").value,
document.getElementById("o2").value,
document.getElementById("o3").value,
document.getElementById("o4").value
],
answer:parseInt(document.getElementById("ans").value)
}

questions.push(newQ)
localStorage.setItem("questions",JSON.stringify(questions))
alert("Added")
}

home()
