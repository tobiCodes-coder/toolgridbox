const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const editorArea = document.getElementById('editorArea');
const originalImg = document.getElementById('originalImg');
const processedImg = document.getElementById('processedImg');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsg = document.getElementById('statusMsg');

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
fileInput.addEventListener('change', e => handleFile(e.target.files[0]));

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = e => {
    originalImg.src = e.target.result;
    processImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

function processImage(src) {
  statusMsg.textContent = 'Processing...';
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r > 240 && g > 240 && b > 240) data[i + 3] = 0;
    }
    ctx.putImageData(imageData, 0, 0);
    processedImg.src = canvas.toDataURL('image/png');
    editorArea.style.display = 'block';
    dropZone.style.display = 'none';
    statusMsg.textContent = 'Done! Download your image.';
  };
  img.src = src;
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'background-removed.png';
  link.href = processedImg.src;
  link.click();
});

resetBtn.addEventListener('click', () => {
  editorArea.style.display = 'none';
  dropZone.style.display = 'block';
  fileInput.value = '';
  statusMsg.textContent = '';
});