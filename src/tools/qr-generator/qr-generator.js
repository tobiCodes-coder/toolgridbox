const qrInput = document.querySelector('#qrInput');
const sizeSelect = document.querySelector('#sizeSelect');
const levelSelect = document.querySelector('#levelSelect');
const fgColor = document.querySelector('#fgColor');
const bgColor = document.querySelector('#bgColor');
const qrResult = document.querySelector('#qrResult');
const downloadBtn = document.querySelector('#downloadBtn');
const copyBtn = document.querySelector('#copyBtn');
const statusMsg = document.querySelector('#statusMsg');

const levelMap = {
  L: QRCode.CorrectLevel.L,
  M: QRCode.CorrectLevel.M,
  Q: QRCode.CorrectLevel.Q,
  H: QRCode.CorrectLevel.H
};

let debounceTimer;

function generateQR() {
  const value = qrInput.value.trim();

  if (!value) {
    qrResult.innerHTML = '';
    downloadBtn.style.display = 'none';
    copyBtn.style.display = 'none';
    return;
  }

  qrResult.innerHTML = '';

  new QRCode(qrResult, {
    text: value,
    width: Number(sizeSelect.value),
    height: Number(sizeSelect.value),
    colorDark: fgColor.value,
    colorLight: bgColor.value,
    correctLevel: levelMap[levelSelect.value]
  });

  downloadBtn.style.display = 'inline-block';
  copyBtn.style.display = 'inline-block';
  statusMsg.textContent = '';
}

function scheduleGenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(generateQR, 400);
}

qrInput.addEventListener('input', scheduleGenerate);
sizeSelect.addEventListener('change', generateQR);
levelSelect.addEventListener('change', generateQR);
fgColor.addEventListener('input', generateQR);
bgColor.addEventListener('input', generateQR);

downloadBtn.addEventListener('click', () => {
  const canvas = qrResult.querySelector('canvas');
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

copyBtn.addEventListener('click', async () => {
  const canvas = qrResult.querySelector('canvas');
  if (!canvas) return;

  canvas.toBlob(async (blob) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      statusMsg.textContent = 'Copied to clipboard';
    } catch (err) {
      statusMsg.textContent = 'Copy failed, try download instead';
    }
  });
});