const progress = document.getElementById('progress')
const btnPrev = document.getElementById('prev')
const btnNext = document.getElementById('next')
const circles = document.querySelectorAll('.circle')

const maxActive = circles.length - 1

let currentActive = 0


btnNext.addEventListener('click', () => {
  if (currentActive < maxActive) {
    currentActive++
    updateProgress()
  }
})

btnPrev.addEventListener('click', () => {
  if (currentActive > 0) {
    currentActive--
    updateProgress()
  }
})

function updateProgress() {
  updateActiveCircle()
  updateButtons()
  updateProgressLine()
}

function updateActiveCircle() {
  circles.forEach((circle, idx) => {
    if (idx <= currentActive) {
      circle.classList.add('active')
    }
    else {
      circle.classList.remove('active')
    }
  });
}

function updateButtons() {
  btnPrev.disabled = (currentActive == 0)
  btnNext.disabled = (currentActive == maxActive)
}

function updateProgressLine() {
  progress.style.width = (currentActive / maxActive) * 100 + '%'
}