// script.js
const canvas = document.getElementById('triangleCanvas');
const ctx = canvas.getContext('2d');
const resultDiv = document.getElementById('result');
const sideSlider = document.getElementById('sideCount');
const rangeStartSlider = document.getElementById('rangeStart');
const rangeEndSlider = document.getElementById('rangeEnd');
const targetSumSlider = document.getElementById('targetSum');
const awesomeCheckbox = document.getElementById('awesomeCheckbox');

const sideVal = document.getElementById('sideCountVal');
const rangeStartVal = document.getElementById('rangeStartVal');
const rangeEndVal = document.getElementById('rangeEndVal');
const targetSumVal = document.getElementById('targetSumVal');

const winSound = document.getElementById('winSound');
const failSound = document.getElementById('failSound');
const wizard = document.getElementById('wizard');

sideSlider.oninput = () => sideVal.textContent = sideSlider.value;
rangeStartSlider.oninput = () => rangeStartVal.textContent = rangeStartSlider.value;
rangeEndSlider.oninput = () => rangeEndVal.textContent = rangeEndSlider.value;
targetSumSlider.oninput = () => targetSumVal.textContent = targetSumSlider.value;

document.getElementById('solveButton').addEventListener('click', () => {
  const n = parseInt(sideSlider.value);
  const start = parseInt(rangeStartSlider.value);
  const end = parseInt(rangeEndSlider.value);
  const target = parseInt(targetSumSlider.value);
  solveTriangle(n, start, end, target);
});

function solveTriangle(n, start, end, target) {
  const nums = [];
  for (let i = start; i <= end; i++) nums.push(i);

  const combinations = getCombinations(nums, n);
  let found = false;
  let solution = null;

  for (let a of combinations) {
    for (let b of combinations) {
      for (let c of combinations) {
        if (a[n - 1] !== b[0]) continue;
        if (b[n - 1] !== c[0]) continue;
        if (c[n - 1] !== a[0]) continue;

        const shared = [a[n - 1], b[n - 1], c[n - 1]];
        const allNumbers = [...a, ...b.slice(1), ...c.slice(1)];
        const numCounts = {};

        allNumbers.forEach(num => {
          numCounts[num] = (numCounts[num] || 0) + 1;
        });

        let valid = true;
        for (let num in numCounts) {
          if (shared.includes(Number(num))) {
            if (numCounts[num] > 2) {
              valid = false;
              break;
            }
          } else {
            if (numCounts[num] > 1) {
              valid = false;
              break;
            }
          }
        }

        const sumA = a.reduce((x, y) => x + y, 0);
        const sumB = b.reduce((x, y) => x + y, 0);
        const sumC = c.reduce((x, y) => x + y, 0);

        if (valid && sumA === target && sumB === target && sumC === target) {
          found = true;
          solution = [a, b, c];
          break;
        }
      }
      if (found) break;
    }
    if (found) break;
  }

  if (found) {
    resultDiv.innerText = `🎉 Ratkaisu löytyi!\n\nx = [${solution[0].join(', ')}]\ny = [${solution[1].join(', ')}]\nz = [${solution[2].join(', ')}]`;
    drawTriangle(solution);
    winSound.play();
    if (awesomeCheckbox.checked) animateWizard(solution);
  } else {
    resultDiv.innerText = '❌ Ratkaisua ei löytynyt.\nMahdollisia tavoitesummia:';
    drawTriangle();
    const possibleTargets = calculatePossibleTargets(combinations, n);
    possibleTargets.forEach(t => resultDiv.innerText += `\n• ${t}`);
    failSound.play();
  }
}

function drawTriangle(sides) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!sides) return;

  const [x, y, z] = sides;
  const points = [
    { x: canvas.width / 2, y: 50 },
    { x: 100, y: canvas.height - 100 },
    { x: canvas.width - 100, y: canvas.height - 100 }
  ];

  ctx.strokeStyle = '#0ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.closePath();
  ctx.stroke();

  const drawSide = (start, end, nums) => {
    for (let i = 0; i < nums.length; i++) {
      const t = i / (nums.length - 1);
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText(nums[i], x - 8, y - 8);
    }
  };

  drawSide(points[0], points[1], x);
  drawSide(points[1], points[2], y);
  drawSide(points[2], points[0], z);
}

function getCombinations(arr, len) {
  if (len === 1) return arr.map(v => [v]);
  const combos = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const innerCombos = getCombinations(rest, len - 1);
    innerCombos.forEach(combo => combos.push([arr[i], ...combo]));
  }
  return combos;
}

function calculatePossibleTargets(combos, sideLength) {
  const targets = new Set();
  combos.forEach(combo => {
    const sum = combo.reduce((a, b) => a + b, 0);
    if (combo.length === sideLength) targets.add(sum);
  });
  return Array.from(targets).sort((a, b) => a - b);
}

function animateWizard(solution) {
  wizard.style.display = 'block';
  wizard.style.left = '50%';
  wizard.style.top = '10px';

  const trianglePoints = [
    { x: canvas.width / 2, y: 50 },
    { x: 100, y: canvas.height - 100 },
    { x: canvas.width - 100, y: canvas.height - 100 }
  ];

  trianglePoints.forEach((point, i) => {
    setTimeout(() => shootLaser(point.x, point.y), i * 300);
  });

  setTimeout(() => {
    wizard.style.display = 'none';
  }, 3000);
}

function shootLaser(x, y) {
  const beam = document.createElement('div');
  beam.className = 'laser-beam';
  beam.style.left = `${x}px`;
  beam.style.top = `${y}px`;
  document.body.appendChild(beam);
  setTimeout(() => beam.remove(), 800);
}
