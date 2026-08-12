const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const fileInfoLine = document.querySelector('#fileInfoLine');
const watermarkText = document.querySelector('#watermarkText');
const fontSizeRange = document.querySelector('#fontSizeRange');
const fontSizeValue = document.querySelector('#fontSizeValue');
const opacityRange = document.querySelector('#opacityRange');
const opacityValue = document.querySelector('#opacityValue');
const colorPicker = document.querySelector('#colorPicker');
const watermarkBtn = document.querySelector('#watermarkBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');
const downloadArea = document.querySelector('#downloadArea');
const downloadBtn = document.querySelector('#downloadBtn');

let currentFile = null;
let resultBlobUrl = null;

function hexToRgb01(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

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

fontSizeRange.addEventListener('input', () => {
  fontSizeValue.textContent = fontSizeRange.value;
});

opacityRange.addEventListener('input', () => {
  opacityValue.textContent = opacityRange.value;
});

watermarkBtn.addEventListener('click', async () => {
  if (!currentFile) return;

  const text = watermarkText.value.trim();
  if (!text) {
    statusMsg.textContent = 'Enter watermark text.';
    return;
  }

  watermarkBtn.disabled = true;
  statusMsg.textContent = 'Adding watermark...';

  try {
    const { PDFDocument, rgb, degrees, StandardFonts } = PDFLib;

    const buffer = await currentFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = Number(fontSizeRange.value);
    const opacity = Number(opacityRange.value) / 100;
    const color = hexToRgb01(colorPicker.value);

    const pages = pdfDoc.getPages();
    pages.forEach(page => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      page.drawText(text, {
        x: width / 2 - textWidth / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity,
        rotate: degrees(45)
      });
    });

    const resultBytes = await pdfDoc.save();
    const blob = new Blob([resultBytes], { type: 'application/pdf' });
    resultBlobUrl = URL.createObjectURL(blob);

    statusMsg.textContent = 'Watermark added successfully.';
    downloadArea.style.display = 'block';
  } catch (err) {
    statusMsg.textContent = 'Error adding watermark.';
  }

  watermarkBtn.disabled = false;
});

downloadBtn.addEventListener('click', () => {
  if (!resultBlobUrl) return;
  const link = document.createElement('a');
  link.href = resultBlobUrl;
  link.download = 'watermarked.pdf';
  link.click();
});

resetBtn.addEventListener('click', () => {
  currentFile = null;
  resultBlobUrl = null;
  fileInput.value = '';
  editorArea.style.display = 'none';
  downloadArea.style.display = 'none';
  statusMsg.textContent = '';
});