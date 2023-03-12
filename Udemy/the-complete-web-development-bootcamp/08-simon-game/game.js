/// <reference path="../_lib-src/jquery.js" />


/* Init game */

const colorNames = ["green", "red", "yellow", "blue"];

const startKeyCodes = ["Enter", "Space"];
var gameStarted = false;
var gameLevel = 0;

var gameSequence = [];
var userSequence = [];


$(".btn").on("click", (event) => {
  playerStep(event.target.id);
});

$(document).on("keydown", (event) => {
  if (gameStarted) {
    return;
  }

  if (!startKeyCodes.includes(event.code)) {
    return;
  }

  gameStarted = true;
  gameStep();
});


/* Game Logic */

async function gameStep() {
  if (!gameStarted) {
    return;
  }

  setGameTitle("Level " + (++gameLevel));

  await sleep(1000);
  
  if (!gameStarted) {
    return;
  }

  var randomColor = nextSequenceColor();
  gameSequence.push(randomColor);
  playColor(randomColor);

  userSequence.length = 0;
}

function playerStep(color) {
  playColor(color);

  if (!gameStarted) {
    return;
  }

  userSequence.push(color);

  if (!checkAnswer()) {
    gameOver();
    return;
  }

  if (userSequence.length !== gameSequence.length) {
    return;
  }
  
  gameStep();
}

function gameOver() {
  setGameTitle("Game Over! Your score is: " + gameLevel);
  animate($("body"), "game-over", 200);
  playSound("wrong");
  resetGame();
}

function resetGame() {
  gameStarted = false;
  playerTurn = false;
  gameLevel = 0;
  gameSequence = [];
  userSequence = [];
}


function checkAnswer() {
  if (userSequence.length > gameSequence.length) {
    return false;
  }
  
  var currentIndex = userSequence.length - 1;
  return gameSequence[currentIndex] === userSequence[currentIndex];
}

function nextSequenceColor() {
  return colorNames[Math.floor(Math.random() * 4)];
}

function playColor(color) {
  animateColor(color);
  playSound(color);
}

function sleep(milis) {
  return new Promise(resolve => setTimeout(resolve, milis));
}


/* Animation */

function flash(name) {
  $("#" + name).fadeOut(100).fadeIn(100);
}

function animateColor(name) {
  animate($("#" + name), "pressed", 100);
}

async function animate(target, cssClass, timeout) {

  target.addClass(cssClass);

  await timeoutAsync(timeout, () => {
    target.removeClass(cssClass);
  });
}

function timeoutAsync(timeout, callback) {
  return new Promise(r => setTimeout(callback, timeout));
}

function setGameTitle(text) {
  $("#level-title").text(text);
}


/* Sounds */

function playSound(name) {
  new Audio("sounds/" + name + ".mp3").play();
}
