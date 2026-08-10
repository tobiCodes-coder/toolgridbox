const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const qualityRange = document.querySelector('#qualityRange');
const qualityValue = document.querySelector('#qualityValue');
const widthInput = document.querySelector('#widthInput');
const formatSelect = document.querySelector('#formatSelect');
const originalPreview = document.querySelector('#originalPreview');
const compressedPreview = document.querySelector('#compressedPreview');
const originalSize = document.querySelector('#originalSize');
const compressedSize = document.querySelector('#compressedSize');
const downloadBtn = document.querySelector('#downloadBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');

let originalImage = null;
let originalFileSize = 0;
let compressedBlob = null;

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    statusMsg.textContent = 'Please select a valid image file.';
    return;
  }

  originalFileSize = file.size;
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      originalImage = img;
      originalPreview.src = e.target.result;
      originalSize.textContent = formatBytes(originalFileSize);
      editorArea.style.display = 'block';
      compressImage();
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function compressImage() {
  if (!originalImage) return;

  const quality = Number(qualityRange.value) / 100;
  const format = formatSelect.value;
  const maxWidth = Number(widthInput.value) || originalImage.width;

  let targetWidth = originalImage.width;
  let targetHeight = originalImage.height;

  if (maxWidth < originalImage.width) {
    const ratio = maxWidth / originalImage.width;
    targetWidth = maxWidth;
    targetHeight = Math.round(originalImage.height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);

  canvas.toBlob((blob) => {
    if (!blob) return;
    compressedBlob = blob;
    compressedPreview.src = URL.createObjectURL(blob);
    compressedSize.textContent = formatBytes(blob.size);

    const savedPercent = originalFileSize > 0
      ? Math.round((1 - blob.size / originalFileSize) * 100)
      : 0;

    statusMsg.textContent = savedPercent > 0
      ? `Reduced by ${savedPercent}%`
      : '';
  }, format, quality);
}

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

fileInput.addEventListener('change', (e) => {
  handleFile(e.target.files[0]);
});

qualityRange.addEventListener('input', () => {
  qualityValue.textContent = qualityRange.value;
  compressImage();
});

widthInput.addEventListener('input', compressImage);
formatSelect.addEventListener('change', compressImage);

downloadBtn.addEventListener('click', () => {
  if (!compressedBlob) return;
  const ext = formatSelect.value.split('/')[1];
  const link = document.createElement('a');
  link.download = `compressed.${ext}`;
  link.href = URL.createObjectURL(compressedBlob);
  link.click();
});

resetBtn.addEventListener('click', () => {
  originalImage = null;
  compressedBlob = null;
  editorArea.style.display = 'none';
  fileInput.value = '';
  statusMsg.textContent = '';
});