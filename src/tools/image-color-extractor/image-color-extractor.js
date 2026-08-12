const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const imagePreview = document.querySelector('#imagePreview');
const paletteBox = document.querySelector('#paletteBox');
const cssCodeOutput = document.querySelector('#cssCodeOutput');
const htmlCodeOutput = document.querySelector('#htmlCodeOutput');
const copyCssBtn = document.querySelector('#copyCssBtn');
const copyHtmlBtn = document.querySelector('#copyHtmlBtn');

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      imagePreview.src = e.target.result;
      editorArea.style.display = 'block';
      extractColors(img);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function extractColors(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 100;
  canvas.height = 100;

  ctx.drawImage(img, 0, 0, 100, 100);
  const data = ctx.getImageData(0, 0, 100, 100).data;

  const colorMap = {};
  for (let i = 0; i < data.length; i += 16) { // Sampling pixels
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Group similar colors slightly
    const key = `${Math.round(r / 20) * 20},${Math.round(g / 20) * 20},${Math.round(b / 20) * 20}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  const sortedColors = Object.keys(colorMap)
    .sort((a, b) => colorMap[b] - colorMap[a])
    .slice(0, 6)
    .map(rgbStr => {
      const [r, g, b] = rgbStr.split(',').map(Number);
      return rgbToHex(r, g, b);
    });

  renderPaletteAndCode(sortedColors);
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function renderPaletteAndCode(colors) {
  paletteBox.innerHTML = '';
  let cssVars = ':root {\n';

  colors.forEach((hex, index) => {
    const varName = `--color-${index + 1}`;
    cssVars += `  ${varName}: ${hex};\n`;

    // Render Color Card
    const card = document.createElement('div');
    card.className = 'color-card';
    card.innerHTML = `
      <div class="color-swatch" style="background:${hex};"></div>
      <div class="color-val">${hex}</div>
    `;
    card.addEventListener('click', () => {
      navigator.clipboard.writeText(hex);
      const valDiv = card.querySelector('.color-val');
      const originalText = valDiv.textContent;
      valDiv.textContent = 'Copied!';
      setTimeout(() => valDiv.textContent = originalText, 1000);
    });
    paletteBox.appendChild(card);
  });

  cssVars += '}';

  // 🚀 Full Web Page Layout Structure Template
  const htmlClasses = `<!-- Full Web Page Layout Structure -->
<div style="font-family: system-ui, sans-serif; background-color: var(--color-1, #ffffff); color: var(--color-2, #111111); min-height: 100vh;">

  <!-- 1. Header / Navbar Structure -->
  <header style="display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; border-bottom: 1px solid var(--color-3, #eee);">
    <div style="font-weight: 700; font-size: 20px; color: var(--color-2, #111);">BrandLogo</div>
    <nav style="display: flex; gap: 20px; font-size: 14px; color: var(--color-4, #555);">
      <a href="#" style="color: inherit; text-decoration: none;">Home</a>
      <a href="#" style="color: inherit; text-decoration: none;">Features</a>
      <a href="#" style="color: inherit; text-decoration: none;">Pricing</a>
    </nav>
    <button style="background-color: var(--color-5, #0066cc); color: var(--color-6, #fff); border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; cursor: pointer;">Get Started</button>
  </header>

  <!-- 2. Hero Section Structure -->
  <section style="text-align: center; padding: 60px 20px; max-width: 800px; margin: 0 auto;">
    <span style="background-color: var(--color-3, #eef); color: var(--color-5, #0066cc); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">NEW RELEASE</span>
    <h1 style="font-size: 40px; margin: 16px 0; color: var(--color-2, #111);">Build Modern Websites Faster</h1>
    <p style="font-size: 18px; color: var(--color-4, #666); line-height: 1.6; margin-bottom: 24px;">Extract design colors directly from your preview images and apply them to standard HTML layout structures easily.</p>
    <div style="display: flex; gap: 12px; justify-content: center;">
      <button style="background-color: var(--color-5, #0066cc); color: var(--color-6, #fff); border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">Primary Action</button>
      <button style="background-color: transparent; color: var(--color-2, #111); border: 1px solid var(--color-3, #ccc); padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">Secondary Action</button>
    </div>
  </section>

  <!-- 3. Feature Cards Grid Structure -->
  <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 40px 32px; max-width: 1000px; margin: 0 auto;">
    <div style="background-color: var(--color-1, #fff); border: 1px solid var(--color-3, #eee); padding: 20px; border-radius: 10px;">
      <h3 style="margin-top: 0; color: var(--color-2, #111);">Feature One</h3>
      <p style="color: var(--color-4, #666); font-size: 14px; margin: 0;">Clean card box utilizing extracted primary and secondary variable colors.</p>
    </div>
    <div style="background-color: var(--color-1, #fff); border: 1px solid var(--color-3, #eee); padding: 20px; border-radius: 10px;">
      <h3 style="margin-top: 0; color: var(--color-2, #111);">Feature Two</h3>
      <p style="color: var(--color-4, #666); font-size: 14px; margin: 0;">Balanced typography contrast calculated directly from image elements.</p>
    </div>
  </section>

  <!-- 4. Footer Structure -->
  <footer style="text-align: center; padding: 24px; border-top: 1px solid var(--color-3, #eee); color: var(--color-4, #888); font-size: 13px;">
    © 2026 Your Company. All rights reserved.
  </footer>

</div>`;

  cssCodeOutput.value = cssVars;
  htmlCodeOutput.value = htmlClasses;
}

// Event Listeners
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => { 
  e.preventDefault(); 
  dropZone.classList.add('dragover'); 
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

copyCssBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(cssCodeOutput.value);
  copyCssBtn.textContent = 'Copied!';
  setTimeout(() => copyCssBtn.textContent = 'Copy CSS Code', 1500);
});

copyHtmlBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(htmlCodeOutput.value);
  copyHtmlBtn.textContent = 'Copied!';
  setTimeout(() => copyHtmlBtn.textContent = 'Copy HTML Code', 1500);
});