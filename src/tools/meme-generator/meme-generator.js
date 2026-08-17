const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const editorArea = document.getElementById('editorArea');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const textColor = document.getElementById('textColor');
const strokeColor = document.getElementById('strokeColor');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

let img = new Image();

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
fileInput.addEventListener('change', e => handleFile(e.target.files[0]));

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = e => {
    img = new Image();
    img.onload = () => {
      const maxWidth = 700;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      editorArea.style.display = 'block';
      dropZone.style.display = 'none';
      drawMeme();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  words.forEach(word => {
    const testLine = line ? line + ' ' + word : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function drawStrokedText(lines, startY, lineHeight) {
  lines.forEach((line, i) => {
    const y = startY + i * lineHeight;
    ctx.strokeText(line, canvas.width / 2, y);
    ctx.fillText(line, canvas.width / 2, y);
  });
}

function drawMeme() {
  if (!img.src) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const fontSize = Math.max(24, canvas.width * 0.07);
  ctx.font = `700 ${fontSize}px Impact, "Arial Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = textColor.value;
  ctx.strokeStyle = strokeColor.value;
  ctx.lineWidth = fontSize / 12;
  ctx.lineJoin = 'round';

  const maxTextWidth = canvas.width * 0.9;
  const lineHeight = fontSize * 1.1;

  if (topText.value.trim()) {
    const lines = wrapText(topText.value.trim().toUpperCase(), maxTextWidth);
    drawStrokedText(lines, fontSize + 8, lineHeight);
  }

  if (bottomText.value.trim()) {
    const lines = wrapText(bottomText.value.trim().toUpperCase(), maxTextWidth);
    const startY = canvas.height - (lines.length - 1) * lineHeight - 16;
    drawStrokedText(lines, startY, lineHeight);
  }
}

[topText, bottomText, textColor, strokeColor].forEach(el => {
  el.addEventListener('input', drawMeme);
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

resetBtn.addEventListener('click', () => {
  editorArea.style.display = 'none';
  dropZone.style.display = 'block';
  fileInput.value = '';
  topText.value = '';
  bottomText.value = '';
  img = new Image();
});
