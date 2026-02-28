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

// ===== VARIABLES =====
let currentQuestionIndex = 0;
let userAnswers = [];

let timeLeft = 60;
let timerInterval;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");

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
  timeLeft = 60;
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
    Total: ${total} <br>
    Attempted: ${attempted} <br>
    Skipped: ${skipped} <br>
    Correct: ${correct} <br>
    Incorrect: ${incorrect} <br>
    Accuracy: ${accuracy}%
  `;
};

// ===== INITIAL LOAD =====
loadQuestion();
