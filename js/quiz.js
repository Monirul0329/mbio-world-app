let questions = [];
let currentIndex = 0;
let userAnswers = [];

let questionTimer;
let totalTimer;

let questionTimeLeft = 60;
let totalTimeLeft = 0;

let userId;
let perQuestionTime = 60;

let selectedOption = null;
let questionSubmitted = false;

const POSITIVE_MARK = 4;
const NEGATIVE_MARK = -1;

auth.onAuthStateChanged(user=>{
if(!user){
window.location.href="index.html";
return;
}

userId = user.uid;
loadQuiz();
});

function loadQuiz(){

let courseId = localStorage.getItem("activeCourse");
let topicId = localStorage.getItem("activeTopic");

questions = [];

db.collection("courses")
.doc(courseId)
.collection("chapters")
.get()
.then(chapterSnap=>{

let promises = [];

chapterSnap.forEach(chapDoc=>{

let p = db.collection("courses")
.doc(courseId)
.collection("chapters")
.doc(chapDoc.id)
.collection("topics")
.doc(topicId)
.collection("quiz")
.get()
.then(snapshot=>{
snapshot.forEach(doc=>{
questions.push(doc.data());
});
});

promises.push(p);

});

Promise.all(promises).then(()=>{
setupAttemptAndTimers();
});

});

}

function setupAttemptAndTimers(){

let topicId = localStorage.getItem("activeTopic");

db.collection("attempts")
.doc(userId)
.collection("topics")
.doc(topicId)
.get()
.then(doc=>{

let attemptCount = 1;

if(doc.exists){
attemptCount = doc.data().attemptCount + 1;
}

if(attemptCount == 1){
perQuestionTime = 60;
}
else if(attemptCount == 2){
perQuestionTime = 50;
}
else if(attemptCount == 3){
perQuestionTime = 40;
}
else{
perQuestionTime = 30;
}

questionTimeLeft = perQuestionTime;
totalTimeLeft = questions.length * perQuestionTime;

showQuestion();
startTotalTimer();

});

}

function showQuestion(){

questionSubmitted = false;
clearInterval(questionTimer);

let q = questions[currentIndex];

if(!q){
document.getElementById("quizContainer").innerHTML="No Questions";
return;
}

let correctIndex = parseInt(q.correctIndex);
let selectedIndex = userAnswers[currentIndex];

let html = `
<div class="card">
<h3>Q${currentIndex+1}. ${q.questionText}</h3>

${q.options.map((opt,i)=>{

let bg = "#f1f1f1";
let color = "black";

if(selectedIndex !== undefined){
if(i === correctIndex){
bg = "#C8E6C9";   // soft green
color = "#1B5E20";
}
if(i === selectedIndex && i !== correctIndex){
bg = "#FFCDD2";   // soft red
color = "#B71C1C";
}
}

return `
<div class="option" 
style="background:${bg};color:${color}"
onclick="selectAnswer(${i}, this)">
${opt}
</div>
`;

}).join("")}

<button onclick="submitAnswer()">Submit Answer</button>
<div id="solutionBox" style="display:none;margin-top:10px;"></div>
</div>
`;

document.getElementById("quizContainer").innerHTML = html;

startQuestionTimer();
}

function submitAnswer(){

if(userAnswers[currentIndex] !== undefined){
return; // already answered
}

if(selectedOption == null){
alert("Select an answer first");
return;
}

clearInterval(questionTimer);

let q = questions[currentIndex];
let correctIndex = parseInt(q.correctIndex);
let selectedIndex = parseInt(userAnswers[currentIndex]);

document.querySelectorAll(".option").forEach((opt,i)=>{

if(i === correctIndex){
opt.style.background="#C8E6C9";
opt.style.color="#1B5E20";
}

if(i === selectedIndex && i !== correctIndex){
opt.style.background="#FFCDD2";
opt.style.color="#B71C1C";
}

opt.style.pointerEvents="none";
});

if(selectedIndex !== correctIndex){
let box = document.getElementById("solutionBox");
box.style.display="block";
box.innerHTML = "<b>Solution:</b> " + (q.solution || "Check Notes");
}
}

function nextQuestion(){
if(currentIndex < questions.lengthfunction submitAnswer(){

if(questionSubmitted) return;

if(selectedOption == null){
alert("Select an answer first");
return;
}

questionSubmitted = true;
clearInterval(questionTimer);

let q = questions[currentIndex];

// 🔥 force both to number
let correctIndex = parseInt(q.correctIndex);
let selectedIndex = parseInt(userAnswers[currentIndex]);

document.querySelectorAll(".option").forEach((opt,i)=>{

if(i === correctIndex){
opt.style.background="#A5D6A7";   // soft green
opt.style.color="#1B5E20";
}

if(i === selectedIndex && i !== correctIndex){
opt.style.background="#FFCDD2";   // soft red
opt.style.color="#B71C1C";
}

opt.style.pointerEvents="none";
});

if(selectedIndex !== correctIndex){
let box = document.getElementById("solutionBox");
box.style.display="block";
box.innerHTML = "<b>Solution:</b> " + (q.solution || "Check Notes");
}
}
  -1){
currentIndex++;
showQuestion();
}
}


function submitQuiz(){

clearInterval(questionTimer);
clearInterval(totalTimer);

let topicId = localStorage.getItem("activeTopic");

db.collection("attempts")
.doc(userId)
.collection("topics")
.doc(topicId)
.set({
attemptCount: firebase.firestore.FieldValue.increment(1)
},{merge:true});

let score = 0;
let correct = 0;
let wrong = 0;

questions.forEach((q,i)=>{

if(userAnswers[i] == undefined){
return; // unattempted = 0
}

if(userAnswers[i] == q.correctIndex){
score += POSITIVE_MARK;
correct++;
}
else{
score += NEGATIVE_MARK;
wrong++;
}
});

alert(
"Total Questions: "+questions.length+
"\nCorrect: "+correct+
"\nWrong: "+wrong+
"\nFinal Score: "+score
);

window.location.href="course.html";
}

function startTotalTimer(){

clearInterval(totalTimer);

totalTimer = setInterval(()=>{

totalTimeLeft--;

let minutes = Math.floor(totalTimeLeft/60);
let seconds = totalTimeLeft%60;

document.getElementById("totalTimer").innerText =
"Total Time: "+minutes+":"+ (seconds<10?"0":"")+seconds;

if(totalTimeLeft <=0){
clearInterval(totalTimer);
submitQuiz();
}

},1000);
}

function startQuestionTimer(){

clearInterval(questionTimer);

questionTimeLeft = perQuestionTime;

questionTimer = setInterval(()=>{

questionTimeLeft--;

let timerEl = document.getElementById("questionTimer");

timerEl.innerText = "Question Time: "+questionTimeLeft+"s";

if(questionTimeLeft <=20){
timerEl.style.color="red";
}else{
timerEl.style.color="#1b5e20";
}

if(questionTimeLeft <=0){
clearInterval(questionTimer);
nextQuestion();
}

},1000);
                                       }
