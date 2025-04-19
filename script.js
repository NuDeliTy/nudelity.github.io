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

  const needed = sideCount * 3 - 3;
  let found = false;
  const possibleSums = new Set();

  function permute(arr, len, current = []) {
    if (found) return;
    if (current.length === len) {
      const total = current.slice();
      const cornerA = total[0];
      const cornerB = total[sideCount - 1];
      const cornerC = total[2 * sideCount - 2];

      const side1 = total.slice(0, sideCount);
      const side2 = [cornerB, ...total.slice(sideCount, 2 * sideCount - 2), cornerC];
      const side3 = [cornerC, ...total.slice(2 * sideCount - 2, 3 * sideCount - 3), cornerA];

      const sum1 = side1.reduce((a, b) => a + b, 0);
      const sum2 = side2.reduce((a, b) => a + b, 0);
      const sum3 = side3.reduce((a, b) => a + b, 0);

      if (sum1 === sum2 && sum2 === sum3) {
        possibleSums.add(sum1);
        if (sum1 === targetSum) {
          drawTriangle(side1, side2, side3);
          resultDiv.innerHTML = `<p>🎉 Ratkaisu löytyi!</p><p>x = [${side1.join(', ')}]</p><p>y = [${side2.join(', ')}]</p><p>z = [${side3.join(', ')}]</p>`;
          found = true;
          successSound.play();
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
    resultDiv.innerHTML = `<p style="color:#f55;">Ratkaisua ei löytynyt!</p>`;
    const suggestions = [...possibleSums].filter(s => s !== targetSum).slice(0, 3);
    if (suggestions.length > 0) {
      resultDiv.innerHTML += `<p>Mahdollisia summia joita voit kokeilla:</p><ul>${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>`;
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
    ctx.font = "bold 18px monospace";
    let offsetX = -10;
    let offsetY = -10;

    if (i === 0 || i === nums.length - 1) {
      offsetX = i === 0 ? -18 : 8;
      offsetY = side === 'bottom' ? -12 : 16;
    }

    ctx.fillText(nums[i], x + offsetX, y + offsetY);
  }
}

function clearTriangle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
