let elements = [];
let selectedId = null;
let nextId = 1;

const els = {
  addElBtn: document.querySelector('#addElBtn'),
  elementList: document.querySelector('#elementList'),
  previewStage: document.querySelector('#previewStage'),
  dynamicKeyframes: document.querySelector('#dynamicKeyframes'),
  cssOutput: document.querySelector('#cssOutput'),
  htmlOutput: document.querySelector('#htmlOutput'),
  restartBtn: document.querySelector('#restartBtn'),
  copyCssBtn: document.querySelector('#copyCssBtn'),
  copyHtmlBtn: document.querySelector('#copyHtmlBtn'),

  x: document.querySelector('#ctrlX'),
  y: document.querySelector('#ctrlY'),
  scale: document.querySelector('#ctrlScale'),
  rotate: document.querySelector('#ctrlRotate'),
  skewX: document.querySelector('#ctrlSkewX'),
  skewY: document.querySelector('#ctrlSkewY'),
  origin: document.querySelector('#ctrlOrigin'),
  opacity: document.querySelector('#ctrlOpacity'),
  radius: document.querySelector('#ctrlRadius'),
  color: document.querySelector('#ctrlColor'),
  duration: document.querySelector('#ctrlDuration'),
  delay: document.querySelector('#ctrlDelay'),
  timing: document.querySelector('#ctrlTiming'),
  direction: document.querySelector('#ctrlDirection'),
  fill: document.querySelector('#ctrlFill'),
  infinite: document.querySelector('#ctrlInfinite'),
  iteration: document.querySelector('#ctrlIteration'),
  iterationWrap: document.querySelector('#iterationWrap'),
};

function defaultElement() {
  return {
    id: 'el' + nextId++,
    x: 60, y: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0,
    origin: '50% 50%',
    opacity: 1, radius: 8, color: '#185fa5',
    duration: 1, delay: 0, timing: 'ease', direction: 'normal',
    fill: 'forwards', infinite: true, iteration: 1
  };
}

function getSelected() {
  return elements.find(e => e.id === selectedId);
}

function addElement() {
  const el = defaultElement();
  elements.push(el);
  selectedId = el.id;
  renderAll();
}

function removeElement(id) {
  elements = elements.filter(e => e.id !== id);
  if (selectedId === id) {
    selectedId = elements.length ? elements[0].id : null;
  }
  renderAll();
}

function selectElement(id) {
  selectedId = id;
  renderAll();
}

function renderElementList() {
  if (elements.length === 0) {
    els.elementList.innerHTML = '<p class="no-elements">No elements yet. Click "+ Add element".</p>';
    return;
  }

  els.elementList.innerHTML = elements.map((el, i) => `
    <div class="element-row ${el.id === selectedId ? 'active' : ''}" data-id="${el.id}">
      <span class="name">Element ${i + 1}</span>
      <button data-action="remove" data-id="${el.id}">Remove</button>
    </div>
  `).join('');
}

function loadControlsFromSelected() {
  const el = getSelected();
  const disabled = !el;

  document.querySelectorAll('.studio-panel .control-grid input, .studio-panel .control-grid select')
    .forEach(input => input.disabled = disabled);

  if (!el) return;

  els.x.value = el.x;
  els.y.value = el.y;
  els.scale.value = el.scale;
  els.rotate.value = el.rotate;
  els.skewX.value = el.skewX;
  els.skewY.value = el.skewY;
  els.origin.value = el.origin;
  els.opacity.value = el.opacity;
  els.radius.value = el.radius;
  els.color.value = el.color;
  els.duration.value = el.duration;
  els.delay.value = el.delay;
  els.timing.value = el.timing;
  els.direction.value = el.direction;
  els.fill.value = el.fill;
  els.infinite.checked = el.infinite;
  els.iteration.value = el.iteration;
  els.iterationWrap.style.display = el.infinite ? 'none' : 'flex';

  updateLabels(el);
}

function updateLabels(el) {
  document.querySelector('#xVal').textContent = el.x + 'px';
  document.querySelector('#yVal').textContent = el.y + 'px';
  document.querySelector('#scaleVal').textContent = el.scale;
  document.querySelector('#rotateVal').textContent = el.rotate + 'deg';
  document.querySelector('#skewXVal').textContent = el.skewX + 'deg';
  document.querySelector('#skewYVal').textContent = el.skewY + 'deg';
  document.querySelector('#opacityVal').textContent = el.opacity;
  document.querySelector('#radiusVal').textContent = el.radius + '%';
  document.querySelector('#durationVal').textContent = el.duration + 's';
  document.querySelector('#delayVal').textContent = el.delay + 's';
  document.querySelector('#iterationVal').textContent = el.iteration;
}

