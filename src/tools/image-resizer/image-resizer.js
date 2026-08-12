const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const editorArea = document.querySelector('#editorArea');
const fileInfoLine = document.querySelector('#fileInfoLine');
const presetSelect = document.querySelector('#presetSelect');
const widthInput = document.querySelector('#widthInput');
const heightInput = document.querySelector('#heightInput');
const aspectRatioToggle = document.querySelector('#aspectRatioToggle');
const formatSelect = document.querySelector('#formatSelect');
const qualitySlider = document.querySelector('#qualitySlider');
const qualityVal = document.querySelector('#qualityVal');
const qualityGroup = document.querySelector('#qualityGroup');
const downloadBtn = document.querySelector('#downloadBtn');
const resetBtn = document.querySelector('#resetBtn');
const statusMsg = document.querySelector('#statusMsg');
const imagePreview = document.querySelector('#imagePreview');

let originalImage = null;
let originalFileName = '';
let aspectRatio = 1;

const PRESETS = {
  'fb-profile': [180, 180],
  'fb-post': [1200, 630],
  'fb-cover': [820, 312],
  'fb-story': [1080, 1920],
  'ig-profile': [320, 320],
  'ig-square': [1080, 1080],
  'ig-portrait': [1080, 1350],
  'ig-landscape': [1080, 566],
  'ig-story': [1080, 1920],
  'yt-thumb': [1280, 720],
  'yt-banner': [2560, 1440],
  'yt-profile': [800, 800],
  'li-profile': [400, 400],
  'li-banner': [1584, 396],
  'li-post': [1200, 627],
  'tw-profile': [400, 400],
  'tw-header': [1500, 500],
  'tw-post': [1600, 900]
};

function setStatus(text, type = '') {
  statusMsg.textContent = text;
  statusMsg.className = 'status-msg' + (type ? ' ' + type : '');
}

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    setStatus('Please select a valid image file.', 'error');
    return;
  }

  originalFileName = file.name;
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      originalImage = img;
      aspectRatio = img.width / img.height;

      fileInfoLine.textContent = `${file.name} (${img.width} x ${img.height}px)`;
      widthInput.value = img.width;
      heightInput.value = img.height;
      presetSelect.value = 'custom';

      editorArea.style.display = 'block';
      setStatus('');
      updatePreview();
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function updatePreview() {
  if (!originalImage) return;

  const width = parseInt(widthInput.value) || originalImage.width;
  const height = parseInt(heightInput.value) || originalImage.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(originalImage, 0, 0, width, height);

  const format = formatSelect.value;
  const quality = parseInt(qualitySlider.value) / 100;

  imagePreview.src = canvas.toDataURL(format, quality);
}

// Event Listeners
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

presetSelect.addEventListener('change', () => {
  const preset = presetSelect.value;
  if (preset in PRESETS) {
    const [w, h] = PRESETS[preset];
    widthInput.value = w;
    heightInput.value = h;
    aspectRatioToggle.checked = false; // Disable ratio lock for explicit presets
    updatePreview();
  }
});

widthInput.addEventListener('input', () => {
  presetSelect.value = 'custom';
  if (aspectRatioToggle.checked && widthInput.value) {
    heightInput.value = Math.round(widthInput.value / aspectRatio);
  }
  updatePreview();
});

heightInput.addEventListener('input', () => {
  presetSelect.value = 'custom';
  if (aspectRatioToggle.checked && heightInput.value) {
    widthInput.value = Math.round(heightInput.value * aspectRatio);
  }
  updatePreview();
});

formatSelect.addEventListener('change', () => {
  qualityGroup.style.display = formatSelect.value === 'image/png' ? 'none' : 'flex';
  updatePreview();
});

qualitySlider.addEventListener('input', () => {
  qualityVal.textContent = qualitySlider.value + '%';
  updatePreview();
});

downloadBtn.addEventListener('click', () => {
  if (!originalImage) return;

  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);
  const format = formatSelect.value;
  const ext = format.split('/')[1];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(originalImage, 0, 0, width, height);

  const link = document.createElement('a');
  // ফাইলের নামের সাথে টুলের নাম যুক্ত করে ডাউনলোড করা
  const cleanName = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
  link.download = `${cleanName}-image-resizer.${ext}`;
  link.href = canvas.toDataURL(format, parseInt(qualitySlider.value) / 100);
  link.click();

  setStatus('Resized image downloaded successfully!', 'success');
});

resetBtn.addEventListener('click', () => {
  originalImage = null;
  fileInput.value = '';
  editorArea.style.display = 'none';
  setStatus('');
});