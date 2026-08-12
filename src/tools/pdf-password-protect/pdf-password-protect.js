import { encryptPDF } from 'https://esm.sh/@pdfsmaller/pdf-encrypt-lite';

const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const fileInfoLine = document.querySelector('#fileInfoLine');
const passwordInput = document.querySelector('#passwordInput');
const confirmInput = document.querySelector('#confirmInput');
const showPwToggle = document.querySelector('#showPwToggle');
const protectBtn = document.querySelector('#protectBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');

let selectedFile = null;

function setStatus(text, type = '') {
  statusMsg.textContent = text;
  statusMsg.className = 'status-msg' + (type ? ' ' + type : '');
}

function handleFile(file) {
  if (!file || file.type !== 'application/pdf') {
    setStatus('Please select a valid PDF file.', 'error');
    return;
  }

  selectedFile = file;
  fileInfoLine.textContent = file.name;
  editorArea.style.display = 'block';
  passwordInput.value = '';
  confirmInput.value = '';
  setStatus('');
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

showPwToggle.addEventListener('change', () => {
  const type = showPwToggle.checked ? 'text' : 'password';
  passwordInput.type = type;
  confirmInput.type = type;
});

protectBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  const password = passwordInput.value;
  const confirm = confirmInput.value;

  if (!password) {
    setStatus('Please enter a password.', 'error');
    return;
  }

  if (password.length < 4) {
    setStatus('Password should be at least 4 characters.', 'error');
    return;
  }

  if (password !== confirm) {
    setStatus('Passwords do not match.', 'error');
    return;
  }

  protectBtn.disabled = true;
  setStatus('Encrypting PDF...');

  try {
    const buffer = await selectedFile.arrayBuffer();
    const encryptedBytes = await encryptPDF(new Uint8Array(buffer), password);

    const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = selectedFile.name.replace(/\.pdf$/i, '') + '-protected.pdf';
    link.click();

    setStatus('Protected PDF downloaded.', 'success');
  } catch (err) {
    setStatus('Something went wrong while encrypting this PDF.', 'error');
  } finally {
    protectBtn.disabled = false;
  }
});

resetBtn.addEventListener('click', () => {
  selectedFile = null;
  fileInput.value = '';
  passwordInput.value = '';
  confirmInput.value = '';
  editorArea.style.display = 'none';
  setStatus('');
});