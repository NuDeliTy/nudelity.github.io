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

const successSound = document.getElementById("soundSuccess");
const failSound = document.getElementById("soundFail");

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

  let found = false;
  const possibleSums = new Set();

  function permute(arr, len, current = []) {
    if (current.length === len) {
      const [x0, y0, z0, x1, y1, z1] = current;
      const x = [x0, x1, z0];
      const y = [y0, y1, x0];
      const z = [z0, z1, y0];
      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumZ = z.reduce((a, b) => a + b, 0);

      if (sumX === sumY && sumY === sumZ) {
        possibleSums.add(sumX);
        if (sumX === targetSum && !found) {
          drawTriangle(x, y, z);
          resultDiv.innerHTML = `<p>🎉 Ratkaisu löytyi!</p><p>x = [${x.join(', ')}]</p><p>y = [${y.join(', ')}]</p><p>z = [${z.join(', ')}]</p>`;
          found = true;
          successSound.play();
          triggerAnimation();
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

  permute(numbers, 6);

  if (!found) {
    resultDiv.innerHTML = `<p style="color: #f55;">🚫 Ratkaisua ei löytynyt!</p>`;
    const suggestions = [...possibleSums].filter(s => s !== targetSum).slice(0, 3);
    if (suggestions.length > 0) {
      resultDiv.innerHTML += `<p>Mahdollisia summia joita voit kokeilla:</p><ul style="margin-top: 5px; margin-left: 5px;">${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>`;
    }
    failSound.play();
    clearTriangle();
  }
});

function drawTriangle(x, y, z) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const size = 160;

  const A = { x: cx, y: cy - size };
  const B = { x: cx - size, y: cy + size * 0.75 };
  const C = { x: cx + size, y: cy + size * 0.75 };

  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.closePath();
  ctx.strokeStyle = "#0ff";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw corner numbers once
  drawCornerNumber(A.x, A.y, x[0]); // Top
  drawCornerNumber(B.x, B.y, x[2]); // Left
  drawCornerNumber(C.x, C.y, y[2]); // Right

  drawSideNumbers(A, B, x.slice(1, 2)); // Middle of side AB
  drawSideNumbers(B, C, y.slice(1, 2)); // Middle of side BC
  drawSideNumbers(C, A, z.slice(1, 2)); // Middle of side CA
}

function drawCornerNumber(x, y, num) {
  ctx.fillStyle = "#ff0";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText(num, x - 10, y - 10);
}

function drawSideNumbers(p1, p2, nums) {
  if (nums.length === 0) return;

  const dx = (p2.x - p1.x) / (nums.length + 1);
  const dy = (p2.y - p1.y) / (nums.length + 1);

  for (let i = 0; i < nums.length; i++) {
    const x = p1.x + dx * (i + 1);
    const y = p1.y + dy * (i + 1);
    ctx.fillStyle = "#0f0";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(nums[i], x - 10, y - 10);
  }
}

function clearTriangle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function triggerAnimation() {
  canvas.classList.add("flash");
  setTimeout(() => {
    canvas.classList.remove("flash");
  }, 300);
}
