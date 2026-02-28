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

    btn.onclick = () => {
      userAnswers[currentQuestionIndex] = index;
      loadQuestion();
    };

    optionsEl.appendChild(btn);
  });

  startTimer();
}

// ===== TIMER FUNCTION =====
function startTimer() {
  timeLeft = getTimeForAttempt();
  timerEl.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      disableOptions();
    }
  }, 1000);
}

// ===== DISABLE OPTIONS =====
function disableOptions() {
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.style.background = "gray";
  });
}

// ===== NEXT BUTTON =====
document.getElementById("nextBtn").onclick = () => {
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

// ===== SUBMIT QUIZ =====
document.getElementById("submitBtn").onclick = () => {
  clearInterval(timerInterval);

  let correct = 0;

  questions.forEach((q, index) => {
    if (userAnswers[index] === q.correct) {
      correct++;
    }
  });

  let total = questions.length;
  let attempted = userAnswers.filter(a => a !== undefined).length;
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

// ===== REATTEMPT FUNCTION =====
function reattemptQuiz() {
  attemptCount++;
  localStorage.setItem("quizAttempt", attemptCount);

  currentQuestionIndex = 0;
  userAnswers = [];
  resultEl.innerHTML = "";
  loadQuestion();
}

// ===== INITIAL LOAD =====
loadQuestion();
