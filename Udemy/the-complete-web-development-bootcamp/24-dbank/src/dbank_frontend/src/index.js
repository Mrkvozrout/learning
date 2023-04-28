import { dbank_backend } from '../../declarations/dbank_backend'

let button = document.getElementById('submit-btn')

window.addEventListener('load', reloadBalance)
button.addEventListener('click', handleSubmit)


async function reloadBalance() {
  let el = document.getElementById('value')
  if (el) {
    el.textContent = roundMoney(await dbank_backend.checkBalance())
  }
  else {
    console.log('Cannot find target element "value"')
  }
}

async function handleSubmit(event) {
  buttonEnable(button, false)

  let elInput = document.getElementById('input-amount')
  let elWithdraw = document.getElementById('withdraw-amount')

  let inputAmount = getAmountFromElement(elInput)
  let withdrawAmount = getAmountFromElement(elWithdraw)

  let promises = []

  if (inputAmount) {
    promises.push(dbank_backend.topUp(inputAmount))
  }

  if(withdrawAmount) {
    promises.push(dbank_backend.withdraw(withdrawAmount))
  }

  await Promise.all(promises)
  await reloadBalance()

  elInput.value = ''
  elWithdraw.value = ''
  buttonEnable(button, true)
}

function roundMoney(money) {
  return Math.floor(money * 100) / 100
}

function buttonEnable(button, enable) {
  if (enable) {
    button.removeAttribute('disabled')
  }
  else {
    button.setAttribute('disabled', true)
  }
}

function getAmountFromElement(element) {
  if (!element) {
    return 0.0
  }

  return parseFloat(element.value)
}
