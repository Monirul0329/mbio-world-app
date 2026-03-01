let questions = [];
let currentIndex = 0;
let userAnswers = [];

auth.onAuthStateChanged(user=>{
if(!user){
window.location.href="index.html";
return;
}

loadQuiz();
});

function loadQuiz(){

let courseId = localStorage.getItem("activeCourse");
let topicId = localStorage.getItem("activeTopic");

db.collection("courses")
.doc(courseId)
.collection("chapters")
.get()
.then(chapterSnap=>{

chapterSnap.forEach(chapDoc=>{
db.collection("courses")
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
showQuestion();
});
});

});
}

function showQuestion(){

let q = questions[currentIndex];

if(!q){
document.getElementById("quizContainer").innerHTML="No Questions";
return;
}

let html = `
<div class="card">
<h3>${q.questionText}</h3>

${q.options.map((opt,i)=>
`<div>
<input type="radio" name="option" value="${i}"
${userAnswers[currentIndex]==i?"checked":""}
onclick="selectAnswer(${i})">
${opt}
</div>`
).join("")}

</div>
`;

document.getElementById("quizContainer").innerHTML = html;
}

function selectAnswer(index){
userAnswers[currentIndex] = index;
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

let score = 0;

questions.forEach((q,i)=>{
if(userAnswers[i] == q.correctIndex){
score++;
}
});

alert("Score: "+score+"/"+questions.length);
window.location.href="course.html";
}
