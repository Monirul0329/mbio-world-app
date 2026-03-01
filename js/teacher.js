auth.onAuthStateChanged(user=>{
if(user){
loadCourses();
}
});

// ======================
// CREATE COURSE
// ======================
function createCourse(){
const title = document.getElementById("courseTitle").value;
const price = document.getElementById("coursePrice").value;
const desc = document.getElementById("courseDesc").value;

if(!title || !price){
alert("Fill all fields");
return;
}

db.collection("courses").add({
title:title,
price:price,
description:desc,
createdAt:firebase.firestore.FieldValue.serverTimestamp()
}).then(()=>{
alert("Course Created");
loadCourses();
});
}

// ======================
// LOAD COURSES
// ======================
function loadCourses(){
db.collection("courses").get().then(snapshot=>{
let html="<h3>Your Courses</h3>";

snapshot.forEach(doc=>{
let data = doc.data();
let courseId = doc.id;

html += `
<div class="card">
<h4>${data.title}</h4>
<p>₹${data.price}</p>

<input id="chap_${courseId}" placeholder="Chapter Title">
<button onclick="createChapter('${courseId}')">Add Chapter</button>

<div id="chapterList_${courseId}"></div>
</div>
`;
});

document.getElementById("courseList").innerHTML = html;

snapshot.forEach(doc=>{
loadChapters(doc.id);
});
});
}

// ======================
// CREATE CHAPTER
// ======================
function createChapter(courseId){
let title = document.getElementById("chap_"+courseId).value;

if(!title){
alert("Enter Chapter Title");
return;
}

db.collection("courses")
.doc(courseId)
.collection("chapters")
.get()
.then(snapshot=>{

let order = snapshot.size + 1;

db.collection("courses")
.doc(courseId)
.collection("chapters")
.add({
title:title,
order:order
}).then(()=>{
alert("Chapter Added");
loadCourses();
});
});
}

// ======================
// LOAD CHAPTERS
// ======================
function loadChapters(courseId){
db.collection("courses")
.doc(courseId)
.collection("chapters")
.orderBy("order")
.get()
.then(snapshot=>{

let html="";
let count=1;

snapshot.forEach(doc=>{
let chapterId = doc.id;
let data = doc.data();

html += `
<div class="card">
<h5>Chapter ${count}: ${data.title}</h5>

<input id="topic_${chapterId}" placeholder="Topic Title">
<button onclick="createTopic('${courseId}','${chapterId}')">Add Topic</button>

<div id="topicList_${chapterId}"></div>
</div>
`;

count++;
});

document.getElementById("chapterList_"+courseId).innerHTML = html;

snapshot.forEach(doc=>{
loadTopics(courseId,doc.id);
});
});
}

// ======================
// CREATE TOPIC
// ======================
function createTopic(courseId,chapterId){
let title = document.getElementById("topic_"+chapterId).value;

if(!title){
alert("Enter Topic Title");
return;
}

db.collection("courses")
.doc(courseId)
.collection("chapters")
.doc(chapterId)
.collection("topics")
.get()
.then(snapshot=>{

let order = snapshot.size + 1;

db.collection("courses")
.doc(courseId)
.collection("chapters")
.doc(chapterId)
.collection("topics")
.add({
title:title,
order:order
}).then(()=>{
alert("Topic Added");
loadCourses();
});
});
}

// ======================
// LOAD TOPICS
// ======================
function loadTopics(courseId,chapterId){
db.collection("courses")
.doc(courseId)
.collection("chapters")
.doc(chapterId)
.collection("topics")
.orderBy("order")
.get()
.then(snapshot=>{

let html="";
let count=1;

snapshot.forEach(doc=>{
let topicId = doc.id;
let data = doc.data();

html += `
<div class="card">
<h5>Topic ${count}: ${data.title}</h5>

<input id="q_${topicId}" placeholder="Question">
<input id="o1_${topicId}" placeholder="Option 1">
<input id="o2_${topicId}" placeholder="Option 2">
<input id="o3_${topicId}" placeholder="Option 3">
<input id="o4_${topicId}" placeholder="Option 4">
<input id="ans_${topicId}" placeholder="Correct Index (0-3)">
<input id="sol_${topicId}" placeholder="Solution (optional)">

<button onclick="addQuestion('${courseId}','${chapterId}','${topicId}')">
Add Question
</button>

<div id="questionList_${topicId}"></div>
</div>
`;

loadQuestions(courseId,chapterId,topicId);
count++;
});

document.getElementById("topicList_"+chapterId).innerHTML = html;
});
}

// ======================
// ADD QUESTION
// ======================
function addQuestion(courseId,chapterId,topicId){

let q = document.getElementById("q_"+topicId).value;
let o1 = document.getElementById("o1_"+topicId).value;
let o2 = document.getElementById("o2_"+topicId).value;
let o3 = document.getElementById("o3_"+topicId).value;
let o4 = document.getElementById("o4_"+topicId).value;
let ans = parseInt(document.getElementById("ans_"+topicId).value);
let sol = document.getElementById("sol_"+topicId).value;

if(!q || isNaN(ans)){
alert("Fill Question and Correct Index");
return;
}

db.collection("courses")
.doc(courseId)
.collection("chapters")
.doc(chapterId)
.collection("topics")
.doc(topicId)
.collection("quiz")
.add({
questionText:q,
options:[o1,o2,o3,o4],
correctIndex:ans,
solution:sol || ""
})
.then(()=>{
alert("Question Added");
loadCourses();
});
}

// ======================
// LOAD QUESTIONS (FIXED)
// ======================
function loadQuestions(courseId,chapterId,topicId){
db.collection("courses")
.doc(courseId)
.collection("chapters")
.doc(chapterId)
.collection("topics")
.doc(topicId)
.collection("quiz")
.get()
.then(snapshot=>{

let html="";
let qno=1;

snapshot.forEach(doc=>{
let data = doc.data();

html += `
<div class="card">
<p><b>Q${qno}. ${data.questionText}</b></p>
<p>1) ${data.options[0]}</p>
<p>2) ${data.options[1]}</p>
<p>3) ${data.options[2]}</p>
<p>4) ${data.options[3]}</p>
<p>Correct: ${data.correctIndex+1}</p>

<button onclick="editQuestion('${courseId}','${chapterId}','${topicId}','${doc.id}')">
Edit
</button>

<button onclick="deleteQuestion('${courseId}','${chapterId}','${topicId}','${doc.id}')">
Delete
</button>
</div>
`;

qno++;
});

document.getElementById("questionList_"+topicId).innerHTML = html;
});
}

// ======================
// EDIT QUESTION
// ======================
function editQuestion(courseId,chapterId,topicId,questionId){

let newQ = prompt("Enter new question text");
if(!newQ) return;

db.collection("courses")
.doc(courseId)
.collection("chapters")
.doc(chapterId)
.collection("topics")
.doc(topicId)
.collection("quiz")
.doc(questionId)
.update({
questionText:newQ
})
.then(()=>{
alert("Updated");
loadCourses();
});
}

// ======================
// DELETE QUESTION
// ======================
function deleteQuestion(courseId,chapterId,topicId,questionId){
db.collection("courses")
.doc(courseId)
.collection("chapters")
.doc(chapterId)
.collection("topics")
.doc(topicId)
.collection("quiz")
.doc(questionId)
.delete()
.then(()=>{
alert("Deleted");
loadCourses();
});
  }
