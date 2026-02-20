const $ = document.querySelector.bind(document);
const leftCounter = $("#left-counter");
const rightCounter = $("#right-counter");
const p1Plus = $("#p1-plus");
const p1Minus = $("#p1-minus");
const p2Plus = $("#p2-plus");
const p2Minus = $("#p2-minus");
const start = $("#start");
const pause = $("#pause");
const reset = $("#reset");
const selectList = $("#game-length-select");
const winnerText = $("#winner-text");
const scoreboard = $("#scoreboard");
const timer = $("#timer");

let startTime = 0;
let elapsedTime = 0;
let paused = true;
let intervalId;

function startTimer() {
    if (paused) {
        paused = false;
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(function() {
            elapsedTime = Date.now() - startTime;
            seconds = Math.floor((elapsedTime / 1000) % 60);
            minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
            timer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }, 1000);
    }
}

function pauseTimer() {
    if (!paused) {
        paused = true;
        elapsedTime = Date.now() - startTime;
        clearInterval(intervalId);
    }
}

function resetTimer() {
    paused = true;
    clearInterval(intervalId);
    startTime = 0, elapsedTime = 0;
    timer.textContent = "00:00"; 
}

function defaultSettings() {
    [p1Plus, p1Minus, p2Plus, p2Minus, pause, reset].forEach(function (el) {
        el.classList.remove("active");
        el.classList.add("disabled");
    });
    winnerText.classList.remove("visible");
    winnerText.classList.add("invisible");
    start.classList.remove("disabled");
    start.classList.add("active");
    scoreboard.classList.add("disabled-text");
    leftCounter.textContent = 0;
    rightCounter.textContent = 0;
    leftCounter.classList.remove("winner-color", "loser-color");
    rightCounter.classList.remove("winner-color", "loser-color");
}

defaultSettings();

start.addEventListener("click", function() {
    [p1Plus, p2Plus, pause, reset].forEach(function (el) {
        el.classList.remove("disabled");
        el.classList.add("active");
    });
    start.classList.replace("active", "disabled");
    scoreboard.classList.remove("disabled-text");
    if (Number(leftCounter.innerText) > 0) {
        p1Minus.classList.replace("disabled", "active");
    }
    if (Number(rightCounter.innerText) > 0) {
        p2Minus.classList.replace("disabled", "active");
    }
    startTimer();
});

pause.addEventListener("click", function() {
    [p1Plus, p1Minus, p2Plus, p2Minus, pause].forEach(function (el) {
        el.classList.remove("active");
        el.classList.add("disabled");
    });
    start.classList.replace("disabled", "active");
    scoreboard.classList.add("disabled-text");
    pauseTimer();
});

reset.addEventListener("click", function() {
    scoreboard.classList.add("disabled-text");
    defaultSettings();
    resetTimer();
});

function addPoint(playerScoreEl, playerMinusBtn, playerName) {
    playerScoreEl.textContent = Number(playerScoreEl.textContent) + 1;
    playerMinusBtn.classList.replace("disabled", "active");
    if (Number(playerScoreEl.textContent) === Number(selectList.value)) {
        [p1Plus, p1Minus, p2Plus, p2Minus, pause, reset].forEach(function (el) {
            el.classList.remove("active"); 
            el.classList.add("disabled");
        });
        reset.classList.replace("disabled", "active");
        winnerText.textContent = `${playerName} wins!`;
        winnerText.classList.replace("invisible", "visible");
        pauseTimer();
        if (playerScoreEl === leftCounter) {
            leftCounter.classList.add("winner-color");
            rightCounter.classList.add("loser-color");
        } else if (playerScoreEl === rightCounter) {
            leftCounter.classList.add("loser-color");
            rightCounter.classList.add("winner-color");
        }
    }
}

p1Plus.addEventListener("click", function() {
    addPoint(leftCounter, p1Minus, "Player One");
});

p2Plus.addEventListener("click", function() {
    addPoint(rightCounter, p2Minus, "Player Two");
});

function removePoint(playerScoreEl, playerMinusBtn) {
    playerScoreEl.textContent = Number(playerScoreEl.textContent) - 1;
    if (Number(playerScoreEl.textContent) === 0) {
        playerMinusBtn.classList.replace("active", "disabled");
    }
}

p1Minus.addEventListener("click", function() {
    removePoint(leftCounter, p1Minus);
});

p2Minus.addEventListener("click", function() {
    removePoint(rightCounter, p2Minus);
});

selectList.addEventListener("change", function() {
    if (Number(leftCounter.textContent) >= Number(selectList.value) || Number(rightCounter.textContent) >= Number(selectList.value)) {
        scoreboard.classList.add("disabled-text");
        defaultSettings();
        resetTimer();
    }
});