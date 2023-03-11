const imageDicePath = "images/dice/{number}.png";

var dices = document.querySelectorAll(".dice img");
var result = document.getElementById("result");

if (dices.length > 0) {
  var numbers = [];
  
  dices.forEach(dice => {
    var number = randomDice();
    numbers.push(number);
    dice.src = imageDicePath.replace("{number}", number);
  });

  var winner = 0;
  var draw = false;

  for (var i = 1; i < dices.length; i++) {
    if (numbers[i] == numbers[winner]) {
      draw = true;
    }
    if (numbers[i] > numbers[winner]) {
      winner = i;
      draw = false;
    }
  }

  result.innerText = draw ? "Draw!" : "Winner is Player " + (winner + 1);
}


function randomDice() {
  return randomInt(1, 6);
}

function randomInt(lower, higher) {
  return Math.floor(Math.random() * (higher - lower + 1)) + lower;
}
