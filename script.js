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
