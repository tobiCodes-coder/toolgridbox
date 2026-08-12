import { showToast } from '/src/js/toast.js';

const text1El = document.querySelector('#text1');
const text2El = document.querySelector('#text2');
const compareBtn = document.querySelector('#compareBtn');
const modeSelect = document.querySelector('#modeSelect');
const copyBtn = document.querySelector('#copyBtn');
const clearBtn = document.querySelector('#clearBtn');
const sampleBtn = document.querySelector('#sampleBtn');
const resultDiv = document.querySelector('#result');
const statsRow = document.querySelector('#statsRow');
const addedCount = document.querySelector('#addedCount');
const removedCount = document.querySelector('#removedCount');

function splitByMode(text, mode) {
  if (mode === 'char') return text.split('');
  if (mode === 'line') return text.split('\n');
  return text.split(/(\s+)/).filter(x => x !== '');
}

function joinByMode(parts, mode) {
  return mode === 'line' ? parts.join('\n') : parts.join('');
}

// Longest Common Subsequence based diff (simple, works well for short/medium text)
function computeDiff(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result = [];
  let i = m, j = n;

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift({ type: 'same', value: a[i - 1] });
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      result.unshift({ type: 'removed', value: a[i - 1] });
      i--;
    } else {
      result.unshift({ type: 'added', value: b[j - 1] });
      j--;
    }
  }
  while (i > 0) { result.unshift({ type: 'removed', value: a[i - 1] }); i--; }
  while (j > 0) { result.unshift({ type: 'added', value: b[j - 1] }); j--; }

  return result;
}

function compareTexts() {
  const text1 = text1El.value;
  const text2 = text2El.value;
  const mode = modeSelect.value;

  if (!text1.trim() && !text2.trim()) {
    resultDiv.innerHTML = '<p style="color:#999">Enter text in both boxes to compare.</p>';
    statsRow.style.display = 'none';
    copyBtn.style.display = 'none';
    return;
  }

  const partsA = splitByMode(text1, mode);
  const partsB = splitByMode(text2, mode);
  const diff = computeDiff(partsA, partsB);

  let added = 0, removed = 0;
  const html = diff.map(part => {
    const escaped = part.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (part.type === 'added') { added++; return `<span class="diff-added">${escaped}</span>`; }
    if (part.type === 'removed') { removed++; return `<span class="diff-removed">${escaped}</span>`; }
    return escaped;
  }).join('');

  resultDiv.innerHTML = mode === 'line' ? html.replace(/\n/g, '<br>') : html;
  addedCount.textContent = added;
  removedCount.textContent = removed;
  statsRow.style.display = 'flex';
  copyBtn.style.display = 'inline-block';
}

compareBtn.addEventListener('click', compareTexts);

clearBtn.addEventListener('click', () => {
  text1El.value = '';
  text2El.value = '';
  resultDiv.innerHTML = '';
  statsRow.style.display = 'none';
  copyBtn.style.display = 'none';
});

sampleBtn.addEventListener('click', () => {
  text1El.value = 'ToolGrid is a collection of online tools.\nIt is fast and simple.';
  text2El.value = 'ToolGrid is a growing collection of free online tools.\nIt is fast, simple, and reliable.';
  compareTexts();
});

copyBtn.addEventListener('click', async () => {
  const text = resultDiv.innerText;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  } catch (err) {
    showToast('Copy failed');
  }
});

[text1El, text2El].forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      compareTexts();
    }
  });
});