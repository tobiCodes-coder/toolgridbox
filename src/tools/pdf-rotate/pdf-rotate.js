const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const fileInfoLine = document.querySelector('#fileInfoLine');
const rotateBtn = document.querySelector('#rotateBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');
const downloadArea = document.querySelector('#downloadArea');
const downloadBtn = document.querySelector('#downloadBtn');

let currentFile = null;
let rotatedBlobUrl = null;

function handleFile(file) {
  if (!file || file.type !== 'application/pdf') {
    statusMsg.textContent = 'Please select a valid PDF file.';
    return;
  }

  currentFile = file;
  fileInfoLine.textContent = file.name;
  editorArea.style.display = 'block';
  downloadArea.style.display = 'none';
  statusMsg.textContent = '';
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

rotateBtn.addEventListener('click', async () => {
  if (!currentFile) return;

  rotateBtn.disabled = true;
  statusMsg.textContent = 'Rotating...';

  try {
    const { PDFDocument, degrees } = PDFLib;
    const angle = Number(document.querySelector('input[name="angle"]:checked').value);

    const buffer = await currentFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + angle));
    });

    const rotatedBytes = await pdfDoc.save();
    const blob = new Blob([rotatedBytes], { type: 'application/pdf' });
    rotatedBlobUrl = URL.createObjectURL(blob);

    statusMsg.textContent = 'Rotated successfully.';
    downloadArea.style.display = 'block';
  } catch (err) {
    statusMsg.textContent = 'Error rotating PDF.';
  }

  rotateBtn.disabled = false;
});

downloadBtn.addEventListener('click', () => {
  if (!rotatedBlobUrl) return;
  const link = document.createElement('a');
  link.href = rotatedBlobUrl;
  link.download = 'rotated.pdf';
  link.click();
});

resetBtn.addEventListener('click', () => {
  currentFile = null;
  rotatedBlobUrl = null;
  fileInput.value = '';
  editorArea.style.display = 'none';
  downloadArea.style.display = 'none';
  statusMsg.textContent = '';
});