// Starry background animation
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

function initStars() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  stars = [];
  const starCount = 150;

  for(let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random(),
      alphaChange: (Math.random() * 0.02) + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  for(let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha.toFixed(2)})`;
    ctx.fill();

    star.alpha += star.alphaChange * star.direction;
    if(star.alpha <= 0) {
      star.alpha = 0;
      star.direction = 1;
    } else if (star.alpha >= 1) {
      star.alpha = 1;
      star.direction = -1;
    }
  }
  requestAnimationFrame(drawStars);
}

initStars();
drawStars();
window.addEventListener('resize', initStars);

// Space facts to show on correct answers
const spaceFacts = [
  "🌌 There are more stars in the universe than grains of sand on Earth!",
  "🪐 Saturn could float in water because it’s mostly gas!",
  "🌕 The Moon is slowly moving away from Earth—about 3.8 cm per year.",
  "🚀 A day on Venus is longer than its year!",
  "☀️ The Sun accounts for 99.86% of the mass in our solar system.",
  "🌍 Earth is the only planet not named after a god.",
  "🌟 Neutron stars can spin 600 times per second!",
  "🪐 Jupiter’s Great Red Spot is a storm larger than Earth!",
  "🌠 It takes 8 minutes and 20 seconds for light from the Sun to reach Earth."
];

// Quiz questions
const questions = [
  {
    question: "🌍 What is the third planet from the Sun?",
    options: ["Venus", "Earth", "Mars", "Jupiter"],
    answer: "Earth"
  },
  {
    question: "🪐 Which planet has the most moons?",
    options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    answer: "Saturn"
  },
  {
    question: "🌕 What is the name of Earth's natural satellite?",
    options: ["Phobos", "Deimos", "Moon", "Europa"],
    answer: "Moon"
  },
  {
    question: "☄️ What is a comet made of?",
    options: ["Rock and ice", "Gas only", "Metal", "Plasma"],
    answer: "Rock and ice"
  },
  {
    question: "🚀 Who was the first person to walk on the Moon?",
    options: ["Yuri Gagarin", "Buzz Aldrin", "Neil Armstrong", "John Glenn"],
    answer: "Neil Armstrong"
  }
];

// DOM Elements
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const timerEl = document.getElementById('timer');
const factCardContainer = document.getElementById('fact-card-container');
const factText = document.getElementById('fact-text');
const resultBox = document.getElementById('result-box');
const scoreEl = document.getElementById('score');

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 15;

// Start the countdown timer
function startTimer() {
  timeLeft = 15;
  timerEl.textContent = `Time left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      disableOptions();
      setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
      }, 2000);
    }
  }, 1000);
}

// Load current question and options
function loadQuestion() {
  clearInterval(timerInterval);
  factCardContainer.classList.remove('show');

  if (currentQuestionIndex >= questions.length) {
    showResult();
    return;
  }

  const currentQ = questions[currentQuestionIndex];
  questionEl.textContent = currentQ.question;
  optionsEl.innerHTML = '';

  currentQ.options.forEach(option => {
    const btn = document.createElement('button');
    btn.classList.add('option');
    btn.textContent = option;
    btn.addEventListener('click', () => selectOption(option, btn));
    optionsEl.appendChild(btn);
  });

  startTimer();
}

// Disable all option buttons
function disableOptions() {
  const buttons = optionsEl.querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = true);
}

// Handle option selection
function selectOption(selected, button) {
  clearInterval(timerInterval);
  disableOptions();

  const correctAnswer = questions[currentQuestionIndex].answer;

  if (selected === correctAnswer) {
    score++;
    button.classList.add('selected');
    showFactCard();
  } else {
    button.style.backgroundColor = '#cc3333';
    button.style.color = '#fff';

    // Highlight correct answer
    const buttons = optionsEl.querySelectorAll('button');
    buttons.forEach(btn => {
      if (btn.textContent === correctAnswer) {
        btn.style.backgroundColor = '#33cc33';
        btn.style.color = '#fff';
      }
    });

    setTimeout(() => {
      currentQuestionIndex++;
      loadQuestion();
    }, 2000);
  }
}

// Show fact card with random space fact, flip animation
function showFactCard() {
  const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  factText.textContent = fact;

  factCardContainer.classList.add('show');

  setTimeout(() => {
    factCardContainer.classList.remove('show');
    currentQuestionIndex++;
    loadQuestion();
  }, 3000);
}

// Show final score and restart option
function showResult() {
  document.getElementById('quiz-box').style.display = 'none';
  resultBox.style.display = 'block';
  scoreEl.textContent = `${score} / ${questions.length}`;
}

// Restart quiz
function restartQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  resultBox.style.display = 'none';
  document.getElementById('quiz-box').style.display = 'block';
  loadQuestion();
}

// Initialize quiz on page load
document.addEventListener('DOMContentLoaded', loadQuestion);
