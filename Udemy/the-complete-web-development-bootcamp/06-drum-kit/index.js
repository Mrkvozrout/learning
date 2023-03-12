var drumSoundMap = new Map([
  ['w', "tom1"],
  ['a', "tom2"],
  ['s', "tom3"],
  ['d', "tom4"],
  ['j', "crash"],
  ['k', "snare"],
  ['l', "kick"],
]);

var pressed = false;


document.querySelectorAll(".drum").forEach((button) => button.addEventListener("click", (event) => {
  drumHit(event.currentTarget.innerText);
  pressed = false;
}));
document.addEventListener("keydown", (event) => {
  drumHit(event.key);
});
document.addEventListener("keyup", (event) => {
  pressed = false;
});


function drumHit(key) {
  if (pressed === true) {
    return;
  }

  createDrumSound(key).play();
  highlightDrum(key);
  pressed = true;
}

function createDrumSound(key) {
  var soundName = drumSoundMap.get(key);

  if (soundName == null) {
    soundName = drumSoundMap.values[0];
  }

  return new Audio("sounds/" + soundName + ".mp3");
}

async function highlightDrum(input) {
  var key = input.toLowerCase();
  
  if (!drumSoundMap.has(key)) {
    return;
  }

  var drum = document.querySelector('.' + key);

  if (drum == null) {
    return;
  }

  drum.classList.add("pressed");

  await timeoutAsync(100, () => {
    drum.classList.remove("pressed");
  });
}

function timeoutAsync(timeout, callback) {
  return new Promise(r => setTimeout(callback, timeout));
}
