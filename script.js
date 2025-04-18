// Get DOM elements
const startRange = document.getElementById('startRange');
const endRange = document.getElementById('endRange');
const triangleSize = document.getElementById('triangleSize');
const targetSum = document.getElementById('targetSum');
const solveButton = document.getElementById('solveButton');
const resetButton = document.getElementById('resetButton');
const startValue = document.getElementById('startValue');
const endValue = document.getElementById('endValue');
const triangleSizeValue = document.getElementById('triangleSizeValue');
const targetSumValue = document.getElementById('targetSumValue');
const resultOutput = document.getElementById('resultOutput');
const canvas = document.getElementById('triangleCanvas');
const ctx = canvas.getContext('2d');

// Update the displayed values of the sliders
startRange.addEventListener('input', () => {
  startValue.textContent = startRange.value;
});

endRange.addEventListener('input', () => {
  endValue.textContent = endRange.value;
});

triangleSize.addEventListener('input', () => {
  triangleSizeValue.textContent = triangleSize.value;
});

targetSum.addEventListener('input', () => {
  targetSumValue.textContent = targetSum.value;
});

// Handle Solve button click
solveButton.addEventListener('click', () => {
  const start = parseInt(startRange.value);
  const end = parseInt(endRange.value);
  const size = parseInt(triangleSize.value);
  const target = parseInt(targetSum.value);

  const triangleData = solveTriangle(start, end, size, target);
  drawTriangle(triangleData);
  displayResults(triangleData);
});

// Handle Reset button click
resetButton.addEventListener('click', () => {
  startRange.value = 1;
  endRange.value = 10;
  triangleSize.value = 3;
  targetSum.value = 15;

  startValue.textContent = 1;
  endValue.textContent = 10;
  triangleSizeValue.textContent = 3;
  targetSumValue.textContent = 15;

  resultOutput.textContent = "Ei vielä tuloksia.";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Solve triangle puzzle (a simplified version for the app)
function solveTriangle(start, end, size, target) {
  let triangle = [];
  let possibleValues = [];

  for (let i = start; i <= end; i++) {
    possibleValues.push(i);
  }

  // Generating combinations of 3 numbers for the sides of the triangle
  while (triangle.length < 3) {
    let randomNumbers = [];
    for (let i = 0; i < size; i++) {
      randomNumbers.push(possibleValues[Math.floor(Math.random() * possibleValues.length)]);
    }

    let sum = randomNumbers.reduce((a, b) => a + b, 0);
    if (sum === target) {
      triangle.push(randomNumbers);
    }
  }

  return triangle;
}

// Draw triangle on canvas
function drawTriangle(triangleData) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const offsetX = 150;
  const offsetY = 150;
  const sideLength = 120;

  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);
  ctx.lineTo(offsetX + sideLength, offsetY);
  ctx.lineTo(offsetX + sideLength / 2, offsetY - sideLength);
  ctx.closePath();

  ctx.strokeStyle = '#00ffcc';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw the numbers on the triangle
  ctx.fillStyle = '#ff007f';
  triangleData.forEach((side, index) => {
    side.forEach((number, i) => {
      ctx.fillText(number, offsetX + i * 40, offsetY - index * 40);
    });
  });
}

// Display the results in the output section
function displayResults(triangleData) {
  resultOutput.textContent = triangleData
    .map(side => side.join(' - '))
    .join('\n');
}
