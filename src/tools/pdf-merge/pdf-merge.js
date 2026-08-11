const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const fileListWrap = document.querySelector('#fileListWrap');
const fileList = document.querySelector('#fileList');
const mergeBtn = document.querySelector('#mergeBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');
const downloadArea = document.querySelector('#downloadArea');
const downloadBtn = document.querySelector('#downloadBtn');

let files = [];
let mergedBlobUrl = null;
let draggedIndex = null;

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function renderFileList() {
  if (files.length === 0) {
    fileListWrap.style.display = 'none';
    return;
  }

  fileListWrap.style.display = 'block';
  fileList.innerHTML = '';

  files.forEach((file, i) => {
    const row = document.createElement('div');
    row.className = 'file-row';
    row.draggable = true;
    row.dataset.index = i;
    row.innerHTML = `
      <span class="file-order">${i + 1}</span>
      <div class="file-info">
        <div class="file-name">${file.name}</div>
        <div class="file-size">${formatBytes(file.size)}</div>
      </div>
      <button class="file-remove" data-index="${i}">Remove</button>
    `;
    fileList.appendChild(row);
  });

  fileList.querySelectorAll('.file-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      files.splice(Number(e.target.dataset.index), 1);
      renderFileList();
    });
  });

  fileList.querySelectorAll('.file-row').forEach(row => {
    row.addEventListener('dragstart', (e) => {
      draggedIndex = Number(row.dataset.index);
      row.classList.add('dragging');
    });

    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
    });

    row.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    row.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetIndex = Number(row.dataset.index);
      if (draggedIndex === null || draggedIndex === targetIndex) return;

      const [moved] = files.splice(draggedIndex, 1);
      files.splice(targetIndex, 0, moved);
      draggedIndex = null;
      renderFileList();
    });
  });

  downloadArea.style.display = 'none';
  statusMsg.textContent = '';
}

function addFiles(newFiles) {
  const pdfFiles = Array.from(newFiles).filter(f => f.type === 'application/pdf');
  if (pdfFiles.length === 0) {
    statusMsg.textContent = 'Please select valid PDF files.';
    return;
  }
  files.push(...pdfFiles);
  renderFileList();
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
  addFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
  addFiles(e.target.files);
  fileInput.value = '';
});

mergeBtn.addEventListener('click', async () => {
  if (files.length < 2) {
    statusMsg.textContent = 'Add at least 2 PDF files to merge.';
    return;
  }

  mergeBtn.disabled = true;
  statusMsg.textContent = 'Merging PDFs...';

  try {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    mergedBlobUrl = URL.createObjectURL(blob);

    statusMsg.textContent = `Merged successfully — ${files.length} files combined.`;
    downloadArea.style.display = 'block';
  } catch (err) {
    statusMsg.textContent = 'Error merging PDFs. Make sure all files are valid PDFs.';
  }

  mergeBtn.disabled = false;
});

downloadBtn.addEventListener('click', () => {
  if (!mergedBlobUrl) return;
  const link = document.createElement('a');
  link.href = mergedBlobUrl;
  link.download = 'merged.pdf';
  link.click();
});

resetBtn.addEventListener('click', () => {
  files = [];
  mergedBlobUrl = null;
  fileInput.value = '';
  renderFileList();
});