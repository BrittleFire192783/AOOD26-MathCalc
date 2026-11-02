let result = document.getElementById('result');
let numberButtons = document.querySelectorAll('.number');
let operatorButtons = document.querySelectorAll('.operator');
let mathButtons = document.querySelectorAll('.math');
let clearButton = document.querySelector('.clear');

// Show a number in the display when a number button is clicked.
for (let i = 0; i < numberButtons.length; i++) {
  numberButtons[i].addEventListener('click', function () {
    result.value = result.value + numberButtons[i].textContent;
  });
}

// Show an operator in the display when an operator button is clicked.
for (let i = 0; i < operatorButtons.length; i++) {
  operatorButtons[i].addEventListener('click', function () {
    result.value = result.value + operatorButtons[i].textContent;
  });
}

// Add a math symbol or function name to the display.
for (let i = 0; i < mathButtons.length; i++) {
  mathButtons[i].addEventListener('click', function () {
    result.value = result.value + mathButtons[i].textContent;
  });
}

// Empty the display when the clear button is clicked.
clearButton.addEventListener('click', function () {
  result.value = '';
});

function calculate() {
  let calculation = result.value;

  // Convert calculator symbols and typed shortcuts into JavaScript math.
  calculation = calculation.replaceAll('×', '*');
  calculation = calculation.replaceAll('÷', '/');
  calculation = calculation.replaceAll('−', '-');
  calculation = calculation.replace(/\bpi\b/gi, 'Math.PI');
  calculation = calculation.replaceAll('π', 'Math.PI');
  calculation = calculation.replace(/\bround\s*\(/gi, 'Math.round(');
  calculation = calculation.replaceAll('^', '**');

  // Support calculator-style implicit multiplication, such as 2π and 2(3 + 4).
  calculation = calculation.replace(/(\d|\))(?=Math\.|\()/g, '$1*');
  calculation = calculation.replace(/(Math\.PI|\))(?=\d)/g, '$1*');

  // Allow only numbers, math operators, parentheses, commas, and these Math values.
  let safeCalculation = calculation;
  safeCalculation = safeCalculation.replaceAll('Math.PI', '');
  safeCalculation = safeCalculation.replaceAll('Math.round', '');

  if (calculation === '' || !/^[0-9+\-*/().,\s]*$/.test(safeCalculation)) {
    result.value = 'Error';
    return;
  }

  try {
    result.value = eval(calculation);
  } catch (error) {
    result.value = 'Error';
  }
}

// Calculate the expression when the equals button is clicked.
let equalsButton = document.querySelector('.equals');
equalsButton.addEventListener('click', function () {
  calculate();
});

// Let someone calculate typed input by pressing Enter.
result.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    calculate();
  }
});
