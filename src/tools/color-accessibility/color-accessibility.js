const textColor = document.querySelector('#textColor');
const bgColor = document.querySelector('#bgColor');
const primaryColor = document.querySelector('#primaryColor');
const secondaryColor = document.querySelector('#secondaryColor');
const textHex = document.querySelector('#textHex');
const bgHex = document.querySelector('#bgHex');
const contrastResult = document.querySelector('#contrastResult');
const cbSelect = document.querySelector('#cbSelect');
const previewArea = document.querySelector('#previewArea');
const cssOutput = document.querySelector('#cssOutput');
const copyCssBtn = document.querySelector('#copyCssBtn');
const copyHexBtn = document.querySelector('#copyHexBtn');
const statusMsg = document.querySelector('#statusMsg');

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function updateContrastResult() {
  const ratio = contrastRatio(textHex.value, bgHex.value);
  const ratioFixed = ratio.toFixed(2);

  const aaNormal = ratio >= 4.5;
  const aaaNormal = ratio >= 7;
  const aaLarge = ratio >= 3;
  const aaaLarge = ratio >= 4.5;

  contrastResult.innerHTML = `
    <div class="contrast-ratio">${ratioFixed}:1</div>
    <span class="wcag-badge ${aaNormal ? 'pass' : 'fail'}">AA Normal ${aaNormal ? 'Pass' : 'Fail'}</span>
    <span class="wcag-badge ${aaaNormal ? 'pass' : 'fail'}">AAA Normal ${aaaNormal ? 'Pass' : 'Fail'}</span><br>
    <span class="wcag-badge ${aaLarge ? 'pass' : 'fail'}">AA Large ${aaLarge ? 'Pass' : 'Fail'}</span>
    <span class="wcag-badge ${aaaLarge ? 'pass' : 'fail'}">AAA Large ${aaaLarge ? 'Pass' : 'Fail'}</span>
  `;
}

function updatePreview() {
  previewArea.style.background = bgHex.value;
  previewArea.style.color = textHex.value;

  const btn = previewArea.querySelector('.preview-btn');
  btn.style.background = primaryColor.value;
  btn.style.color = bgHex.value;

  const badge = previewArea.querySelector('.preview-badge');
  badge.style.background = secondaryColor.value;
  badge.style.color = textHex.value;

  const alert = previewArea.querySelector('.preview-alert');
  alert.style.background = secondaryColor.value;
  alert.style.color = textHex.value;

  const input = previewArea.querySelector('.preview-input');
  input.style.borderColor = secondaryColor.value;
  input.style.background = bgHex.value;
  input.style.color = textHex.value;

  const link = previewArea.querySelector('.preview-link');
  link.style.color = primaryColor.value;
}

function updateColorBlindFilter() {
  const val = cbSelect.value;
  previewArea.style.filter = val === 'none' ? 'none' : `url(#${val})`;
}

function generateCSS() {
  return `:root {
  --text-color: ${textHex.value};
  --bg-color: ${bgHex.value};
  --primary-color: ${primaryColor.value};
  --secondary-color: ${secondaryColor.value};
}`;
}

function updateAll() {
  updateContrastResult();
  updatePreview();
  cssOutput.textContent = generateCSS();
  statusMsg.textContent = '';
}

textColor.addEventListener('input', () => {
  textHex.value = textColor.value;
  updateAll();
});

bgColor.addEventListener('input', () => {
  bgHex.value = bgColor.value;
  updateAll();
});

textHex.addEventListener('input', () => {
  if (/^#[0-9A-Fa-f]{6}$/.test(textHex.value)) {
    textColor.value = textHex.value;
    updateAll();
  }
});

bgHex.addEventListener('input', () => {
  if (/^#[0-9A-Fa-f]{6}$/.test(bgHex.value)) {
    bgColor.value = bgHex.value;
    updateAll();
  }
});

primaryColor.addEventListener('input', updateAll);
secondaryColor.addEventListener('input', updateAll);
cbSelect.addEventListener('change', updateColorBlindFilter);

copyCssBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(cssOutput.textContent).then(() => {
    statusMsg.textContent = 'CSS variables copied.';
  });
});

copyHexBtn.addEventListener('click', () => {
  const palette = `Text: ${textHex.value}\nBackground: ${bgHex.value}\nPrimary: ${primaryColor.value}\nSecondary: ${secondaryColor.value}`;
  navigator.clipboard.writeText(palette).then(() => {
    statusMsg.textContent = 'HEX palette copied.';
  });
});

updateAll();