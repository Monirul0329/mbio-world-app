auth.onAuthStateChanged(user=>{
if(user){
loadCourses(user.uid);
}
});

function loadCourses(userId){

db.collection("courses").get().then(snapshot=>{
let html="";

snapshot.forEach(doc=>{
let data = doc.data();
let courseId = doc.id;

html += `
<div class="card">
<h3>${data.title}</h3>
<p>₹${data.price}</p>
<p>${data.description}</p>
<button onclick="buyCourse('${courseId}')">Buy</button>
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
});
}
