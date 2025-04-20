// script.js
const canvas = document.getElementById('triangleCanvas');
const ctx = canvas.getContext('2d');
const resultDiv = document.getElementById('result');
const sideSlider = document.getElementById('sideCount');
const rangeStartSlider = document.getElementById('rangeStart');
const rangeEndSlider = document.getElementById('rangeEnd');
const targetSumSlider = document.getElementById('targetSum');

const sideVal = document.getElementById('sideCountVal');
const rangeStartVal = document.getElementById('rangeStartVal');
const rangeEndVal = document.getElementById('rangeEndVal');
const targetSumVal = document.getElementById('targetSumVal');

const winSound = document.getElementById('winSound');
const failSound = document.getElementById('failSound');
const wizard = document.getElementById('wizard');
const awesomenessToggle = document.getElementById('awesomenessToggle');

sideSlider.oninput = () => sideVal.textContent = sideSlider.value;
rangeStartSlider.oninput = () => rangeStartVal.textContent = rangeStartSlider.value;
rangeEndSlider.oninput = () => rangeEndVal.textContent = rangeEndSlider.value;
targetSumSlider.oninput = () => targetSumVal.textContent = targetSumSlider.value;

document.getElementById('awesomenessToggle').addEventListener('change', (e) => {
  const wizard = document.getElementById('wizard');
  if (e.target.checked) {
    wizard.classList.add('active');
  } else {
    wizard.classList.remove('active');
  }
});

document.getElementById('solveButton').addEventListener('click', () => {
  const n = parseInt(sideSlider.value);
  const start = parseInt(rangeStartSlider.value);
  const end = parseInt(rangeEndSlider.value);
  const target = parseInt(targetSumSlider.value);
  
  // Scroll down to the canvas section
  const canvasSection = document.getElementById('canvasSection');
  canvasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
    }
  }

  if (found) {
    drawTriangle(solution);
    winSound.play();
  } else {
    resultDiv.textContent = "Ei ratkaisua löytynyt!";
    failSound.play();
  }
}

function drawTriangle(solution) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const size = 150;

  const points = [];
  for (let i = 0; i < 3; i++) {
    points.push({
      x: centerX + size * Math.cos((Math.PI * 2 * i) / 3),
      y: centerY + size * Math.sin((Math.PI * 2 * i) / 3)
    });
  }

  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < 3; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#0ff';
  ctx.stroke();

  solution.forEach((side, idx) => {
    drawLaser(points[idx], points[(idx + 1) % 3], side);
  });
}

function drawLaser(from, to, numbers) {
  const laser = document.createElement('div');
  laser.classList.add('laser');
  document.body.appendChild(laser);

  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));

  // Constrain laser within canvas
  const laserX = Math.max(0, Math.min(from.x, canvas.width - length));
  const laserY = Math.max(0, Math.min(from.y, canvas.height));

  laser.style.left = `${laserX}px`;
  laser.style.top = `${laserY}px`;
  laser.style.width = `${length}px`;
  laser.style.transform = `rotate(${angle}rad)`;
  laser.textContent = numbers.join(' ');

  setTimeout(() => laser.remove(), 500);
}

function getCombinations(arr, n) {
  let result = [];
  let f = function(prefix, arr) {
    if (prefix.length === n) {
      result.push(prefix);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      f(prefix.concat(arr[i]), arr.slice(i + 1));
    }
  }
  f([], arr);
  return result;
}
