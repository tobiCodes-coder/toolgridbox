const preview = document.querySelector('#preview');
const typeSelect = document.querySelector('#typeSelect');
const angleOption = document.querySelector('#angleOption');
const angleRange = document.querySelector('#angleRange');
const angleValue = document.querySelector('#angleValue');
const stopsList = document.querySelector('#stopsList');
const addStopBtn = document.querySelector('#addStopBtn');
const cssOutput = document.querySelector('#cssOutput');
const copyBtn = document.querySelector('#copyBtn');
const statusMsg = document.querySelector('#statusMsg');

let stops = [
  { color: '#185fa5', percent: 0 },
  { color: '#8fd3f4', percent: 100 }
];

function renderStops() {
  stopsList.innerHTML = '';

  stops.forEach((stop, i) => {
    const row = document.createElement('div');
    row.className = 'stop-row';
    row.innerHTML = `
      <input type="color" value="${stop.color}" data-index="${i}" class="stop-color" />
      <input type="range" min="0" max="100" value="${stop.percent}" data-index="${i}" class="stop-percent-range" />
      <span class="stop-percent">${stop.percent}%</span>
      <button class="remove-btn" data-index="${i}">Remove</button>
    `;
    stopsList.appendChild(row);
  });

  stopsList.querySelectorAll('.stop-color').forEach(el => {
    el.addEventListener('input', (e) => {
      stops[e.target.dataset.index].color = e.target.value;
      updateGradient();
    });
  });

  stopsList.querySelectorAll('.stop-percent-range').forEach(el => {
    el.addEventListener('input', (e) => {
      const i = e.target.dataset.index;
      stops[i].percent = Number(e.target.value);
      e.target.nextElementSibling.textContent = `${e.target.value}%`;
      updateGradient();
    });
  });

  stopsList.querySelectorAll('.remove-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      if (stops.length <= 2) {
        statusMsg.textContent = 'At least 2 color stops are required.';
        return;
      }
      stops.splice(e.target.dataset.index, 1);
      renderStops();
      updateGradient();
    });
  });
}

function buildGradientCSS() {
  const stopsStr = stops
    .slice()
    .sort((a, b) => a.percent - b.percent)
    .map(s => `${s.color} ${s.percent}%`)
    .join(', ');

  if (typeSelect.value === 'linear') {
    return `linear-gradient(${angleRange.value}deg, ${stopsStr})`;
  }
  return `radial-gradient(circle, ${stopsStr})`;
}

function updateGradient() {
  const gradientValue = buildGradientCSS();
  preview.style.background = gradientValue;
  cssOutput.textContent = `background: ${gradientValue};`;
  statusMsg.textContent = '';
}

typeSelect.addEventListener('change', () => {
  angleOption.style.display = typeSelect.value === 'linear' ? 'flex' : 'none';
  updateGradient();
});

angleRange.addEventListener('input', () => {
  angleValue.textContent = angleRange.value;
  updateGradient();
});

addStopBtn.addEventListener('click', () => {
  stops.push({ color: '#ffffff', percent: 50 });
  renderStops();
  updateGradient();
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(cssOutput.textContent).then(() => {
    statusMsg.textContent = 'Copied to clipboard.';
  }).catch(() => {
    statusMsg.textContent = 'Copy failed.';
  });
});

renderStops();
updateGradient();