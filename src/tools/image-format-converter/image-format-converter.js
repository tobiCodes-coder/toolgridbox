const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const previewImg = document.querySelector('#previewImg');
const formatSelect = document.querySelector('#formatSelect');
const convertBtn = document.querySelector('#convertBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');
const downloadArea = document.querySelector('#downloadArea');
const downloadBtn = document.querySelector('#downloadBtn');

let currentImage = null;
let resultBlobUrl = null;

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    statusMsg.textContent = 'Please select a valid image file.';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      currentImage = img;
      previewImg.src = e.target.result;
      editorArea.style.display = 'block';
      downloadArea.style.display = 'none';
      statusMsg.textContent = '';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
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
  handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
  handleFile(e.target.files[0]);
});

convertBtn.addEventListener('click', () => {
  if (!currentImage) return;

  const format = formatSelect.value;
  const canvas = document.createElement('canvas');
  canvas.width = currentImage.width;
  canvas.height = currentImage.height;
  const ctx = canvas.getContext('2d');

  if (format === 'image/jpeg' || format === 'image/bmp') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(currentImage, 0, 0);

  const mimeType = format === 'image/bmp' ? 'image/png' : format;

  canvas.toBlob((blob) => {
    if (!blob) {
      statusMsg.textContent = 'Conversion failed for this format in your browser.';
      return;
    }
    resultBlobUrl = URL.createObjectURL(blob);
    statusMsg.textContent = 'Converted successfully.';
    downloadArea.style.display = 'block';
  }, mimeType, 0.92);
});

downloadBtn.addEventListener('click', () => {
  if (!resultBlobUrl) return;
  const ext = formatSelect.value.split('/')[1];
  const link = document.createElement('a');
  link.href = resultBlobUrl;
  link.download = `converted.${ext}`;
  link.click();
});

resetBtn.addEventListener('click', () => {
  currentImage = null;
  resultBlobUrl = null;
  fileInput.value = '';
  editorArea.style.display = 'none';
  downloadArea.style.display = 'none';
  statusMsg.textContent = '';
});