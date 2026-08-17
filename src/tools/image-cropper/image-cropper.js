const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const editorArea = document.getElementById('editorArea');
const canvas = document.getElementById('cropCanvas');
const ctx = canvas.getContext('2d');
const aspectSelect = document.getElementById('aspectSelect');
const cropBtn = document.getElementById('cropBtn');
const resetBtn = document.getElementById('resetBtn');

let img = new Image();
let cropArea = { x: 0, y: 0, w: 0, h: 0 };
let isDragging = false;
let startX, startY;

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
fileInput.addEventListener('change', e => handleFile(e.target.files[0]));

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = e => {
    img.src = e.target.result;
    img.onload = () => {
      canvas.width = Math.min(img.width, 800);
      canvas.height = (img.height / img.width) * canvas.width;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      cropArea = { x: 0, y: 0, w: canvas.width, h: canvas.height };
      editorArea.style.display = 'block';
      dropZone.style.display = 'none';
    };
  };
  reader.readAsDataURL(file);
}

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  isDragging = true;
});

canvas.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  cropArea.x = Math.min(startX, x);
  cropArea.y = Math.min(startY, y);
  cropArea.w = Math.abs(x - startX);
  cropArea.h = Math.abs(y - startY);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#185fa5';
  ctx.lineWidth = 2;
  ctx.strokeRect(cropArea.x, cropArea.y, cropArea.w, cropArea.h);
});

canvas.addEventListener('mouseup', () => isDragging = false);

cropBtn.addEventListener('click', () => {
  const scaleX = img.width / canvas.width;
  const scaleY = img.height / canvas.height;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = cropArea.w * scaleX;
  tempCanvas.height = cropArea.h * scaleY;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(img, cropArea.x * scaleX, cropArea.y * scaleY, cropArea.w * scaleX, cropArea.h * scaleY, 0, 0, tempCanvas.width, tempCanvas.height);
  const link = document.createElement('a');
  link.download = 'cropped-image.png';
  link.href = tempCanvas.toDataURL('image/png');
  link.click();
});

resetBtn.addEventListener('click', () => {
  editorArea.style.display = 'none';
  dropZone.style.display = 'block';
  fileInput.value = '';
});