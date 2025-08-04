const questions = [
//Array of question objects with choices and correct answerinex
  {
    question: "What does HTML stand for?",
    choices: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "HyperTabular Markup Language",
      "None of these"
    ],
    correctAnswer: 0,
  },
  {
    question: "Which language is used for styling web pages?",
    choices: ["HTML", "JQuery", "CSS", "XML"],
    correctAnswer: 2,
  },
  {
    question: "Which is not a JavaScript Framework?",
    choices: ["Python Script", "JQuery", "Django", "NodeJS"],
    correctAnswer: 2,
  },
  {
    question: "Which is used for Connect To Database?",
    choices: ["PHP", "HTML", "JS", "All"],
    correctAnswer: 0,
  },
  {
    question: "Which of the following is a scripting language?",
    choices: ["HTML", "CSS", "JavaScript", "XML"],
    correctAnswer: 2,
  }//add more questions
];

let currentQuestion = 0;//tracks current question index
let score = 0;//tracks the score
let timer;//interval time variable
let timeLeft = 10;//time limit for each question
let userAnswers = [];//store the results given by user (correct/incorrect)

const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");
const answerList = document.getElementById("answer-list");
const nextBtn = document.getElementById("next-btn");
const viewResultsBtn = document.getElementById("view-results-btn");
const resultBox = document.getElementById("result-box");
const quizBox = document.getElementById("quiz-box");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const summaryBox = document.getElementById("summary");
const timerDisplay = document.getElementById("time-left");
const progressBar = document.getElementById("progress-bar");

//starts the countdown timer
function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoNext();//movies to next question automatically
    }
  }, 1000);
}

//displays the current question and its choices
function showQuestion() {
  resetState();
  const question = questions[currentQuestion];
  questionText.textContent = question.question;
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;


  //create list items for each answer choice
  question.choices.forEach((choice, index) => {
    const li = document.createElement("li");
    li.textContent = choice;
    li.addEventListener("click", () => selectAnswer(li, index));
    answerList.appendChild(li);
  });

  updateProgress();
  startTimer();//start timer for new question
}

//handles answer selection and evaluates the correct answers
function selectAnswer(element, selectedIndex) {
  clearInterval(timer);
  const correct = questions[currentQuestion].correctAnswer;
  const options = answerList.children;

  //remove previous slection and disable clicking
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("selected");
    options[i].removeEventListener("click", () => {});
  }

  element.classList.add("selected");
  if (selectedIndex === correct) {
    element.classList.add("correct");
    score++;
    userAnswers.push({ questionIndex: currentQuestion, correct: true });
  } else {
    element.classList.add("incorrect");
    options[correct].classList.add("correct");
    userAnswers.push({ questionIndex: currentQuestion, correct: false });
  }

  nextBtn.disabled = false;//enables the next button after selection
}


//clears previous question data 
function resetState() {
  nextBtn.disabled = true;
  answerList.innerHTML = "";
}

//updates progress bar width based on question index
function updateProgress() {
  const progress = ((currentQuestion) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

//moves to next question if time runs out
function autoNext() {
  userAnswers.push({ questionIndex: currentQuestion, correct: false });
  showNext();
}

//handles the logic for moving to the next question
function showNext() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResults();//if last question, show results
  }
}


//displays the final score and result summary
function showResults() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  finalScore.textContent = `${score} / ${questions.length}`;
  progressBar.style.width = `100%`;

  //shows summary of all questions and results
  summaryBox.innerHTML = userAnswers.map(answer => {
    const q = questions[answer.questionIndex];
    return `
      <div class="${answer.correct ? 'correct' : 'incorrect'}">
        <p><strong>${q.question}</strong></p>
        <p>Your answer: ${answer.correct ? q.choices[q.correctAnswer] : "Incorrect"}</p>
      </div>
    `;
  }).join('');
}

//restarts the entire quiz state for restart
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  quizBox.classList.remove("hidden");
  resultBox.classList.add("hidden");
  viewResultsBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
  showQuestion();
}

//event listeners
nextBtn.addEventListener("click", () => {
  if (currentQuestion === questions.length - 1) {
    viewResultsBtn.style.display = "inline-block";
    nextBtn.style.display = "none";
  }
  showNext();
});

viewResultsBtn.addEventListener("click", showResults);
restartBtn.addEventListener("click", restartQuiz);

//initial function call to load the first question
showQuestion();
