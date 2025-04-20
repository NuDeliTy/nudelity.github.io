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

const winSound = document.getElementById('correctSound');
const failSound = document.getElementById('incorrectSound');
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
  solveTriangle(n, start, end, target);
  window.scrollTo(0, document.body.scrollHeight);  // Scroll to the triangle box
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
    resultDiv.innerText = `🎉 Solution found!\n\nx = [${solution[0].join(', ')}]\ny = [${solution[1].join(', ')}]\nz = [${solution[2].join(', ')}]`;
    animateWizard(solution);
    winSound.play();
  } else {
    resultDiv.innerText = '❌ No solution found. Possible target sums:';
    drawTriangle();
    const possibleTargets = calculateValidTargets(combinations, n);
    possibleTargets.forEach(t => resultDiv.innerText += `\n• ${t}`);
    failSound.play();
    wizard.classList.remove('active');
  }
}

function animateWizard(sides) {
  const showWizard = awesomenessToggle.checked;
  if (!showWizard) {
    drawTriangle(sides);
    return;
  }

  wizard.classList.add('active');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const [x, y, z] = sides;
  const points = [
    { x: canvas.width / 2, y: 50 },
    { x: 100, y: canvas.height - 100 },
    { x: canvas.width - 100, y: canvas.height - 100 }
  ];

  let step = 0;
  function drawStep() {
    if (step === 0) drawLaser(points[0], points[1]);
    if (step === 1) drawLaser(points[1], points[2]);
    if (step === 2) drawLaser(points[2], points[0]);
    if (step === 3) drawTriangle(sides);
    if (step === 3) wizard.classList.remove('active');
    if (step < 3) step++;
    else wizard.classList.remove('active');
    if (step <= 3) setTimeout(drawStep, 500);
  }
  drawStep();
}

function drawLaser(fromX, fromY, toX, toY) {
  const laser = document.createElement('div');
  laser.classList.add('laser');
  document.body.appendChild(laser);

  // Position laser at the wizard's position
  laser.style.left = `${fromX}px`;
  laser.style.top = `${fromY}px`;

  // Calculate the laser's trajectory to the target point
  laser.style.width = `${Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2))}px`;
  laser.style.transform = `rotate(${Math.atan2(toY - fromY, toX - fromX)}rad)`;
}

function getCombinations(arr, n) {
  const result = [];
  function helper(start, combo) {
    if (combo.length === n) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  }
  helper(0, []);
  return result;
}

function calculateValidTargets(combinations, n) {
  const targets = [];
  combinations.forEach(c => {
    let sum = c.reduce((acc, val) => acc + val, 0);
    if (!targets.includes(sum)) targets.push(sum);
  });
  return targets.sort((a, b) => a - b);
}

function drawTriangle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(400, 100);
  ctx.lineTo(250, 400);
  ctx.closePath();
  ctx.strokeStyle = '#0ff';
  ctx.stroke();
}
