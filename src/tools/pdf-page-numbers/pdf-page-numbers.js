const { PDFDocument, StandardFonts, rgb } = PDFLib;

const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const fileInfoLine = document.querySelector('#fileInfoLine');
const positionSelect = document.querySelector('#positionSelect');
const formatSelect = document.querySelector('#formatSelect');
const startNumberInput = document.querySelector('#startNumberInput');
const fontSizeInput = document.querySelector('#fontSizeInput');
const applyBtn = document.querySelector('#applyBtn');
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

function buildLabel(format, pageNumber, totalPages) {
  if (format === 'page-n') return `Page ${pageNumber}`;
  if (format === 'n-of-total') return `${pageNumber} of ${totalPages}`;
  return String(pageNumber);
}

function getXY(position, pageWidth, pageHeight, textWidth, margin) {
  const [vSide, hSide] = position.split('-'); // "bottom-center" -> ["bottom", "center"]

  let x;
  if (hSide === 'center') x = (pageWidth - textWidth) / 2;
  else if (hSide === 'left') x = margin;
  else x = pageWidth - textWidth - margin; // right

  const y = vSide === 'top' ? pageHeight - margin : margin;

  return { x, y };
}

applyBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  const startNumber = parseInt(startNumberInput.value, 10) || 1;
  const fontSize = parseInt(fontSizeInput.value, 10) || 11;
  const position = positionSelect.value;
  const format = formatSelect.value;

  applyBtn.disabled = true;
  setStatus('Adding page numbers...');

  try {
    const buffer = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;
    const margin = 30;

    pages.forEach((page, i) => {
      const pageNumber = startNumber + i;
      const label = buildLabel(format, pageNumber, startNumber + totalPages - 1);
      const textWidth = font.widthOfTextAtSize(label, fontSize);
      const { width, height } = page.getSize();
      const { x, y } = getXY(position, width, height, textWidth, margin);

      page.drawText(label, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
    });

    const outBytes = await pdfDoc.save();
    const blob = new Blob([outBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = selectedFile.name.replace(/\.pdf$/i, '') + '-numbered.pdf';
    link.click();

    setStatus('PDF with page numbers downloaded.', 'success');
  } catch (err) {
    setStatus('Something went wrong while processing this PDF.', 'error');
  } finally {
    applyBtn.disabled = false;
  }
});

resetBtn.addEventListener('click', () => {
  selectedFile = null;
  fileInput.value = '';
  editorArea.style.display = 'none';
  setStatus('');
});