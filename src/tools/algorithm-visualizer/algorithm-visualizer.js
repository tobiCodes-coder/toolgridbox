const canvas = document.querySelector('#vizCanvas');
const ctx = canvas.getContext('2d');
const algoSelect = document.querySelector('#algoSelect');
const sizeRange = document.querySelector('#sizeRange');
const sizeValue = document.querySelector('#sizeValue');
const speedSelect = document.querySelector('#speedSelect');
const newArrayBtn = document.querySelector('#newArrayBtn');
const startBtn = document.querySelector('#startBtn');
const stopBtn = document.querySelector('#stopBtn');
const statusMsg = document.querySelector('#statusMsg');

let array = [];
let isRunning = false;
let shouldStop = false;

const COLORS = {
  default: '#185fa5',
  comparing: '#e0a800',
  sorted: '#2f8a2f'
};

function generateArray(size) {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 300) + 10);
  draw(array, [], []);
}

function draw(arr, comparing = [], sortedIndices = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / arr.length;
  const maxVal = Math.max(...arr);

  arr.forEach((val, i) => {
    const barHeight = (val / maxVal) * (canvas.height - 20);
    let color = COLORS.default;
    if (sortedIndices.includes(i)) color = COLORS.sorted;
    if (comparing.includes(i)) color = COLORS.comparing;

    ctx.fillStyle = color;
    ctx.fillRect(i * barWidth + 1, canvas.height - barHeight, barWidth - 2, barHeight);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getSpeed() {
  return Number(speedSelect.value);
}

async function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (shouldStop) return;
      draw(arr, [j, j + 1], []);
      await sleep(getSpeed());
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        draw(arr, [j, j + 1], []);
        await sleep(getSpeed());
      }
    }
  }
  draw(arr, [], arr.map((_, i) => i));
}

async function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (shouldStop) return;
      draw(arr, [minIdx, j], []);
      await sleep(getSpeed());
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    draw(arr, [i, minIdx], []);
    await sleep(getSpeed());
  }
  draw(arr, [], arr.map((_, i) => i));
}

async function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      if (shouldStop) return;
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      draw(arr, [j, j - 1], []);
      await sleep(getSpeed());
      j--;
    }
  }
  draw(arr, [], arr.map((_, i) => i));
}

async function quickSort(arr, low = 0, high = arr.length - 1) {
  if (shouldStop) return;
  if (low < high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (shouldStop) return;
      draw(arr, [j, high], []);
      await sleep(getSpeed());
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        draw(arr, [i, j], []);
        await sleep(getSpeed());
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    draw(arr, [i + 1, high], []);
    await sleep(getSpeed());

    await quickSort(arr, low, i);
    await quickSort(arr, i + 2, high);
  }
  if (low === 0 && high === arr.length - 1) {
    draw(arr, [], arr.map((_, i) => i));
  }
}

async function startSort() {
  isRunning = true;
  shouldStop = false;
  startBtn.disabled = true;
  newArrayBtn.disabled = true;
  stopBtn.disabled = false;
  statusMsg.textContent = 'Sorting...';

  const algo = algoSelect.value;
  if (algo === 'bubble') await bubbleSort(array);
  if (algo === 'selection') await selectionSort(array);
  if (algo === 'insertion') await insertionSort(array);
  if (algo === 'quick') await quickSort(array);

  isRunning = false;
  startBtn.disabled = false;
  newArrayBtn.disabled = false;
  stopBtn.disabled = true;
  statusMsg.textContent = shouldStop ? 'Stopped.' : 'Done.';
}

startBtn.addEventListener('click', startSort);

stopBtn.addEventListener('click', () => {
  shouldStop = true;
});

newArrayBtn.addEventListener('click', () => {
  if (isRunning) return;
  generateArray(Number(sizeRange.value));
  statusMsg.textContent = '';
});

sizeRange.addEventListener('input', () => {
  sizeValue.textContent = sizeRange.value;
  if (!isRunning) generateArray(Number(sizeRange.value));
});

generateArray(Number(sizeRange.value));