function buildCSSForElement(el, i) {
  const iterationCount = el.infinite ? 'infinite' : el.iteration;

  const keyframes = `@keyframes anim-${el.id} {
  0% {
    transform: translate(0px, 0px) scale(1) rotate(0deg) skew(0deg, 0deg);
    opacity: 1;
    border-radius: 0%;
    background-color: ${el.color};
  }
  100% {
    transform: translate(${el.x}px, ${el.y}px) scale(${el.scale}) rotate(${el.rotate}deg) skew(${el.skewX}deg, ${el.skewY}deg);
    opacity: ${el.opacity};
    border-radius: ${el.radius}%;
    background-color: ${el.color};
  }
}`;

  const classCSS = `.studio-shape-${el.id} {
  background-color: ${el.color};
  border-radius: 0%;
  transform-origin: ${el.origin};
  animation-name: anim-${el.id};
  animation-duration: ${el.duration}s;
  animation-delay: ${el.delay}s;
  animation-timing-function: ${el.timing};
  animation-direction: ${el.direction};
  animation-fill-mode: ${el.fill};
  animation-iteration-count: ${iterationCount};
}`;

  return { keyframes, classCSS };
}

function renderPreview() {
  let allKeyframes = '';
  let stageHTML = '';

  elements.forEach((el, i) => {
    const { keyframes, classCSS } = buildCSSForElement(el, i);
    allKeyframes += keyframes + '\n' + classCSS + '\n';
    stageHTML += `<div class="studio-shape studio-shape-${el.id}"></div>`;
  });

  els.dynamicKeyframes.textContent = allKeyframes;
  els.previewStage.innerHTML = stageHTML;
}

function buildOutputText() {
  let css = '';
  elements.forEach((el, i) => {
    const { keyframes, classCSS } = buildCSSForElement(el, i);
    css += keyframes + '\n\n' + classCSS + '\n\n';
  });

  const html = elements.map(el => `<div class="studio-shape-${el.id}"></div>`).join('\n');

  els.cssOutput.textContent = css.trim() || '/* Add an element to see generated CSS */';
  els.htmlOutput.textContent = html || '<!-- Add an element to see HTML example -->';
}

function restartAnimations() {
  els.previewStage.querySelectorAll('.studio-shape').forEach(shape => {
    shape.style.animation = 'none';
    void shape.offsetWidth;
    shape.style.animation = '';
  });
}

function renderAll() {
  renderElementList();
  loadControlsFromSelected();
  renderPreview();
  buildOutputText();
}

// Control input handlers — read all current values, save to selected element, re-render
function bindControl(input, key, isNumber = true, isFloat = false) {
  input.addEventListener('input', () => {
    const el = getSelected();
    if (!el) return;

    if (key === 'infinite') {
      el.infinite = input.checked;
      els.iterationWrap.style.display = el.infinite ? 'none' : 'flex';
    } else if (input.type === 'checkbox') {
      el[key] = input.checked;
    } else if (isNumber) {
      el[key] = isFloat ? parseFloat(input.value) : Number(input.value);
    } else {
      el[key] = input.value;
    }

    updateLabels(el);
    renderPreview();
    buildOutputText();
  });
}

bindControl(els.x, 'x');
bindControl(els.y, 'y');
bindControl(els.scale, 'scale', true, true);
bindControl(els.rotate, 'rotate');
bindControl(els.skewX, 'skewX');
bindControl(els.skewY, 'skewY');
bindControl(els.origin, 'origin', false);
bindControl(els.opacity, 'opacity', true, true);
bindControl(els.radius, 'radius');
bindControl(els.color, 'color', false);
bindControl(els.duration, 'duration', true, true);
bindControl(els.delay, 'delay', true, true);
bindControl(els.timing, 'timing', false);
bindControl(els.direction, 'direction', false);
bindControl(els.fill, 'fill', false);
bindControl(els.infinite, 'infinite');
bindControl(els.iteration, 'iteration');

els.addElBtn.addEventListener('click', addElement);

els.elementList.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('[data-action="remove"]');
  if (removeBtn) {
    removeElement(removeBtn.dataset.id);
    return;
  }

  const row = e.target.closest('.element-row');
  if (row) selectElement(row.dataset.id);
});

els.restartBtn.addEventListener('click', restartAnimations);

els.copyCssBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(els.cssOutput.textContent);
    els.copyCssBtn.textContent = 'Copied!';
    setTimeout(() => els.copyCssBtn.textContent = 'Copy CSS', 1200);
  } catch (err) {
    els.copyCssBtn.textContent = 'Copy failed';
  }
});

els.copyHtmlBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(els.htmlOutput.textContent);
    els.copyHtmlBtn.textContent = 'Copied!';
    setTimeout(() => els.copyHtmlBtn.textContent = 'Copy HTML', 1200);
  } catch (err) {
    els.copyHtmlBtn.textContent = 'Copy failed';
  }
});

// Start with one element so the tool isn't empty on load
addElement();