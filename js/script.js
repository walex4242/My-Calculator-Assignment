const calculator = document.querySelector("#CalculatorBody")
const keys = calculator.querySelector("#CalculatorKeys");
const display = calculator.querySelector("#CalculatorDisplay")
const history = calculator.querySelector("#CalculatorHistory")
const operatorKeys = keys.querySelectorAll('[data-type="operator"]')
const clearKey = calculator.querySelector('[data-type="clear"]')
const equalKey = calculator.querySelector('[data-type="equal"]')
const deleteKey = calculator.querySelector('[data-type="delete"]')
const decimalKey = calculator.querySelector('.decimal')

keys.addEventListener("click", (event) => {
  if (!event.target.closest("button")) return
  const key = event.target
  const keyValue = key.textContent
  const displayValue = display.textContent
  const { type } = key.dataset
  const { previousKeyType, previousKey } = calculator.dataset
  let changed = false

  history.innerHTML = history.innerHTML + key.textContent

  if (key.classList.contains('decimal')){
      key.classList.add("disabled")
  }

  if (displayValue){
    if (calculator.dataset.operator !== undefined) {
      equalKey.classList.remove("disabled")
    }
  }

  if (type === 'operator' && previousKeyType === 'operator') {
    if (key.dataset.key === previousKey) {
      return
    }

    changed = true
  }

  if (type === "number") {
    if (previousKey === "equal") {
      display.textContent = "";
      
      delete calculator.dataset.operator;
      delete calculator.dataset.secondNumber;
      display.textContent = keyValue;
    } else {
      if (displayValue === "0" || previousKeyType === "operator") {
        display.textContent = keyValue;
      } else {
        display.textContent = displayValue + keyValue;
      }

      operatorKeys.forEach((key) => {
        key.dataset.state = "";
      });
    }
  }
  if (type === "operator") {
    if (previousKey === "equal") {
      calculator.dataset.firstNumber = displayValue;
      delete calculator.dataset.secondNumber;
      delete calculator.dataset.lastOperator;
      delete calculator.dataset.operator;
    }

    decimalKey.classList.remove("disabled")

    const currentActiveOperator = calculator.querySelector('[data-state="selected"]')
    if (currentActiveOperator) {
      currentActiveOperator.dataset.state = ""
    }

    key.dataset.state = "selected";

    if (changed) {
      calculator.dataset.operator = key.dataset.key
    } 
    else {
      if (calculator.dataset.operator !== undefined) {
        calculator.dataset.lastOperator = calculator.dataset.operator
      }
      if (calculator.dataset.lastOperator !== undefined) {
        const result = operate(calculator.dataset.firstNumber, calculator.dataset.lastOperator, displayValue)
        display.textContent = result
        calculator.dataset.firstNumber = result
      }
      else {
        calculator.dataset.firstNumber = displayValue
      }
      calculator.dataset.operator = key.dataset.key
    }
  } else if (previousKeyType === "operator") {
    key.dataset.state = ""
  }

  if (type === "equal") {
    if (
      calculator.dataset.firstNumber === undefined &&
      calculator.dataset.secondNumber === undefined &&
      calculator.dataset.operator === undefined
    ) {
      return
    }
     if (previousKey === "equal") {
        const firstNumber = displayValue;
        const operator = calculator.dataset.operator
        const secondNumber = calculator.dataset.secondNumber
        display.textContent = operate(firstNumber, operator, secondNumber)
    } else {
      const firstNumber = calculator.dataset.firstNumber
      const operator = calculator.dataset.operator
      const secondNumber = displayValue
      calculator.dataset.secondNumber = secondNumber
      display.textContent = operate(firstNumber, operator, secondNumber)
    }
  }

  if (type === "clear") {
    display.textContent = "0"
    history.innerHTML = ""

    equalKey.classList.add("disabled")

    delete calculator.dataset.firstNumber
    delete calculator.dataset.operator
    delete calculator.dataset.secondNumber
    delete calculator.dataset.lastOperator
    delete calculator.dataset.lastResult

    clearCalculator()
  }

  if (type === "delete") {
    display.textContent = display.textContent.toString().slice(0, -1)
    calculator.dataset.secondNumber = display.textContent
    if (display.textContent.length === 0) {
      display.textContent = "0"
    }
  }

  calculator.dataset.previousKeyType = type
  calculator.dataset.previousKey = key.dataset.key
});

document.onkeydown = function(event) {
  let keyPress = event.key
  if ('1234567890/*-+.'.includes(keyPress)){
    if (keyPress === '1') { 
    keys.querySelector('[data-key="1"]').click()
    }
    if (keyPress === '2') { 
    keys.querySelector('[data-key="2"]').click()
    }
    if (keyPress === '3') { 
    keys.querySelector('[data-key="3"]').click()
    }
    if (keyPress === '4') { 
    keys.querySelector('[data-key="4"]').click()
    }
    if (keyPress === '5') { 
    keys.querySelector('[data-key="5"]').click()
    }
    if (keyPress === '6') { 
    keys.querySelector('[data-key="6"]').click()
    }
    if (keyPress === '7') { 
    keys.querySelector('[data-key="7"]').click()
    }
    if (keyPress === '8') { 
    keys.querySelector('[data-key="8"]').click()
    }
    if (keyPress === '9') { 
    keys.querySelector('[data-key="9"]').click()
    }
    if (keyPress === '0') { 
      keys.querySelector('[data-key="0"]').click()
    }
    if (keyPress === '+') { 
      keys.querySelector('[data-key="plus"]').click()
    }
    if (keyPress === '-') { 
      keys.querySelector('[data-key="minus"]').click()
    }
    if (keyPress === '*') { 
      keys.querySelector('[data-key="times"]').click()
    }
    if (keyPress === '/') { 
      keys.querySelector('[data-key="divide"]').click()
    }
    if (keyPress === '.') { 
      keys.querySelector('.decimal').click()
    }
  }
  if (keyPress === 'Enter'){
    if (equalKey.classList.contains('disabled')) { 
      return 
    }
    else { 
      equalKey.click()
    }
  }
  if (keyPress === 'Backspace'){
    deleteKey.click()
  }

  if (keyPress === 'Escape'){
    clearCalculator()
  }
}

function operate(firstNumber, operator, secondNumber) {
  firstNumber = parseFloat(firstNumber)
  secondNumber = parseFloat(secondNumber)
  if (operator === "plus") return firstNumber + secondNumber
  if (operator === "minus") return firstNumber - secondNumber
  if (operator === "times") return firstNumber * secondNumber
  if (operator === "divide") return firstNumber / secondNumber
}

function clearCalculator() {
  clearKey.click()
  operatorKeys.forEach((key) => {
    key.dataset.state = ""
  });
}