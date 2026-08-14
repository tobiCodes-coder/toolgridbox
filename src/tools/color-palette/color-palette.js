const baseColor = document.querySelector('#baseColor');
const randomBtn = document.querySelector('#randomBtn');
const schemeBtns = document.querySelectorAll('.scheme-btn');
const paletteGrid = document.querySelector('#paletteGrid');
const exportCssBtn = document.querySelector('#exportCssBtn');
const exportJsonBtn = document.querySelector('#exportJsonBtn');
const statusMsg = document.querySelector('#statusMsg');

let activeScheme = 'complementary';
let currentPalette = [];

const COLOR_NAMES = [
  { name: 'Crimson', hex: '#dc143c' }, { name: 'Steel Blue', hex: '#4682b4' },
  { name: 'Forest Green', hex: '#228b22' }, { name: 'Gold', hex: '#ffd700' },
  { name: 'Purple', hex: '#800080' }, { name: 'Coral', hex: '#ff7f50' },
  { name: 'Teal', hex: '#008080' }, { name: 'Salmon', hex: '#fa8072' },
  { name: 'Navy', hex: '#000080' }, { name: 'Orchid', hex: '#da70d6' },
  { name: 'Slate Gray', hex: '#708090' }, { name: 'Tomato', hex: '#ff6347' },
  { name: 'Sea Green', hex: '#2e8b57' }, { name: 'Indigo', hex: '#4b0082' },
  { name: 'Khaki', hex: '#f0e68c' }, { name: 'Charcoal', hex: '#36454f' },
  { name: 'Rose', hex: '#ff007f' }, { name: 'Sky Blue', hex: '#87ceeb' },
  { name: 'Amber', hex: '#ffbf00' }, { name: 'Mint', hex: '#3eb489' }
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

function rgbToCmyk(r, g, b) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rp = r / 255, gp = g / 255, bp = b / 255;
  const k = 1 - Math.max(rp, gp, bp);
  const c = (1 - rp - k) / (1 - k) || 0;
  const m = (1 - gp - k) / (1 - k) || 0;
  const y = (1 - bp - k) / (1 - k) || 0;
  return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (d === 0) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function closestColorName(hex) {
  const rgb = hexToRgb(hex);
  let closest = COLOR_NAMES[0];
  let minDist = Infinity;

  COLOR_NAMES.forEach(c => {
    const cRgb = hexToRgb(c.hex);
    const dist = Math.sqrt((rgb.r - cRgb.r) ** 2 + (rgb.g - cRgb.g) ** 2 + (rgb.b - cRgb.b) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closest = c;
    }
  });

  return closest.name;
}

function generateScheme(baseHex, scheme) {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  let hueList = [hsl.h];

  if (scheme === 'complementary') {
    hueList.push((hsl.h + 180) % 360);
  } else if (scheme === 'analogous') {
    hueList.push((hsl.h - 30 + 360) % 360, (hsl.h + 30) % 360, (hsl.h - 60 + 360) % 360, (hsl.h + 60) % 360);
  } else if (scheme === 'triadic') {
    hueList.push((hsl.h + 120) % 360, (hsl.h + 240) % 360);
  } else if (scheme === 'tetradic') {
    hueList.push((hsl.h + 90) % 360, (hsl.h + 180) % 360, (hsl.h + 270) % 360);
  } else if (scheme === 'monochromatic') {
    const hexList = [];
    [20, 35, 50, 65, 80].forEach(l => {
      const newRgb = hslToRgb(hsl.h, hsl.s, l);
      hexList.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    });
    return hexList;
  }

  let hexList = hueList.map(h => {
    const newRgb = hslToRgb(h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  });

  while (hexList.length < 5) {
    const extraHue = hueList[hexList.length % hueList.length];
    const lightness = hexList.length % 2 === 0 ? Math.min(85, hsl.l + 20) : Math.max(15, hsl.l - 20);
    const newRgb = hslToRgb(extraHue, hsl.s, lightness);
    hexList.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return hexList;
}

function renderPalette() {
  const base = baseColor.value;
  currentPalette = generateScheme(base, activeScheme);

  paletteGrid.innerHTML = currentPalette.map(hex => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const name = closestColorName(hex);

    return `
      <div class="color-card">
        <div class="color-swatch" style="background:${hex}" data-copy="${hex}"></div>
        <div class="color-info">
          <div class="color-name">${name}</div>
          <div class="color-formats">
            <div class="format-row" data-copy="${hex}"><span class="format-label">HEX</span><span>${hex}</span></div>
            <div class="format-row" data-copy="rgb(${rgb.r}, ${rgb.g}, ${rgb.b})"><span class="format-label">RGB</span><span>${rgb.r}, ${rgb.g}, ${rgb.b}</span></div>
            <div class="format-row" data-copy="hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)"><span class="format-label">HSL</span><span>${hsl.h}, ${hsl.s}%, ${hsl.l}%</span></div>
            <div class="format-row" data-copy="hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)"><span class="format-label">HSV</span><span>${hsv.h}, ${hsv.s}%, ${hsv.v}%</span></div>
            <div class="format-row" data-copy="cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)"><span class="format-label">CMYK</span><span>${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}</span></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      const value = el.dataset.copy;
      navigator.clipboard.writeText(value).then(() => {
        statusMsg.textContent = `Copied: ${value}`;
      });
    });
  });
}

baseColor.addEventListener('input', renderPalette);

randomBtn.addEventListener('click', () => {
  const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  baseColor.value = randomHex;
  renderPalette();
});

schemeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    schemeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeScheme = btn.dataset.scheme;
    renderPalette();
  });
});

exportCssBtn.addEventListener('click', () => {
  const css = currentPalette.map((hex, i) => `  --color-${i + 1}: ${hex};`).join('\n');
  const output = `:root {\n${css}\n}`;
  navigator.clipboard.writeText(output).then(() => {
    statusMsg.textContent = 'CSS variables copied.';
  });
});

exportJsonBtn.addEventListener('click', () => {
  const json = JSON.stringify(currentPalette, null, 2);
  navigator.clipboard.writeText(json).then(() => {
    statusMsg.textContent = 'JSON copied.';
  });
});

renderPalette();