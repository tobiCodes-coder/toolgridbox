const $ = id => document.getElementById(id);

let activeCase = 'upper';

const splitWords = s => s.trim().split(/[^A-Za-z0-9À-ÿ]+/).filter(Boolean);
const cap = w => w[0].toUpperCase() + w.slice(1).toLowerCase();

const CASES = {
  upper: s => s.toUpperCase(),
  lower: s => s.toLowerCase(),
  title: s => s.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase()),
  sentence: s => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()),
  camel: s => splitWords(s).map((w, i) => i === 0 ? w.toLowerCase() : cap(w)).join(''),
  pascal: s => splitWords(s).map(cap).join(''),
  snake: s => splitWords(s).join('_').toLowerCase(),
  kebab: s => splitWords(s).join('-').toLowerCase(),
  constant: s => splitWords(s).join('_').toUpperCase(),
  train: s => splitWords(s).map(cap).join('-'),
  dot: s => splitWords(s).join('.').toLowerCase(),
  alternating: s => s.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join(''),
  swap: s => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
};

function updateStats() {
  const s = $('inputArea').value;
  $('statChars').textContent = s.length + ' characters';
  $('statCharsNoSpace').textContent = s.replace(/\s/g, '').length + ' (no spaces)';
  $('statWords').textContent = (s.trim() ? s.trim().split(/\s+/).length : 0) + ' words';
  $('statSentences').textContent = (s.match(/[.!?]+/g) || []).length + ' sentences';
  $('statLines').textContent = (s ? s.split('\n').length : 0) + ' lines';
}

function convert() {
  $('outputArea').value = CASES[activeCase]($('inputArea').value);
  updateStats();
}

function setStatus(text, type = '') {
  const el = $('statusMsg');
  el.textContent = text;
  el.className = 'status-msg' + (type ? ' ' + type : '');
}

async function copyText(t) {
  try { await navigator.clipboard.writeText(t); }
  catch {
    const ta = document.createElement('textarea');
    ta.value = t; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
  }
}

$('caseGrid').addEventListener('click', e => {
  const btn = e.target.closest('.case-btn');
  if (!btn) return;
  activeCase = btn.dataset.case;
  document.querySelectorAll('.case-btn').forEach(b => b.classList.toggle('active', b === btn));
  convert();
});

$('inputArea').addEventListener('input', convert);

$('sampleBtn').addEventListener('click', () => {
  $('inputArea').value = 'the quick brown fox jumps over the lazy dog. toolGrid makes TEXT conversion easy!';
  convert();
});

$('clearBtn').addEventListener('click', () => {
  $('inputArea').value = '';
  convert();
});

$('copyBtn').addEventListener('click', () => {
  if (!$('outputArea').value) return;
  copyText($('outputArea').value).then(() => setStatus('Copied to clipboard!', 'success'));
});

$('downloadBtn').addEventListener('click', () => {
  if (!$('outputArea').value) return;
  const blob = new Blob([$('outputArea').value], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = activeCase + '-case.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
});

$('swapBtn').addEventListener('click', () => {
  $('inputArea').value = $('outputArea').value;
  convert();
});

convert();