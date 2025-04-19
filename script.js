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

document.getElementById("solveButton").addEventListener("click", solvePuzzle);

function solvePuzzle() {
  const sideCount = parseInt(sideSlider.value);
  const rangeStart = parseInt(rangeStartSlider.value);
  const rangeEnd = parseInt(rangeEndSlider.value);
  const targetSum = parseInt(targetSumSlider.value);

  const numbers = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    numbers.push(i);
  }

  let found = false;
  const possibleSums = new Set();

  function getSides(arr) {
    const total = sideCount * 3 - 3;
    const a = arr.slice(0, sideCount);
    const b = arr.slice(sideCount - 1, sideCount * 2 - 1);
    const c = arr.slice(sideCount * 2 - 2, total);

    const A = [...a];
    const B = [b[0], ...b.slice(1)];
    const C = [c[0], ...c.slice(1)];

    return [A, B, C];
  }

  function checkEqualSum(sides) {
    const sums = sides.map(side => side.reduce((a, b) => a + b, 0));
    return sums.every(sum => sum === sums[0]) ? sums[0] : null;
  }

  function permute(arr, len, current = []) {
    if (current.length === len) {
      const [x, y, z] = getSides(current);
      const sum = checkEqualSum([x, y, z]);
      if (sum !== null) {
        possibleSums.add(sum);
        if (sum === targetSum && !found) {
          drawTriangle(x, y, z);
          resultDiv.innerHTML = `<p>🎉 Ratkaisu löytyi!</p><p>x = [${x.join(', ')}]</p><p>y = [${y.join(', ')}]</p><p>z = [${z.join(', ')}]</p>`;
          successSound.currentTime = 0;
          successSound.play();
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

  const neededLength = sideCount * 3 - 3;
  permute(numbers, neededLength);

  if (!found) {
    resultDiv.innerHTML = `<p style="color:#f55;">Ratkaisua ei löytynyt!</p>`;
    failSound.currentTime = 0;
    failSound.play();
    const suggestions = [...possibleSums].filter(s => s !== targetSum).slice(0, 5);
    if (suggestions.length > 0) {
      resultDiv.innerHTML += `<p>Mahdollisia summia joita voit kokeilla:</p><ul>${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>`;
    }
    clearTriangle();
  }
}

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
