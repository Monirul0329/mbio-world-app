let current = 0;
let time = 60;
let timer;

const questions = [
  {
    q: "Cell is unit of?",
    options: ["Life", "Energy", "Plant", "Animal"],
    answer: 0
  },
  {
    q: "DNA full form?",
    options: [
      "Deoxyribonucleic Acid",
      "Dynamic Acid",
      "Digital Acid",
      "None"
    ],
    answer: 0
  }
];

function loadQuestion(){
  document.getElementById("question").innerText =
    questions[current].q;

  const optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  questions[current].options.forEach((opt,i)=>{
    optDiv.innerHTML +=
      `<button onclick="check(${i})">${opt}</button>`;
  });
}

function check(i){
  if(i === questions[current].answer){
    alert("Correct");
  }else{
    alert("Wrong");
  }
}

function nextQuestion(){
  current++;
  if(current >= questions.length){
    alert("Quiz Finished");
    window.location.href="dashboard.html";
  }else{
    loadQuestion();
  }
}

function startTimer(){
  timer = setInterval(()=>{
    time--;
    document.getElementById("time").innerText = time;

    if(time === 0){
      clearInterval(timer);
      alert("Time Up");
      window.location.href="dashboard.html";
    }
  },1000);
}

window.onload = function(){
  loadQuestion();
  startTimer();
};
