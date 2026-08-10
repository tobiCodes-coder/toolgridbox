const previewBox = document.querySelector('#previewBox');
const layersList = document.querySelector('#layersList');
const addLayerBtn = document.querySelector('#addLayerBtn');
const cssOutput = document.querySelector('#cssOutput');
const copyBtn = document.querySelector('#copyBtn');
const statusMsg = document.querySelector('#statusMsg');

let layers = [
  { x: 0, y: 10, blur: 20, spread: 0, color: '#000000', opacity: 20, inset: false }
];

function renderLayers() {
  layersList.innerHTML = '';

  layers.forEach((layer, i) => {
    const row = document.createElement('div');
    row.className = 'layer-row';
    row.innerHTML = `
      <div class="layer-row-top">
        <span>Layer ${i + 1}</span>
        ${layers.length > 1 ? `<button class="remove-btn" data-index="${i}">Remove</button>` : ''}
      </div>
      <div class="layer-controls">
        <label class="control">X offset: ${layer.x}px
          <input type="range" min="-50" max="50" value="${layer.x}" data-index="${i}" data-key="x" />
        </label>
        <label class="control">Y offset: ${layer.y}px
          <input type="range" min="-50" max="50" value="${layer.y}" data-index="${i}" data-key="y" />
        </label>
        <label class="control">Blur: ${layer.blur}px
          <input type="range" min="0" max="100" value="${layer.blur}" data-index="${i}" data-key="blur" />
        </label>
        <label class="control">Spread: ${layer.spread}px
          <input type="range" min="-50" max="50" value="${layer.spread}" data-index="${i}" data-key="spread" />
        </label>
        <label class="control">Opacity: ${layer.opacity}%
          <input type="range" min="0" max="100" value="${layer.opacity}" data-index="${i}" data-key="opacity" />
        </label>
        <label class="control">Color
          <input type="color" value="${layer.color}" data-index="${i}" data-key="color" />
        </label>
        <label class="control checkbox">
          <input type="checkbox" ${layer.inset ? 'checked' : ''} data-index="${i}" data-key="inset" />
          Inset
        </label>
      </div>
    `;
    layersList.appendChild(row);
  });

  layersList.querySelectorAll('input[type="range"], input[type="color"]').forEach(input => {
    input.addEventListener('input', (e) => {
      const i = e.target.dataset.index;
      const key = e.target.dataset.key;
      layers[i][key] = key === 'color' ? e.target.value : Number(e.target.value);
      renderLayers();
      updatePreview();
    });
  });

  layersList.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const i = e.target.dataset.index;
      layers[i].inset = e.target.checked;
      updatePreview();
    });
  });

  layersList.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      layers.splice(e.target.dataset.index, 1);
      renderLayers();
      updatePreview();
    });
  });
}

function hexToRgba(hex, opacityPercent) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacityPercent / 100})`;
}

function buildShadowCSS() {
  return layers
    .map(l => `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color, l.opacity)}`)
    .join(',\n  ');
}

function updatePreview() {
  const shadowValue = buildShadowCSS();
  previewBox.style.boxShadow = shadowValue;
  cssOutput.textContent = `box-shadow:\n  ${shadowValue};`;
  statusMsg.textContent = '';
}

addLayerBtn.addEventListener('click', () => {
  layers.push({ x: 0, y: 10, blur: 20, spread: 0, color: '#000000', opacity: 20, inset: false });
  renderLayers();
  updatePreview();
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(cssOutput.textContent).then(() => {
    statusMsg.textContent = 'Copied to clipboard.';
  }).catch(() => {
    statusMsg.textContent = 'Copy failed.';
  });
});

renderLayers();
updatePreview();