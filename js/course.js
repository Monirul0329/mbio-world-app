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
alert("Topic Wise Section Coming Next Phase");
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
