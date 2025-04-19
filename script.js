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

  let found = false;
  let solution = null;
  const combinations = getCombinations(nums, n);

  for (let a of combinations) {
    for (let b of combinations) {
      for (let c of combinations) {
        const sharedAB = a[a.length - 1];
        const sharedBC = b[b.length - 1];
        const sharedCA = c[c.length - 1];

        if (sharedAB === b[0] && sharedBC === c[0] && sharedCA === a[0]) {
          const sumA = a.reduce((x, y) => x + y, 0);
          const sumB = b.reduce((x, y) => x + y, 0);
          const sumC = c.reduce((x, y) => x + y, 0);

          if (sumA === target && sumB === target && sumC === target) {
            found = true;
            solution = [a, b, c];
            break;
          }
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
  } else {
    resultDiv.innerText = '❌ Ratkaisua ei löytynyt.\nMahdollisia tavoitesummia:';
    drawTriangle();
    const possibleTargets = calculatePossibleTargets(combinations);
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
      ctx.fillStyle = '#0ff';
      ctx.font = '16px Arial';
      ctx.fillText(nums[i], x - 10, y);
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

function calculatePossibleTargets(combos) {
  const targets = new Set();
  combos.forEach(combo => {
    const sum = combo.reduce((a, b) => a + b, 0);
    targets.add(sum);
  });
  return Array.from(targets).sort((a, b) => a - b);
}
const sideSlider = document.getElementById("sideCount");
const rangeStartSlider = document.getElementById("rangeStart");
const rangeEndSlider = document.getElementById("rangeEnd");
const targetSumSlider = document.getElementById("targetSum");

const sideVal = document.getElementById("sideCountVal");
const startVal = document.getElementById("rangeStartVal");
const endVal = document.getElementById("rangeEndVal");
const targetVal = document.getElementById("targetSumVal");

const canvas = document.getElementById("triangleCanvas");
const ctx = canvas.getContext("2d");
const resultDiv = document.getElementById("result");

const successSound = document.getElementById("successSound");
const failSound = document.getElementById("failSound");

function updateSliderLabels() {
  sideVal.textContent = sideSlider.value;
  startVal.textContent = rangeStartSlider.value;
  endVal.textContent = rangeEndSlider.value;
  targetVal.textContent = targetSumSlider.value;
}

[sideSlider, rangeStartSlider, rangeEndSlider, targetSumSlider].forEach(slider => {
  slider.addEventListener("input", updateSliderLabels);
});
updateSliderLabels();

document.getElementById("solveButton").addEventListener("click", () => {
  const sideCount = parseInt(sideSlider.value);
  const rangeStart = parseInt(rangeStartSlider.value);
  const rangeEnd = parseInt(rangeEndSlider.value);
  const targetSum = parseInt(targetSumSlider.value);

  const numbers = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    numbers.push(i);
  }

  const needed = sideCount * 3 - 3;
  let found = false;
  const possibleSums = new Set();

  function getSides(arr) {
    const a = arr[0];
    const b = arr.slice(1, sideCount - 1 + 1);
    const c = arr.slice(sideCount, sideCount * 2 - 2 + 1);
    const d = arr.slice(sideCount * 2 - 1);
    const x = [a, ...b];
    const y = [x[x.length - 1], ...c];
    const z = [y[y.length - 1], ...d, a];
    return [x, y, z];
  }

  function permute(arr, len, current = []) {
    if (current.length === len) {
      const [x, y, z] = getSides(current);
      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumZ = z.reduce((a, b) => a + b, 0);

      if (sumX === sumY && sumY === sumZ) {
        possibleSums.add(sumX);
        if (sumX === targetSum && !found) {
          drawTriangle(x, y, z);
          resultDiv.innerHTML = `<p>🎉 Ratkaisu löytyi!</p><p>x = [${x.join(', ')}]</p><p>y = [${y.join(', ')}]</p><p>z = [${z.join(', ')}]</p>`;
          found = true;
        }
      }
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      if (!current.includes(arr[i])) {
        permute(arr, len, [...current, arr[i]]);
      }
    }
  }

  permute(numbers, needed);

  if (!found) {
    resultDiv.innerHTML = `<p style="color: #f55;">Ratkaisua ei löytynyt!</p>`;
    const suggestions = [...possibleSums].filter(s => s !== targetSum).slice(0, 3);
    if (suggestions.length > 0) {
      resultDiv.innerHTML += `<p>Mahdollisia summia joita voit kokeilla:</p><ul style="margin-top: 5px; margin-left: 10px;">${suggestions.map(s => `<li style="margin: 2px 0;">• ${s}</li>`).join('')}</ul>`;
    }
    clearTriangle();
  }
});


function drawTriangle(x, y, z) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const size = 180;

  const A = { x: cx, y: cy - size };
  const B = { x: cx - size, y: cy + size * 0.75 };
  const C = { x: cx + size, y: cy + size * 0.75 };

  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.closePath();
  ctx.strokeStyle = "#0ff";
  ctx.lineWidth = 4;
  ctx.stroke();

  drawSide(A, B, x);
  drawSide(B, C, y);
  drawSide(C, A, z);
}

function drawSide(p1, p2, nums) {
  const dx = (p2.x - p1.x) / (nums.length - 1);
  const dy = (p2.y - p1.y) / (nums.length - 1);

  for (let i = 0; i < nums.length; i++) {
    const x = p1.x + dx * i;
    const y = p1.y + dy * i;
    const offset = i === 0 || i === nums.length - 1 ? -20 : -10;
    ctx.fillStyle = "#0f0";
    ctx.font = "bold 18px monospace";
    ctx.fillText(nums[i], x + offset, y + offset);
  }
}

function clearTriangle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
