pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const fileInfoLine = document.querySelector('#fileInfoLine');
const copyBtn = document.querySelector('#copyBtn');
const downloadBtn = document.querySelector('#downloadBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');
const textOutput = document.querySelector('#textOutput');

let extractedText = '';

async function extractText(file) {
  statusMsg.textContent = 'Extracting text...';
  textOutput.textContent = '';

  try {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    extractedText = fullText.trim();
    textOutput.textContent = extractedText || 'No selectable text found in this PDF.';
    statusMsg.textContent = `Extracted text from ${pdf.numPages} page(s).`;
  } catch (err) {
    statusMsg.textContent = 'Error reading PDF.';
  }
}

function handleFile(file) {
  if (!file || file.type !== 'application/pdf') {
    statusMsg.textContent = 'Please select a valid PDF file.';
    return;
  }

  fileInfoLine.textContent = file.name;
  editorArea.style.display = 'block';
  extractText(file);
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

copyBtn.addEventListener('click', () => {
  if (!extractedText) return;
  navigator.clipboard.writeText(extractedText).then(() => {
    statusMsg.textContent = 'Copied to clipboard.';
  });
});

downloadBtn.addEventListener('click', () => {
  if (!extractedText) return;
  const blob = new Blob([extractedText], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'extracted-text.txt';
  link.click();
});

resetBtn.addEventListener('click', () => {
  extractedText = '';
  fileInput.value = '';
  editorArea.style.display = 'none';
  textOutput.textContent = '';
  statusMsg.textContent = '';
});