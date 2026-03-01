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
selectedOption = null;

clearInterval(questionTimer);

let q = questions[currentIndex];

if(!q){
document.getElementById("quizContainer").innerHTML="No Questions";
return;
}

let html = `
<div class="card">
<h3>${q.questionText}</h3>

${q.options.map((opt,i)=>
`<div class="option" onclick="selectAnswer(${i}, this)">
${opt}
</div>`
).join("")}

<button onclick="submitAnswer()">Submit Answer</button>

<div id="solutionBox" style="display:none;margin-top:10px;"></div>

</div>
`;

document.getElementById("quizContainer").innerHTML = html;

startQuestionTimer();

}

function selectAnswer(index, element){

if(questionSubmitted) return;

selectedOption = element;
userAnswers[currentIndex] = index;

document.querySelectorAll(".option").forEach(opt=>{
opt.style.background="#f1f1f1";
});

element.style.background="#bbdefb";
}

function submitAnswer(){

if(questionSubmitted) return;

if(selectedOption == null){
alert("Select an answer first");
return;
}

questionSubmitted = true;
clearInterval(questionTimer);

let q = questions[currentIndex];

document.querySelectorAll(".option").forEach((opt,i)=>{

if(i == q.correctIndex){
opt.style.background="#4CAF50";
opt.style.color="white";
}

if(i == userAnswers[currentIndex] && i != q.correctIndex){
opt.style.background="#f44336";
opt.style.color="white";
}

opt.style.pointerEvents="none";

});

if(userAnswers[currentIndex] != q.correctIndex){
let box = document.getElementById("solutionBox");
box.style.display="block";
box.innerHTML = "<b>Solution:</b> " + (q.solution || "Check NCERT");
}

}

function nextQuestion(){
if(currentIndex < questions.length-1){
currentIndex++;
showQuestion();
}
}

function prevQuestion(){
if(currentIndex > 0){
currentIndex--;
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

questions.forEach((q,i)=>{
if(userAnswers[i] == q.correctIndex){
score++;
}
});

alert("Score: "+score+"/"+questions.length);
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
