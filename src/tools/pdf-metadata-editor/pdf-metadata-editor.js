const { PDFDocument } = PDFLib;

const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const fileInfoLine = document.querySelector('#fileInfoLine');

const titleInput = document.querySelector('#titleInput');
const authorInput = document.querySelector('#authorInput');
const subjectInput = document.querySelector('#subjectInput');
const keywordsInput = document.querySelector('#keywordsInput');
const creatorInput = document.querySelector('#creatorInput');
const creationDateInput = document.querySelector('#creationDateInput');
const modDateInput = document.querySelector('#modDateInput');

const saveBtn = document.querySelector('#saveBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');

let selectedFile = null;

function setStatus(text, type = '') {
  statusMsg.textContent = text;
  statusMsg.className = 'status-msg' + (type ? ' ' + type : '');
}

function toLocalInputValue(date) {
  if (!date || isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

async function loadMetadataIntoForm(file) {
  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer, { updateMetadata: false });

  titleInput.value = pdfDoc.getTitle() || '';
  authorInput.value = pdfDoc.getAuthor() || '';
  subjectInput.value = pdfDoc.getSubject() || '';
  keywordsInput.value = (pdfDoc.getKeywords() || '').toString();
  creatorInput.value = pdfDoc.getCreator() || '';
  creationDateInput.value = toLocalInputValue(pdfDoc.getCreationDate());
  modDateInput.value = toLocalInputValue(pdfDoc.getModificationDate());
}

async function handleFile(file) {
  if (!file || file.type !== 'application/pdf') {
    setStatus('Please select a valid PDF file.', 'error');
    return;
  }

  selectedFile = file;
  fileInfoLine.textContent = file.name;
  editorArea.style.display = 'block';
  setStatus('Loading metadata...');

  try {
    await loadMetadataIntoForm(file);
    setStatus('');
  } catch (err) {
    setStatus('Could not read metadata from this PDF.', 'error');
  }
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

saveBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  saveBtn.disabled = true;
  setStatus('Saving metadata...');

  try {
    const buffer = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer, { updateMetadata: false });

    pdfDoc.setTitle(titleInput.value || '');
    pdfDoc.setAuthor(authorInput.value || '');
    pdfDoc.setSubject(subjectInput.value || '');

    const keywords = keywordsInput.value
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);
    pdfDoc.setKeywords(keywords);

    pdfDoc.setCreator(creatorInput.value || '');

    if (creationDateInput.value) {
      pdfDoc.setCreationDate(new Date(creationDateInput.value));
    }
    if (modDateInput.value) {
      pdfDoc.setModificationDate(new Date(modDateInput.value));
    }

    const outBytes = await pdfDoc.save();
    const blob = new Blob([outBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = selectedFile.name.replace(/\.pdf$/i, '') + '-edited.pdf';
    link.click();

    setStatus('Updated PDF downloaded.', 'success');
  } catch (err) {
    setStatus('Something went wrong while saving metadata.', 'error');
  } finally {
    saveBtn.disabled = false;
  }
});

resetBtn.addEventListener('click', () => {
  selectedFile = null;
  fileInput.value = '';
  editorArea.style.display = 'none';
  setStatus('');
  [titleInput, authorInput, subjectInput, keywordsInput, creatorInput, creationDateInput, modDateInput]
    .forEach(input => input.value = '');
});