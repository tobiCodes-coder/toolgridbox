const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const resultArea = document.getElementById('resultArea');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

const SIZES = [16, 32, 64, 128, 256];
let generatedImages = {};

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
fileInput.addEventListener('change', e => handleFile(e.target.files[0]));

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => generateFavicons(img);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function generateFavicons(img) {
  generatedImages = {};

  SIZES.forEach(size => {
    const box = document.querySelector(`.fav-preview[data-size="${size}"]`);
    box.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);

    box.appendChild(canvas);
    const label = document.createElement('span');
    label.textContent = `${size}x${size}`;
    box.appendChild(label);

    generatedImages[size] = canvas.toDataURL('image/png');
  });

  resultArea.style.display = 'block';
  dropZone.style.display = 'none';
}

downloadBtn.addEventListener('click', async () => {
  if (Object.keys(generatedImages).length === 0) return;

  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Zipping...';

  const zip = new JSZip();

  SIZES.forEach(size => {
    const base64 = generatedImages[size].split(',')[1];
    zip.file(`favicon-${size}x${size}.png`, base64, { base64: true });
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'favicons.zip';
  link.click();

  downloadBtn.disabled = false;
  downloadBtn.textContent = 'Download All (.zip)';
});

resetBtn.addEventListener('click', () => {
  generatedImages = {};
  resultArea.style.display = 'none';
  dropZone.style.display = 'block';
  fileInput.value = '';
  SIZES.forEach(size => {
    const box = document.querySelector(`.fav-preview[data-size="${size}"]`);
    box.innerHTML = `${size}x${size}`;
  });
});
