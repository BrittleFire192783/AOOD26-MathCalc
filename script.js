let result = document.getElementById('result');
let numberButtons = document.querySelectorAll('.number');
let operatorButtons = document.querySelectorAll('.operator');
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

// Empty the display when the clear button is clicked.
clearButton.addEventListener('click', function () {
  result.value = '';
});

// Calculate the expression when the equals button is clicked.
let equalsButton = document.querySelector('.equals');
equalsButton.addEventListener('click', function () {
  let calculation = result.value;

  // JavaScript uses *, /, and - instead of these calculator symbols.
  calculation = calculation.replaceAll('×', '*');
  calculation = calculation.replaceAll('÷', '/');
  calculation = calculation.replaceAll('−', '-');

  try {
    result.value = eval(calculation);
  } catch (error) {
    result.value = 'Error';
  }
});
