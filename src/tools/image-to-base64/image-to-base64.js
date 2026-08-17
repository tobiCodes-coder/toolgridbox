const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const resultArea = document.getElementById('resultArea');
const previewImg = document.getElementById('previewImg');
const base64Output = document.getElementById('base64Output');
const copyBtn = document.getElementById('copyBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsg = document.getElementById('statusMsg');

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
fileInput.addEventListener('change', e => handleFile(e.target.files[0]));

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

  const reader = new FileReader();
  reader.onload = e => {
    previewImg.src = e.target.result;
    base64Output.value = e.target.result;
    resultArea.style.display = 'block';
    dropZone.style.display = 'none';
    statusMsg.textContent = `${file.type} — ${formatBytes(file.size)} original, ${formatBytes(e.target.result.length)} as Base64`;
  };
  reader.readAsDataURL(file);
}

copyBtn.addEventListener('click', () => {
  if (!base64Output.value) return;
  navigator.clipboard.writeText(base64Output.value).then(() => {
    statusMsg.textContent = 'Copied to clipboard.';
  });
});

resetBtn.addEventListener('click', () => {
  resultArea.style.display = 'none';
  dropZone.style.display = 'block';
  fileInput.value = '';
  base64Output.value = '';
  statusMsg.textContent = '';
});
