 const screens = document.querySelectorAll(".screen");
    const chooseInsectButtons = document.querySelectorAll(".choose-insect-btn");
    const startButton = document.getElementById("start-btn");
    const gameContainer = document.getElementById("game-container");
    const timeElement = document.getElementById("time");
    const scoreElement = document.getElementById("score");
    const message = document.getElementById("message");
    const pauseButton = document.getElementById("pause-btn");
    const endScreen = document.getElementById("end-screen");
    const highScoreDisplay = document.getElementById("high-score");
    const squishSound = document.getElementById("squish-sound");
    const restartButton = document.getElementById("restart-btn");
    const difficultyButtons = document.querySelectorAll(".difficulty");

    let seconds = 0;
    let score = 0;
    let selectedInsect = {};
    let gameInterval;
    let isPaused = false;
    let insectSpeed = 1500; // default to medium

    const HIGH_SCORE_KEY = 'insectGameHighScore';

    startButton.addEventListener("click", () => {
      screens[0].classList.add("up");
    });

    difficultyButtons.forEach(button => {
      button.addEventListener("click", () => {
        insectSpeed = parseInt(button.getAttribute("data-speed"));
        screens[1].classList.add("up");
      });
    });

    chooseInsectButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const img = button.querySelector("img");
        const src = img.getAttribute("src");
        const alt = img.getAttribute("alt");
        selectedInsect = { src, alt };
        screens[2].classList.add("up");
        setTimeout(createInsect, 1000);
        startGame();
      });
    });

    pauseButton.addEventListener("click", () => {
      isPaused = !isPaused;
      pauseButton.textContent = isPaused ? "Resume" : "Pause";
    });

    restartButton.addEventListener("click", () => {
      location.reload();
    });

    function createInsect() {
      if (isPaused) return;
      const insect = document.createElement("div");
      insect.classList.add("insect");
      const { x, y } = getRandomLocation();
      insect.style.top = `${y}px`;
      insect.style.left = `${x}px`;
      insect.innerHTML = `<img src="${selectedInsect.src}" alt="${selectedInsect.alt}" />`;
      insect.addEventListener("click", catchInsect);
      gameContainer.appendChild(insect);
    }

    function getRandomLocation() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = Math.random() * (width - 200) + 100;
      const y = Math.random() * (height - 200) + 100;
      return { x, y };
    }

    function catchInsect() {
      if (isPaused) return;
      increaseScore();
      squishSound.play();
      this.classList.add("caught");
      setTimeout(() => this.remove(), 2000);
      setTimeout(createInsect, insectSpeed);
      setTimeout(createInsect, insectSpeed + 300);
    }

    function startGame() {
      gameInterval = setInterval(() => {
        if (!isPaused) {
          increaseTime();
        }
      }, 1000);
    }

    function increaseTime() {
      seconds++;
      let m = Math.floor(seconds / 60);
      let s = seconds % 60;
      m = m < 10 ? `0${m}` : m;
      s = s < 10 ? `0${s}` : s;
      timeElement.innerHTML = `Time: ${m}:${s}`;
    }

    function increaseScore() {
      score++;
      if (score > 19) {
        message.classList.add("visible");
      }
      scoreElement.innerHTML = `Score: ${score}`;
      const highScore = localStorage.getItem(HIGH_SCORE_KEY) || 0;
      if (score > highScore) {
        localStorage.setItem(HIGH_SCORE_KEY, score);
      }
    }

    function endGame() {
      clearInterval(gameInterval);
      screens[3].classList.add("up");
      highScoreDisplay.textContent = `High Score: ${localStorage.getItem(HIGH_SCORE_KEY) || 0}`;
    }

    setTimeout(() => {
      setTimeout(endGame, 60000);
    }, 1000);

    const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", () => {
  // Reset values
  score = 0;
  seconds = 0;
  selectedInsect = {};
  timeElement.innerHTML = "Time: 00:00";
  scoreElement.innerHTML = "Score: 0";

  // Clear insects
  gameContainer.querySelectorAll(".insect").forEach(i => i.remove());

  // Reset screen position to first screen
  screens.forEach(screen => screen.classList.remove("up"));

  // Optional: clear localStorage high score if you want
  // localStorage.removeItem("highScore");
});