const startSlider = document.getElementById("rangeStart");
const endSlider = document.getElementById("rangeEnd");
const sumSlider = document.getElementById("targetSum");
const startVal = document.getElementById("startVal");
const endVal = document.getElementById("endVal");
const sumVal = document.getElementById("sumVal");
const solveBtn = document.getElementById("solveBtn");
const messageDiv = document.getElementById("message");
const svg = document.getElementById("triangleSvg");

function updateLabels() {
  startVal.textContent = startSlider.value;
  endVal.textContent = endSlider.value;

  const start = parseInt(startSlider.value);
  const end = parseInt(endSlider.value);
  sumSlider.min = start * 3;
  sumSlider.max = end * 3;
  if (parseInt(sumSlider.value) < sumSlider.min) sumSlider.value = sumSlider.min;
  if (parseInt(sumSlider.value) > sumSlider.max) sumSlider.value = sumSlider.max;
  sumVal.textContent = sumSlider.value;
}

[startSlider, endSlider, sumSlider].forEach(slider => {
  slider.addEventListener("input", updateLabels);
});

function solveTriangle(start, end, target) {
  const range = [];
  for (let i = start; i <= end; i++) range.push(i);

  const perms = permute(range, 6);
  for (let p of perms) {
    const [x0, y0, z0, x1, y1, z1] = p;
    const x2 = z0, y2 = x0, z2 = y0;

    const x = [x0, x1, x2];
    const y = [y0, y1, y2];
    const z = [z0, z1, z2];

    if (sum(x) === target && sum(y) === target && sum(z) === target) {
      return { x, y, z };
    }
  }
  return null;
}

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function permute(arr, k) {
  if (k === 1) return arr.map(e => [e]);
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    let rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (let p of permute(rest, k - 1)) {
      res.push([arr[i], ...p]);
    }
  }
  return res;
}

function drawTriangle(x, y, z) {
  svg.innerHTML = '';

  const points = [
    [150, 20],
    [280, 230],
    [20, 230]
  ];

  const path = `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]} L${points[2][0]},${points[2][1]} Z`;
  const trianglePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  trianglePath.setAttribute("d", path);
  trianglePath.setAttribute("stroke", "#ff00ff");
  trianglePath.setAttribute("stroke-width", "4");
  trianglePath.setAttribute("fill", "none");
  svg.appendChild(trianglePath);

  const midpoints = [
    [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2],
    [(points[1][0] + points[2][0]) / 2, (points[1][1] + points[2][1]) / 2],
    [(points[2][0] + points[0][0]) / 2, (points[2][1] + points[0][1]) / 2]
  ];

  const labels = [
    x.join(" "),
    y.join(" "),
    z.join(" ")
  ];

  midpoints.forEach((pos, i) => {
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", pos[0]);
    txt.setAttribute("y", pos[1]);
    txt.setAttribute("text-anchor", "middle");
    txt.textContent = labels[i];
    svg.appendChild(txt);
  });
}

solveBtn.addEventListener("click", () => {
  const start = parseInt(startSlider.value);
  const end = parseInt(endSlider.value);
  const target = parseInt(sumSlider.value);

  const result = solveTriangle(start, end, target);
  if (result) {
    drawTriangle(result.x, result.y, result.z);
    messageDiv.textContent = "";
  } else {
    messageDiv.textContent = "Ei löytynyt ratkaisua. Kokeile eri arvoja!";
    svg.innerHTML = '';
  }
});

updateLabels();
