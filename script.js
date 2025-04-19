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

[sideSlider, rangeStartSlider, rangeEndSlider, targetSumSlider].forEach(slider => {
  slider.addEventListener("input", updateSliderLabels);
});

function updateSliderLabels() {
  sideVal.textContent = sideSlider.value;
  startVal.textContent = rangeStartSlider.value;
  endVal.textContent = rangeEndSlider.value;
  targetVal.textContent = targetSumSlider.value;
}

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

  const totalNeeded = sideCount * 3 - 3; // shared corners

  function combinations(arr, len, current = [], used = {}) {
    if (current.length === len) {
      const [a, b, ...rest] = current;

      const x = [a, ...rest.slice(0, sideCount - 2), b];
      const y = [b, ...rest.slice(sideCount - 2, 2 * sideCount - 4), a];
      const z = [a, ...rest.slice(2 * sideCount - 4)];

      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumZ = z.reduce((a, b) => a + b, 0);

      if (sumX === sumY && sumY === sumZ) {
        possibleSums.add(sumX);
        if (sumX === targetSum && !found) {
          found = true;
          drawTriangle(x, y, z);
          resultDiv.innerHTML = `<p>🎉 Ratkaisu löytyi!</p>
            <p>x = [${x.join(", ")}]</p>
            <p>y = [${y.join(", ")}]</p>
            <p>z = [${z.join(", ")}]</p>`;
          successSound.play();
        }
      }
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      const num = arr[i];
      if (!used[num]) {
        used[num] = true;
        combinations(arr, len, [...current, num], { ...used });
      }
    }
  }

  combinations(numbers, totalNeeded);

  if (!found) {
    failSound.play();
    resultDiv.innerHTML = `<p style="color:#f55;">Ratkaisua ei löytynyt!</p>`;
    const suggestions = [...possibleSums].filter(s => s !== targetSum).slice(0, 3);
    if (suggestions.length > 0) {
      resultDiv.innerHTML += `<p>Mahdollisia summia joita voit kokeilla:</p><ul style="list-style-position: inside; padding-left: 0;">${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>`;
    }
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

  drawSideNumbers(A, B, x, 'left');
  drawSideNumbers(B, C, y, 'bottom');
  drawSideNumbers(C, A, z, 'right');
}

function drawSideNumbers(p1, p2, nums, side) {
  const dx = (p2.x - p1.x) / (nums.length - 1);
  const dy = (p2.y - p1.y) / (nums.length - 1);

  for (let i = 0; i < nums.length; i++) {
    const x = p1.x + dx * i;
    const y = p1.y + dy * i;
    ctx.fillStyle = "#0f0";
    ctx.font = "bold 20px monospace";
    let offsetX = -10;
    let offsetY = -10;
    if ((i === 0 || i === nums.length - 1)) {
      offsetX += (side === 'left') ? -10 : (side === 'right' ? 10 : 0);
      offsetY += (side === 'bottom') ? -15 : 15;
    }
    ctx.fillText(nums[i], x + offsetX, y + offsetY);
  }
}

function clearTriangle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}