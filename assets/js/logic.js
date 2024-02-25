let currentQuestionIndex = 0;
let timeLeft = 60;
let timerId;

let questionsEl = document.getElementById('questions');
let endScreenEl = document.getElementById('end-screen');

let sfxRight = new Audio('assets/sfx/correct.wav');
let sfxWrong = new Audio('assets/sfx/incorrect.wav');

function startTimer() {
  timeLeft = 60;
  timerId = setInterval(function () {
    document.getElementById("time").textContent = timeLeft.toString();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      endQuiz();
    } else {
      timeLeft--;
    }
  }, 1000);
}

function showStartingTime() {
  document.getElementById("time").textContent = timeLeft;
}

function getQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion) {
    document.getElementById("question-title").textContent = currentQuestion.title;

    document.getElementById("choices").innerHTML = '';

    for (let i = 0; i < currentQuestion.choices.length; i++) {
      const choiceButton = document.createElement("button");
      choiceButton.textContent = currentQuestion.choices[i];
      choiceButton.value = currentQuestion.choices[i];
      choiceButton.addEventListener("click", questionClick);

      if (currentQuestion.choices[i] === currentQuestion.answer) {
        choiceButton.classList.add("correct-answer");
      }

      document.getElementById("choices").appendChild(choiceButton);
    }
  } else {
    console.error("Current question is undefined");
  }
}

function startQuiz() {
  displayFeedback("Your quiz is starting!");
  document.getElementById("start-screen").style.display = "none";
  questionsEl.style.display = "block";

  startTimer();
  showStartingTime();

  getQuestion();
}

function questionClick(event) {
  const clickedButton = event.target;

  if (!clickedButton.matches("button")) {
    return;
  }

  if (
    currentQuestionIndex < questions.length &&
    clickedButton.value !== questions[currentQuestionIndex].answer
  ) {
    timeLeft -= 15;  // Penalize time by subtracting 15 seconds
    if (timeLeft < 0) {
      timeLeft = 0;
    }

    document.getElementById("time").textContent = timeLeft;
    sfxWrong.play();
    displayFeedback("Wrong!");
  } else {
    sfxRight.play();
    displayFeedback("Correct!");
  }

  document.getElementById("feedback").classList.add("feedback");

  setTimeout(function () {
    document.getElementById("feedback").classList.remove("feedback");
  }, 1000);

  currentQuestionIndex++;

  if (timeLeft <= 0 || currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function displayFeedback(feedbackText) {
  const feedbackElement = document.getElementById("feedback");
  feedbackElement.textContent = feedbackText;
  feedbackElement.classList.remove("hide");

  setTimeout(function () {
    feedbackElement.classList.add("hide");
  }, 1000);
}

function endQuiz() {
  clearInterval(timerId);
  endScreenEl.style.display = "block";
  document.getElementById("final-score").textContent = timeLeft;
}

function quizEnd() {
  clearInterval(timerId);
  document.getElementById("end-screen").classList.remove("hide");
  document.getElementById("final-score").textContent = calculateFinalScore();
  questionsEl.classList.add("hide");

  console.log("Quiz completed!");
}

function calculateFinalScore() {
  // Assuming you want to calculate the final score based on the remaining time
  var maxTime = 60; // Maximum time for full score
  var score = (timeLeft / maxTime) * 100;
  return score.toFixed(2);  // Display the score with two decimal places
}

function clockTick() {
  timeLeft--;
  document.getElementById("time").textContent = timeLeft;

  if (timeLeft <= 0) {
    quizEnd();
  }
}

function saveHighScore() {
  const initials = document.getElementById("initials").value.trim();
  if (initials !== "") {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    highScores.push({ initials: initials, score: timeLeft });
    const highScoresText = JSON.stringify(highScores);
    localStorage.setItem("highScores", highScoresText);
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighScore();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit").onclick = saveHighScore;
});

document.getElementById("start").onclick = startQuiz;

document.getElementById("choices").onclick = questionClick;

document.getElementById("initials").onkeyup = checkForEnter;
