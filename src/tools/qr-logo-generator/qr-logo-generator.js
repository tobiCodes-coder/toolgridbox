import QRCode from 'https://esm.sh/qrcode';

const qrText = document.querySelector('#qrText');
const dropZone = document.querySelector('#dropZone');
const dropZoneText = document.querySelector('#dropZoneText');
const fileInput = document.querySelector('#fileInput');
const logoPosSelect = document.querySelector('#logoPosSelect');
const logoShapeSelect = document.querySelector('#logoShapeSelect');
const fgColor = document.querySelector('#fgColor');
const bgColor = document.querySelector('#bgColor');
const logoSizeSlider = document.querySelector('#logoSizeSlider');
const logoSizeVal = document.querySelector('#logoSizeVal');
const downloadBtn = document.querySelector('#downloadBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');
const qrCanvas = document.querySelector('#qrCanvas');
const imagePreview = document.querySelector('#imagePreview');

let logoImage = null;

function setStatus(text, type = '') {
  statusMsg.textContent = text;
  statusMsg.className = 'status-msg' + (type ? ' ' + type : '');
}

async function renderQR() {
  const text = qrText.value.trim();

  if (!text) {
    setStatus('Please enter text or URL.', 'error');
    imagePreview.src = '';
    return;
  }

  setStatus('');

  try {
    const size = 1000;
    qrCanvas.width = size;
    qrCanvas.height = size;

    await QRCode.toCanvas(qrCanvas, text, {
      width: size,
      margin: 2,
      color: {
        dark: fgColor.value,
        light: bgColor.value
      },
      errorCorrectionLevel: 'H'
    });

    const ctx = qrCanvas.getContext('2d');

    if (logoImage) {
      const logoPercent = parseInt(logoSizeSlider.value) / 100;
      const logoWidth = size * logoPercent;
      const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
      const marginOffset = size * 0.05;

      let x, y;

      switch (logoPosSelect.value) {
        case 'top-left':
          x = marginOffset;
          y = marginOffset;
          break;
        case 'top-right':
          x = size - logoWidth - marginOffset;
          y = marginOffset;
          break;
        case 'bottom-left':
          x = marginOffset;
          y = size - logoHeight - marginOffset;
          break;
        case 'bottom-right':
          x = size - logoWidth - marginOffset;
          y = size - logoHeight - marginOffset;
          break;
        default: // center
          x = (size - logoWidth) / 2;
          y = (size - logoHeight) / 2;
          break;
      }

      const padding = 12;
      const bgX = x - padding;
      const bgY = y - padding;
      const bgW = logoWidth + padding * 2;
      const bgH = logoHeight + padding * 2;

      ctx.save();

      if (logoShapeSelect.value === 'circle') {
        const radius = Math.max(bgW, bgH) / 2;
        const centerX = x + logoWidth / 2;
        const centerY = y + logoHeight / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = bgColor.value;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - padding, 0, Math.PI * 2);
        ctx.clip();
      } else if (logoShapeSelect.value === 'rounded') {
        const r = 20;
        ctx.beginPath();
        ctx.roundRect(bgX, bgY, bgW, bgH, r);
        ctx.fillStyle = bgColor.value;
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(x, y, logoWidth, logoHeight, r / 2);
        ctx.clip();
      } else {
        ctx.fillStyle = bgColor.value;
        ctx.fillRect(bgX, bgY, bgW, bgH);
      }

      ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
      ctx.restore();
    }

    imagePreview.src = qrCanvas.toDataURL('image/png');
  } catch (err) {
    setStatus('Failed to generate QR code.', 'error');
  }
}

function handleLogo(file) {
  if (!file || !file.type.startsWith('image/')) {
    setStatus('Please select a valid logo image.', 'error');
    return;
  }

  dropZoneText.textContent = `Logo: ${file.name}`;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      logoImage = img;
      renderQR();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Listeners
qrText.addEventListener('input', renderQR);
fgColor.addEventListener('input', renderQR);
bgColor.addEventListener('input', renderQR);
logoPosSelect.addEventListener('change', renderQR);
logoShapeSelect.addEventListener('change', renderQR);

logoSizeSlider.addEventListener('input', () => {
  logoSizeVal.textContent = logoSizeSlider.value + '%';
  renderQR();
});

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleLogo(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => handleLogo(e.target.files[0]));

downloadBtn.addEventListener('click', () => {
  if (!imagePreview.src) return;

  const link = document.createElement('a');
  link.download = 'qrcode-qr-logo-generator.png';
  link.href = imagePreview.src;
  link.click();

  setStatus('QR Code downloaded successfully!', 'success');
});

resetBtn.addEventListener('click', () => {
  qrText.value = 'https://example.com';
  logoImage = null;
  fileInput.value = '';
  dropZoneText.textContent = 'Drag & drop logo here, or click to select';
  logoPosSelect.value = 'center';
  logoShapeSelect.value = 'square';
  fgColor.value = '#000000';
  bgColor.value = '#ffffff';
  logoSizeSlider.value = '20';
  logoSizeVal.textContent = '20%';
  setStatus('');
  renderQR();
});

// Initial Render
renderQR();