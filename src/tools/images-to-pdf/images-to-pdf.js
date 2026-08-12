const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const imageList = document.querySelector('#imageList');
const pageSizeSelect = document.querySelector('#pageSizeSelect');
const convertBtn = document.querySelector('#convertBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');
const downloadArea = document.querySelector('#downloadArea');
const downloadBtn = document.querySelector('#downloadBtn');

let images = [];
let pdfBlobUrl = null;
let draggedIndex = null;

function renderList() {
  if (images.length === 0) {
    editorArea.style.display = 'none';
    return;
  }

  editorArea.style.display = 'block';
  imageList.innerHTML = '';

  images.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'image-item';
    item.draggable = true;
    item.dataset.index = i;
    item.innerHTML = `
      <span class="order-badge">${i + 1}</span>
      <img src="${img.previewUrl}" />
      <button class="remove-btn" data-index="${i}">Remove</button>
    `;
    imageList.appendChild(item);
  });

  imageList.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      images.splice(Number(e.target.dataset.index), 1);
      renderList();
    });
  });

  imageList.querySelectorAll('.image-item').forEach(item => {
    item.addEventListener('dragstart', () => {
      draggedIndex = Number(item.dataset.index);
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });

    item.addEventListener('dragover', (e) => e.preventDefault());

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetIndex = Number(item.dataset.index);
      if (draggedIndex === null || draggedIndex === targetIndex) return;
      const [moved] = images.splice(draggedIndex, 1);
      images.splice(targetIndex, 0, moved);
      draggedIndex = null;
      renderList();
    });
  });

  downloadArea.style.display = 'none';
  statusMsg.textContent = '';
}

function addFiles(fileList) {
  const validFiles = Array.from(fileList).filter(f => f.type === 'image/jpeg' || f.type === 'image/png');
  if (validFiles.length === 0) {
    statusMsg.textContent = 'Please select valid JPG or PNG images.';
    return;
  }

  validFiles.forEach(file => {
    images.push({ file, previewUrl: URL.createObjectURL(file) });
  });

  renderList();
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

convertBtn.addEventListener('click', async () => {
  if (images.length === 0) return;

  convertBtn.disabled = true;
  statusMsg.textContent = 'Converting...';

  try {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const pageSize = pageSizeSelect.value;

    for (const img of images) {
      const bytes = await img.file.arrayBuffer();
      const embedded = img.file.type === 'image/png'
        ? await pdfDoc.embedPng(bytes)
        : await pdfDoc.embedJpg(bytes);

      let pageWidth = embedded.width;
      let pageHeight = embedded.height;

      if (pageSize === 'a4') {
        pageWidth = 595.28;
        pageHeight = 841.89;
      }

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      if (pageSize === 'a4') {
        const scale = Math.min(pageWidth / embedded.width, pageHeight / embedded.height);
        const drawWidth = embedded.width * scale;
        const drawHeight = embedded.height * scale;
        page.drawImage(embedded, {
          x: (pageWidth - drawWidth) / 2,
          y: (pageHeight - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight
        });
      } else {
        page.drawImage(embedded, { x: 0, y: 0, width: pageWidth, height: pageHeight });
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    pdfBlobUrl = URL.createObjectURL(blob);

    statusMsg.textContent = `Converted ${images.length} images to PDF.`;
    downloadArea.style.display = 'block';
  } catch (err) {
    statusMsg.textContent = 'Error converting images. Make sure all files are valid JPG or PNG.';
  }

  convertBtn.disabled = false;
});

downloadBtn.addEventListener('click', () => {
  if (!pdfBlobUrl) return;
  const link = document.createElement('a');
  link.href = pdfBlobUrl;
  link.download = 'images.pdf';
  link.click();
});

resetBtn.addEventListener('click', () => {
  images = [];
  pdfBlobUrl = null;
  fileInput.value = '';
  renderList();
});