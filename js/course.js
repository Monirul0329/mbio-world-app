auth.onAuthStateChanged(user=>{
if(!user){
window.location.href="index.html";
return;
}

loadCourse(user.uid);
});

function loadCourse(userId){

let courseId = localStorage.getItem("activeCourse");

if(!courseId){
window.location.href="student.html";
return;
}

Promise.all([
db.collection("courses").doc(courseId).get(),
db.collection("purchases").doc(userId).get()
])
.then(([courseDoc, purchaseDoc])=>{

if(!purchaseDoc.exists || purchaseDoc.data()[courseId] !== true){
alert("You have not purchased this course");
window.location.href="student.html";
return;
}

let data = courseDoc.data();

document.getElementById("courseContent").innerHTML = `
<div class="card">
<h3>${data.title}</h3>
<p>Main Course Dashboard</p>

<button onclick="goTopicSection()">Topic Wise Practice</button>
<button onclick="goTypeSection()">Chapter Type Practice</button>
<button onclick="goNcertSection()">NCERT Reading</button>
</div>
`;
});
}
function goTopicSection(){

let courseId = localStorage.getItem("activeCourse");

db.collection("courses")
.doc(courseId)
.collection("chapters")
.get()
.then(snapshot=>{

let html = "<h3>Chapters</h3>";

snapshot.forEach(doc=>{
let chapterId = doc.id;
let data = doc.data();

html += `
<div class="card">
<h4>${data.title}</h4>
<button onclick="openChapter('${chapterId}')">Open</button>
</div>
`;
});

document.getElementById("courseContent").innerHTML = html;
});
}

function openChapter(chapterId){

let courseId = localStorage.getItem("activeCourse");

db.collection("courses")
.doc(courseId)
.collection("chapters")
.doc(chapterId)
.collection("topics")
.get()
.then(snapshot=>{

let html = "<h3>Topics</h3>";

snapshot.forEach(doc=>{
let topicId = doc.id;
let data = doc.data();

html += `
<div class="card">
<h4>${data.title}</h4>
<button onclick="openTopic('${topicId}')">Start Quiz</button>
</div>
`;
});

document.getElementById("courseContent").innerHTML = html;
});
}

function goTypeSection(){
alert("Chapter Type Section Coming Next Phase");
}

function goNcertSection(){
alert("NCERT Section Coming Next Phase");
}

function goBack(){
window.location.href="student.html";
}
function openTopic(topicId){

localStorage.setItem("activeTopic", topicId);

window.location.href="quiz.html";
  }
