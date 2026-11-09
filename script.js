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

// Load numerical data from a selected text or CSV file.
let fileToLoad = document.getElementById('fileToLoad');
let loadFileButton = document.getElementById('loadFile');
let fileInput = document.getElementById('fileInput');
let fileMessage = document.getElementById('Message');
let statsOutput = document.getElementById('statsOutput');
let statButtons = document.querySelectorAll('.stat');

loadFileButton.addEventListener('click', function () {
  let selectedFile = fileToLoad.files[0];

  if (!selectedFile) {
    fileMessage.textContent = 'Please choose a .txt or .csv file first.';
    fileInput.value = '';
    statsOutput.textContent = '';
    return;
  }

  let reader = new FileReader();

  reader.addEventListener('load', function () {
    fileInput.value = reader.result;

    let numbers = getFileNumbers();
    if (numbers.length === 0) {
      fileMessage.textContent = 'File loaded, but no numerical data was found.';
      statsOutput.textContent = '';
      return;
    }

    fileMessage.textContent = selectedFile.name + ' loaded (' + numbers.length + ' values).';
    statsOutput.textContent = 'Choose a statistic above.';
  });

  reader.addEventListener('error', function () {
    fileMessage.textContent = 'The selected file could not be read.';
    fileInput.value = '';
    statsOutput.textContent = '';
  });

  reader.readAsText(selectedFile);
});

// Turn comma-, space-, or line-separated file data into an array of numbers.
function getFileNumbers() {
  return fileInput.value
    .split(/[\s,;]+/)
    .filter(function (value) {
      return value !== '' && Number.isFinite(Number(value));
    })
    .map(Number);
}

function findMode(numbers) {
  let counts = {};
  let highestCount = 0;

  for (let i = 0; i < numbers.length; i++) {
    let value = numbers[i];
    counts[value] = (counts[value] || 0) + 1;
    highestCount = Math.max(highestCount, counts[value]);
  }

  if (highestCount === 1) {
    return 'No mode';
  }

  return Object.keys(counts)
    .filter(function (value) {
      return counts[value] === highestCount;
    })
    .map(Number)
    .sort(function (a, b) {
      return a - b;
    })
    .join(', ');
}

function calculateStatistic(statistic, numbers) {
  let sortedNumbers = numbers.slice().sort(function (a, b) {
    return a - b;
  });

  if (statistic === 'mean') {
    let total = numbers.reduce(function (sum, value) {
      return sum + value;
    }, 0);
    return total / numbers.length;
  }

  if (statistic === 'median') {
    let middle = Math.floor(sortedNumbers.length / 2);
    return sortedNumbers.length % 2 === 0
      ? (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2
      : sortedNumbers[middle];
  }

  if (statistic === 'mode') {
    return findMode(numbers);
  }

  if (statistic === 'min') {
    return sortedNumbers[0];
  }

  return sortedNumbers[sortedNumbers.length - 1];
}

for (let i = 0; i < statButtons.length; i++) {
  statButtons[i].addEventListener('click', function () {
    let numbers = getFileNumbers();

    if (numbers.length === 0) {
      statsOutput.textContent = 'Load a file containing numerical data first.';
      return;
    }

    let statistic = statButtons[i].dataset.stat;
    let answer = calculateStatistic(statistic, numbers);
    let label = statistic.charAt(0).toUpperCase() + statistic.slice(1);
    statsOutput.textContent = label + ': ' + answer;
  });
}
