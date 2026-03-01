auth.onAuthStateChanged(user=>{
if(user){
loadCourses();
}
});

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

function loadCourses(){
db.collection("courses").get().then(snapshot=>{
let html="";
snapshot.forEach(doc=>{
let data = doc.data();
html += `
<div class="card">
<h3>${data.title}</h3>
<p>₹${data.price}</p>
<p>${data.description}</p>
</div>
`;
});
document.getElementById("courseList").innerHTML = html;
});
}
