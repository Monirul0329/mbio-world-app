// ===== QUESTIONS =====
const questions = [
  {
    question: "Cell is the unit of?",
    options: ["Life", "Atom", "Energy", "Matter"],
    correct: 0
  },
  {
    question: "DNA full form?",
    options: [
      "Deoxy Nucleic Acid",
      "Deoxyribo Nucleic Acid",
      "Dynamic Acid",
      "None"
    ],
    correct: 1
  }
];

// ===== ATTEMPT SYSTEM =====
let attemptCount = localStorage.getItem("quizAttempt");
if (!attemptCount) {
  attemptCount = 1;
  localStorage.setItem("quizAttempt", 1);
} else {
  attemptCount = parseInt(attemptCount);
}

// ===== VARIABLES =====
let currentQuestionIndex = 0;
let userAnswers = [];
let answerStatus = [];

let timeLeft;
let timerInterval;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");

// ===== GET TIME BASED ON ATTEMPT =====
function getTimeForAttempt() {
  if (attemptCount === 1) return 60;
  if (attemptCount === 2) return 50;
  if (attemptCount === 3) return 40;
  return 30;
}

// ===== LOAD QUESTION =====
function loadQuestion() {
  clearInterval(timerInterval);

  const current = questions[currentQuestionIndex];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";

  current.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;

    if (userAnswers[currentQuestionIndex] === index) {
      btn.classList.add("selected");
    }

    if (answerStatus[currentQuestionIndex] === "submitted") {
      btn.disabled = true;
    }

    btn.onclick = () => {
      if (answerStatus[currentQuestionIndex] === "submitted") return;
      userAnswers[currentQuestionIndex] = index;
      answerStatus[currentQuestionIndex] = "selected";
      loadQuestion();
    };

    optionsEl.appendChild(btn);
  });

  startTimer();
}

// ===== TIMER FUNCTION =====
function startTimer() {
  if (answerStatus[currentQuestionIndex] === "submitted") return;

  timeLeft = getTimeForAttempt();
  timerEl.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      lockAnswer();
    }
  }, 1000);
}

// ===== LOCK ANSWER =====
function lockAnswer() {
  answerStatus[currentQuestionIndex] = "submitted";

  const buttons = optionsEl.querySelectorAll("button");
  const correctIndex = questions[currentQuestionIndex].correct;

  buttons.forEach((btn, index) => {
    btn.disabled = true;

    if (index === correctIndex) {
      btn.style.background = "#2ecc71"; // soft green
      btn.style.color = "white";
    }

    if (userAnswers[currentQuestionIndex] === index && index !== correctIndex) {
      btn.style.background = "#e74c3c"; // soft red
      btn.style.color = "white";
    }
  });
}
const answerBtn = document.getElementById("answerBtn");

answerBtn.onclick = () => {
  if (answerStatus[currentQuestionIndex] !== "selected") {
    alert("Select an option first!");
    return;
  }
  clearInterval(timerInterval);
  lockAnswer();
};
  document.getElementById("qno").textContent = currentQuestionIndex + 1;
// ===== NEXT BUTTON =====
document.getElementById("nextBtn").onclick = () => {
  if (answerStatus[currentQuestionIndex] !== "submitted") {
    alert("Please submit answer first!");
    return;
  }
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
};

// ===== PREVIOUS BUTTON =====
document.getElementById("prevBtn").onclick = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
};

// ===== FINAL QUIZ SUBMIT =====
document.getElementById("submitBtn").onclick = () => {
  clearInterval(timerInterval);

  let correct = 0;

  questions.forEach((q, index) => {
    if (userAnswers[index] === q.correct) {
      correct++;
    }
  });

  let total = questions.length;
  let percentage = ((correct / total) * 100).toFixed(2);

  // Example Topper Score
  let topperScore = 90;

  // Full screen result page
  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      background:linear-gradient(to right,#141e30,#243b55);
      color:white;
      text-align:center;
      font-family:sans-serif;
    ">
      <h1>Exam Result</h1>

      <h2 style="font-size:60px; margin:10px 0;">
        ${correct}/${total}
      </h2>

      <h3 style="font-size:30px;">
        ${percentage}%
      </h3>

      <div style="margin-top:20px; font-size:18px;">
        <p>Correct: ${correct}</p>
        <p>Incorrect: ${total - correct}</p>
      </div>

      <div style="margin-top:15px;">
        <p>Topper Score: ${topperScore}%</p>
        <p>
          You are 
          ${percentage >= topperScore ? 
            '<span style="color:#00e676">Above Topper</span>' : 
            '<span style="color:#ff5252">Below Topper</span>'}
        </p>
      </div>

      <button onclick="location.reload()" 
        style="
          padding:15px 30px;
          background:#00c853;
          border:none;
          border-radius:10px;
          font-size:18px;
          margin-top:25px;
          cursor:pointer;
        ">
        Reattempt
      </button>
    </div>
  `;
};

  let total = questions.length;
  let attempted = answerStatus.filter(s => s === "submitted").length;
  let skipped = total - attempted;
  let incorrect = attempted - correct;
  let accuracy = ((correct / total) * 100).toFixed(2);

  resultEl.innerHTML = `
    <h3>Attempt: ${attemptCount}</h3>
    Total: ${total} <br>
    Attempted: ${attempted} <br>
    Skipped: ${skipped} <br>
    Correct: ${correct} <br>
    Incorrect: ${incorrect} <br>
    Accuracy: ${accuracy}% <br><br>
    <button onclick="reattemptQuiz()">Reattempt</button>
  `;
};

// ===== REATTEMPT =====
function reattemptQuiz() {
  attemptCount++;
  localStorage.setItem("quizAttempt", attemptCount);

  currentQuestionIndex = 0;
  userAnswers = [];
  answerStatus = [];
  resultEl.innerHTML = "";
  loadQuestion();
}

// ===== INITIAL LOAD =====
loadQuestion();
