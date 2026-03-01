auth.onAuthStateChanged(user=>{
if(user){
loadCourses();
}
});

// CREATE COURSE
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

// LOAD COURSES
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

loadChapters(courseId);
});

document.getElementById("courseList").innerHTML = html;
});
}

// CREATE CHAPTER
function createChapter(courseId){
let title = document.getElementById("chap_"+courseId).value;

if(!title){
alert("Enter Chapter Title");
return;
}

db.collection("courses")
.doc(courseId)
.collection("chapters")
.add({
title:title
}).then(()=>{
alert("Chapter Added");
loadCourses();
});
}

// LOAD CHAPTERS
function loadChapters(courseId){
db.collection("courses")
.doc(courseId)
.collection("chapters")
.get()
.then(snapshot=>{

let html="";

snapshot.forEach(doc=>{
let chapterId = doc.id;
let data = doc.data();

html += `
<div class="card">
<h5>${data.title}</h5>

<input id="topic_${chapterId}" placeholder="Topic Title">
<button onclick="createTopic('${courseId}','${chapterId}')">Add Topic</button>

<div id="topicList_${chapterId}"></div>
</div>
`;

loadTopics(courseId,chapterId);
});

document.getElementById("chapterList_"+courseId).innerHTML = html;
});
}

// CREATE TOPIC
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
.add({
title:title
}).then(()=>{
alert("Topic Added");
loadCourses();
});
}

// LOAD TOPICS
function loadTopics(courseId,chapterId){
db.collection("courses")
.doc(courseId)
.collection("chapters")
.doc(chapterId)
.collection("topics")
.get()
.then(snapshot=>{

let html="";

snapshot.forEach(doc=>{
let data = doc.data();

  html += `
<div class="card">
<h5>${data.title}</h5>

<input id="q_${doc.id}" placeholder="Question">
<input id="o1_${doc.id}" placeholder="Option 1">
<input id="o2_${doc.id}" placeholder="Option 2">
<input id="o3_${doc.id}" placeholder="Option 3">
<input id="o4_${doc.id}" placeholder="Option 4">
<input id="ans_${doc.id}" placeholder="Correct Index (0-3)">

<button onclick="addQuestion('${courseId}','${chapterId}','${doc.id}')">
Add Question
</button>

</div>
`;
});

document.getElementById("topicList_"+chapterId).innerHTML = html;
});
  }
function addQuestion(courseId,chapterId,topicId){

let q = document.getElementById("q_"+topicId).value;
let o1 = document.getElementById("o1_"+topicId).value;
let o2 = document.getElementById("o2_"+topicId).value;
let o3 = document.getElementById("o3_"+topicId).value;
let o4 = document.getElementById("o4_"+topicId).value;
let ans = parseInt(document.getElementById("ans_"+topicId).value);

if(!q){
alert("Enter Question");
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
correctIndex:ans
}).then(()=>{
alert("Question Added");
});
}
