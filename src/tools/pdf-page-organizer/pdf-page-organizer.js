pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const { PDFDocument, degrees } = PDFLib;

const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const pageGrid = document.querySelector('#pageGrid');
const statusMsg = document.querySelector('#statusMsg');
const addMoreBtn = document.querySelector('#addMoreBtn');
const exportBtn = document.querySelector('#exportBtn');
const clearBtn = document.querySelector('#clearBtn');

let files = [];   // { name, buffer: ArrayBuffer }
let pages = [];   // { id, fileIndex, pageIndex (0-based in file), rotation (0/90/180/270 added), thumbUrl }
let nextId = 1;
let draggedId = null;

function setStatus(text, type = '') {
  statusMsg.textContent = text;
  statusMsg.className = 'status-msg' + (type ? ' ' + type : '');
}

async function renderThumbnail(buffer, pageIndex) {
  const loadingTask = pdfjsLib.getDocument({ data: buffer.slice(0) });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageIndex + 1);
  const viewport = page.getViewport({ scale: 0.35 });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;

  return canvas.toDataURL('image/png');
}

async function addFiles(fileList) {
  const pdfFiles = Array.from(fileList).filter(f => f.type === 'application/pdf');
  if (pdfFiles.length === 0) {
    setStatus('Please select valid PDF files.', 'error');
    return;
  }

  editorArea.style.display = 'block';
  setStatus('Loading pages...');

  for (const file of pdfFiles) {
    const buffer = await file.arrayBuffer();
    const fileIndex = files.length;
    files.push({ name: file.name, buffer });

    const pdf = await pdfjsLib.getDocument({ data: buffer.slice(0) }).promise;
    const pageCount = pdf.numPages;

    for (let i = 0; i < pageCount; i++) {
      const thumbUrl = await renderThumbnail(buffer, i);
      pages.push({
        id: 'p' + nextId++,
        fileIndex,
        pageIndex: i,
        rotation: 0,
        thumbUrl,
      });
      renderGrid(); // progressive render so pages appear as they load
    }
  }

  setStatus(`${pages.length} page(s) loaded from ${files.length} file(s).`);
}

function renderGrid() {
  pageGrid.innerHTML = pages.map((p, i) => `
    <div class="page-card" draggable="true" data-id="${p.id}">
      <div class="thumb-wrap">
        <span class="page-order-badge">${i + 1}</span>
        <img src="${p.thumbUrl}" style="transform: rotate(${p.rotation}deg);" alt="Page ${i + 1}" />
      </div>
      <div class="page-label">${files[p.fileIndex].name} · p${p.pageIndex + 1}</div>
      <div class="page-actions">
        <button data-action="rotate" data-id="${p.id}">⟳ Rotate</button>
        <button data-action="delete" data-id="${p.id}">✕</button>
      </div>
    </div>
  `).join('');
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

addMoreBtn.addEventListener('click', () => fileInput.click());

clearBtn.addEventListener('click', () => {
  files = [];
  pages = [];
  pageGrid.innerHTML = '';
  editorArea.style.display = 'none';
  setStatus('');
});

// Page actions: rotate / delete
pageGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const id = btn.dataset.id;
  const page = pages.find(p => p.id === id);
  if (!page) return;

  if (btn.dataset.action === 'rotate') {
    page.rotation = (page.rotation + 90) % 360;
  } else if (btn.dataset.action === 'delete') {
    pages = pages.filter(p => p.id !== id);
  }

  renderGrid();
});

// Drag-and-drop reordering
pageGrid.addEventListener('dragstart', (e) => {
  const card = e.target.closest('.page-card');
  if (!card) return;
  draggedId = card.dataset.id;
  card.classList.add('dragging');
});

pageGrid.addEventListener('dragend', (e) => {
  const card = e.target.closest('.page-card');
  if (card) card.classList.remove('dragging');
  pageGrid.querySelectorAll('.drag-over').forEach(c => c.classList.remove('drag-over'));
});

pageGrid.addEventListener('dragover', (e) => {
  e.preventDefault();
  const card = e.target.closest('.page-card');
  if (!card || card.dataset.id === draggedId) return;
  pageGrid.querySelectorAll('.drag-over').forEach(c => c.classList.remove('drag-over'));
  card.classList.add('drag-over');
});

pageGrid.addEventListener('drop', (e) => {
  e.preventDefault();
  const targetCard = e.target.closest('.page-card');
  if (!targetCard || !draggedId || targetCard.dataset.id === draggedId) return;

  const fromIndex = pages.findIndex(p => p.id === draggedId);
  const toIndex = pages.findIndex(p => p.id === targetCard.dataset.id);
  if (fromIndex === -1 || toIndex === -1) return;

  const [moved] = pages.splice(fromIndex, 1);
  pages.splice(toIndex, 0, moved);

  draggedId = null;
  renderGrid();
});

exportBtn.addEventListener('click', async () => {
  if (pages.length === 0) {
    setStatus('Add at least one page first.', 'error');
    return;
  }

  exportBtn.disabled = true;
  setStatus('Building your PDF...');

  try {
    const mergedDoc = await PDFDocument.create();
    const sourceDocsCache = {};

    for (const p of pages) {
      if (!sourceDocsCache[p.fileIndex]) {
        sourceDocsCache[p.fileIndex] = await PDFDocument.load(files[p.fileIndex].buffer.slice(0));
      }
      const srcDoc = sourceDocsCache[p.fileIndex];
      const [copiedPage] = await mergedDoc.copyPages(srcDoc, [p.pageIndex]);

      if (p.rotation !== 0) {
        const baseAngle = copiedPage.getRotation().angle;
        copiedPage.setRotation(degrees(baseAngle + p.rotation));
      }

      mergedDoc.addPage(copiedPage);
    }

    const outBytes = await mergedDoc.save();
    const blob = new Blob([outBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'organized.pdf';
    link.click();

    setStatus('Merged PDF downloaded.', 'success');
  } catch (err) {
    setStatus('Something went wrong while exporting.', 'error');
  } finally {
    exportBtn.disabled = false;
  }
});