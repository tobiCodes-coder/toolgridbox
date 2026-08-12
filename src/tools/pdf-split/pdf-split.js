const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const fileInfoLine = document.querySelector('#fileInfoLine');
const rangeInputs = document.querySelector('#rangeInputs');
const fromPage = document.querySelector('#fromPage');
const toPage = document.querySelector('#toPage');
const splitBtn = document.querySelector('#splitBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');
const resultList = document.querySelector('#resultList');

let currentFile = null;
let totalPages = 0;

function handleFile(file) {
  if (!file || file.type !== 'application/pdf') {
    statusMsg.textContent = 'Please select a valid PDF file.';
    return;
  }

  currentFile = file;

  file.arrayBuffer().then(async (buffer) => {
    const { PDFDocument } = PDFLib;
    const pdf = await PDFDocument.load(buffer);
    totalPages = pdf.getPageCount();

    fileInfoLine.textContent = `${file.name} — ${totalPages} pages`;
    fromPage.max = totalPages;
    toPage.max = totalPages;
    toPage.value = totalPages;

    editorArea.style.display = 'block';
    resultList.innerHTML = '';
    statusMsg.textContent = '';
  });
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

document.querySelectorAll('input[name="splitMode"]').forEach(radio => {
  radio.addEventListener('change', () => {
    rangeInputs.style.display = radio.value === 'range' && radio.checked ? 'flex' : 'none';
  });
});

async function splitAllPages() {
  const { PDFDocument } = PDFLib;
  const buffer = await currentFile.arrayBuffer();
  const srcPdf = await PDFDocument.load(buffer);

  resultList.innerHTML = '';

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(srcPdf, [i]);
    newPdf.addPage(page);
    const bytes = await newPdf.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const row = document.createElement('div');
    row.className = 'result-row';
    row.innerHTML = `<span>Page ${i + 1}</span><a href="${url}" download="page-${i + 1}.pdf">Download</a>`;
    resultList.appendChild(row);
  }
}

async function extractRange() {
  const from = Number(fromPage.value);
  const to = Number(toPage.value);

  if (from < 1 || to > totalPages || from > to) {
    statusMsg.textContent = 'Enter a valid page range.';
    return;
  }

  const { PDFDocument } = PDFLib;
  const buffer = await currentFile.arrayBuffer();
  const srcPdf = await PDFDocument.load(buffer);
  const newPdf = await PDFDocument.create();

  const indices = [];
  for (let i = from - 1; i < to; i++) indices.push(i);

  const pages = await newPdf.copyPages(srcPdf, indices);
  pages.forEach(page => newPdf.addPage(page));

  const bytes = await newPdf.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  resultList.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'result-row';
  row.innerHTML = `<span>Pages ${from}-${to}</span><a href="${url}" download="extracted-pages.pdf">Download</a>`;
  resultList.appendChild(row);
}

splitBtn.addEventListener('click', async () => {
  if (!currentFile) return;

  splitBtn.disabled = true;
  statusMsg.textContent = 'Processing...';

  try {
    const mode = document.querySelector('input[name="splitMode"]:checked').value;
    if (mode === 'all') {
      await splitAllPages();
    } else {
      await extractRange();
    }
    statusMsg.textContent = 'Done.';
  } catch (err) {
    statusMsg.textContent = 'Error processing PDF.';
  }

  splitBtn.disabled = false;
});

resetBtn.addEventListener('click', () => {
  currentFile = null;
  totalPages = 0;
  fileInput.value = '';
  editorArea.style.display = 'none';
  resultList.innerHTML = '';
  statusMsg.textContent = '';
});