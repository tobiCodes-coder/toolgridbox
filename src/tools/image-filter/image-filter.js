const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const previewImg = document.querySelector('#previewImg');
const downloadBtn = document.querySelector('#downloadBtn');
const resetBtn = document.querySelector('#resetBtn');
const newImageBtn = document.querySelector('#newImageBtn');
const statusMsg = document.querySelector('#statusMsg');

const brightnessRange = document.querySelector('#brightnessRange');
const contrastRange = document.querySelector('#contrastRange');
const saturateRange = document.querySelector('#saturateRange');
const blurRange = document.querySelector('#blurRange');
const grayscaleRange = document.querySelector('#grayscaleRange');
const sepiaRange = document.querySelector('#sepiaRange');

const sliders = [
  { range: brightnessRange, display: document.querySelector('#brightnessValue') },
  { range: contrastRange, display: document.querySelector('#contrastValue') },
  { range: saturateRange, display: document.querySelector('#saturateValue') },
  { range: blurRange, display: document.querySelector('#blurValue') },
  { range: grayscaleRange, display: document.querySelector('#grayscaleValue') },
  { range: sepiaRange, display: document.querySelector('#sepiaValue') }
];

let currentFile = null;

const PRESETS = {
  none: { brightness: 100, contrast: 100, saturate: 100, blur: 0, grayscale: 0, sepia: 0 },
  bw: { brightness: 100, contrast: 110, saturate: 100, blur: 0, grayscale: 100, sepia: 0 },
  sepia: { brightness: 100, contrast: 100, saturate: 100, blur: 0, grayscale: 0, sepia: 80 },
  vintage: { brightness: 95, contrast: 90, saturate: 70, blur: 0, grayscale: 10, sepia: 30 },
  cool: { brightness: 105, contrast: 105, saturate: 120, blur: 0, grayscale: 0, sepia: 0 },
  warm: { brightness: 105, contrast: 100, saturate: 110, blur: 0, grayscale: 0, sepia: 20 }
};

function applyFilter() {
  const b = brightnessRange.value;
  const c = contrastRange.value;
  const s = saturateRange.value;
  const bl = blurRange.value;
  const g = grayscaleRange.value;
  const se = sepiaRange.value;

  previewImg.style.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) blur(${bl}px) grayscale(${g}%) sepia(${se}%)`;

  sliders.forEach(s => {
    s.display.textContent = s.range.value;
  });
}

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    statusMsg.textContent = 'Please select a valid image file.';
    return;
  }

  currentFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    editorArea.style.display = 'block';
    statusMsg.textContent = '';
  };
  reader.readAsDataURL(file);
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

sliders.forEach(s => {
  s.range.addEventListener('input', applyFilter);
});

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const preset = PRESETS[btn.dataset.preset];
    brightnessRange.value = preset.brightness;
    contrastRange.value = preset.contrast;
    saturateRange.value = preset.saturate;
    blurRange.value = preset.blur;
    grayscaleRange.value = preset.grayscale;
    sepiaRange.value = preset.sepia;

    applyFilter();
  });
});

resetBtn.addEventListener('click', () => {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  brightnessRange.value = 100;
  contrastRange.value = 100;
  saturateRange.value = 100;
  blurRange.value = 0;
  grayscaleRange.value = 0;
  sepiaRange.value = 0;
  applyFilter();
});

downloadBtn.addEventListener('click', () => {
  if (!currentFile) return;

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    ctx.filter = previewImg.style.filter;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'filtered-image.png';
      link.click();
      statusMsg.textContent = 'Downloaded.';
    }, 'image/png');
  };
  img.src = previewImg.src;
});

newImageBtn.addEventListener('click', () => {
  currentFile = null;
  fileInput.value = '';
  editorArea.style.display = 'none';
  statusMsg.textContent = '';
});