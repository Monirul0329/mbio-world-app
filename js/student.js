auth.onAuthStateChanged(user=>{
if(user){
loadCourses(user.uid);
}
});

function loadCourses(userId){

Promise.all([
db.collection("courses").get(),
db.collection("purchases").doc(userId).get()
])
.then(([courseSnap, purchaseSnap])=>{

let purchased = purchaseSnap.exists ? purchaseSnap.data() : {};
let html="";

courseSnap.forEach(doc=>{
let data = doc.data();
let courseId = doc.id;

let isBought = purchased[courseId] === true;

html += `
<div class="card">
<h3>${data.title}</h3>
<p>₹${data.price}</p>
<p>${data.description}</p>

${isBought 
? `<button onclick="openCourse('${courseId}')">Open Course</button>` 
: `<button onclick="buyCourse('${courseId}')">Buy</button>`
}

</div>
`;
});

document.getElementById("courseContainer").innerHTML = html;

});
}

function buyCourse(courseId){
const user = auth.currentUser;

db.collection("purchases")
.doc(user.uid)
.set({
[courseId]: true
},{merge:true})
.then(()=>{
alert("Course Purchased");
loadCourses(user.uid);
});
}

function openCourse(courseId){
localStorage.setItem("activeCourse", courseId);
window.location.href="course.html";
}
