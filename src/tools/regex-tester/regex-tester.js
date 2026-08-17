const $ = id => document.getElementById(id);

let debounceTimer;
const STORAGE_KEY = 'toolgrid_regex_saved';

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveSaved(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function setStatus(text, type = '') {
  const el = $('statusMsg');
  el.textContent = text;
  el.className = 'status-msg' + (type ? ' ' + type : '');
}

function syncFlagsFromChips() {
  const flags = [...document.querySelectorAll('.flag-chips input:checked')]
    .map(cb => cb.dataset.flag).join('');
  $('flagsInput').value = flags;
}

function syncChipsFromFlags() {
  const flags = $('flagsInput').value;
  document.querySelectorAll('.flag-chips input').forEach(cb => {
    cb.checked = flags.includes(cb.dataset.flag);
  });
}

function buildRegex() {
  const pattern = $('regexInput').value;
  const flags = $('flagsInput').value;
  if (!pattern) return null;
  try {
    return new RegExp(pattern, flags);
  } catch (err) {
    setStatus('Invalid regex: ' + err.message, 'error');
    return null;
  }
}

function runTest() {
  const text = $('testText').value;
  const re = buildRegex();
  const output = $('highlightedOutput');
  const matchesList = $('matchesList');
  
  if (!re) {
    output.innerHTML = escapeHtml(text);
    $('matchCount').textContent = '0 matches';
    matchesList.innerHTML = '';
    return;
  }

  const matches = [];
  let m;
  const hasGlobal = re.flags.includes('g');
  
  if (hasGlobal) {
    while ((m = re.exec(text)) !== null) {
      matches.push({ index: m.index, value: m[0], groups: m.slice(1) });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  } else {
    m = re.exec(text);
    if (m) matches.push({ index: m.index, value: m[0], groups: m.slice(1) });
  }

  $('matchCount').textContent = matches.length + ' match' + (matches.length !== 1 ? 'es' : '');
  setStatus('');

  let html = '';
  let lastIdx = 0;
  for (const match of matches) {
    html += escapeHtml(text.slice(lastIdx, match.index));
    html += '<span class="match">' + escapeHtml(match.value) + '</span>';
    lastIdx = match.index + match.value.length;
  }
  html += escapeHtml(text.slice(lastIdx));
  output.innerHTML = html || '<em style="color:var(--color-text-3)">No matches</em>';

  matchesList.innerHTML = '';
  matches.forEach((match, i) => {
    const item = document.createElement('div');
    item.className = 'match-item';
    const idx = '<span class="match-index">[' + i + ']</span>';
    const val = '<span class="match-value">' + escapeHtml(match.value) + '</span>';
    let groups = '';
    if (match.groups.length) {
      groups = '<div class="match-groups">' + match.groups.map((g, j) => 
        '<span>$' + (j + 1) + ' = ' + escapeHtml(g ?? '(undefined)') + '</span>'
      ).join('') + '</div>';
    }
    item.innerHTML = idx + val + groups;
    matchesList.appendChild(item);
  });

  if (!matches.length) {
    matchesList.innerHTML = '<div style="padding:12px;color:var(--color-text-3);text-align:center;font-size:var(--text-sm)">No matches found</div>';
  }
}

function replaceAll() {
  const re = buildRegex();
  if (!re) return;
  const text = $('testText').value;
  const replacement = $('replaceInput').value;
  try {
    $('replaceOutput').value = text.replace(re, replacement);
    setStatus('Replaced successfully!', 'success');
  } catch (err) {
    setStatus('Replace failed: ' + err.message, 'error');
  }
}

async function copyText(t) {
  try { await navigator.clipboard.writeText(t); }
  catch {
    const ta = document.createElement('textarea');
    ta.value = t; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
  }
}

function renderSaved() {
  const list = getSaved();
  const card = $('savedCard');
  const el = $('savedList');
  if (!list.length) { card.style.display = 'none'; return; }
  card.style.display = 'block';
  el.innerHTML = '';
  list.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'saved-item';
    const code = document.createElement('code');
    code.textContent = '/' + item.pattern + '/' + item.flags;
    code.onclick = () => {
      $('regexInput').value = item.pattern;
      $('flagsInput').value = item.flags;
      syncChipsFromFlags();
      runTest();
    };
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => {
      const updated = getSaved();
      updated.splice(i, 1);
      saveSaved(updated);
      renderSaved();
    };
    div.appendChild(code);
    div.appendChild(btn);
    el.appendChild(div);
  });
}

function explainRegex(pattern) {
  const parts = [];
  const rules = [
    { re: /\\d/g, text: 'any digit' },
    { re: /\\D/g, text: 'non-digit' },
    { re: /\\w/g, text: 'word char [a-zA-Z0-9_]' },
    { re: /\\W/g, text: 'non-word char' },
    { re: /\\s/g, text: 'whitespace' },
    { re: /\\S/g, text: 'non-whitespace' },
    { re: /\\b/g, text: 'word boundary' },
    { re: /\\B/g, text: 'non-word boundary' },
    { re: /\^/g, text: 'start of string' },
    { re: /\$/g, text: 'end of string' },
    { re: /\./g, text: 'any character' },
    { re: /\*/g, text: '0 or more' },
    { re: /\+/g, text: '1 or more' },
    { re: /\?/g, text: '0 or 1' },
    { re: /\{(\d+)(?:,(\d*))?\}/g, text: 'specific count' }
  ];
  let explanation = pattern;
  rules.forEach(r => {
    explanation = explanation.replace(r.re, '【' + r.text + '】');
  });
  alert('Regex breakdown:\n\n' + pattern + '\n\n' + explanation);
}

$('regexInput').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runTest, 200);
});
$('testText').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runTest, 200);
});
$('flagsInput').addEventListener('input', () => {
  syncChipsFromFlags();
  runTest();
});
document.querySelectorAll('.flag-chips input').forEach(cb => {
  cb.addEventListener('change', () => {
    syncFlagsFromChips();
    runTest();
  });
});

$('copyRegexBtn').addEventListener('click', () => {
  const p = $('regexInput').value, f = $('flagsInput').value;
  if (!p) return;
  copyText('/' + p + '/' + f).then(() => setStatus('Copied: /' + p + '/' + f, 'success'));
});

$('saveBtn').addEventListener('click', () => {
  const pattern = $('regexInput').value, flags = $('flagsInput').value;
  if (!pattern) { setStatus('Nothing to save', 'error'); return; }
  const list = getSaved();
  if (list.some(s => s.pattern === pattern && s.flags === flags)) {
    setStatus('Already saved', 'success');
    return;
  }
  list.push({ pattern, flags });
  saveSaved(list);
  renderSaved();
  setStatus('Pattern saved!', 'success');
});

$('presetSelect').addEventListener('change', e => {
  const v = e.target.value;
  if (!v) return;
  const [p, f] = v.split('|');
  $('regexInput').value = p;
  $('flagsInput').value = f;
  syncChipsFromFlags();
  runTest();
  e.target.selectedIndex = 0;
});

$('explainBtn').addEventListener('click', () => explainRegex($('regexInput').value));
$('clearTextBtn').addEventListener('click', () => { $('testText').value = ''; runTest(); });
$('clearSavedBtn').addEventListener('click', () => { saveSaved([]); renderSaved(); });
$('replaceBtn').addEventListener('click', replaceAll);
$('replaceInput').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(replaceAll, 200);
});
$('copyResultBtn').addEventListener('click', () => {
  if (!$('replaceOutput').value) return;
  copyText($('replaceOutput').value).then(() => setStatus('Result copied!', 'success'));
});
$('exportBtn').addEventListener('click', () => {
  const items = [...document.querySelectorAll('.match-item')].map(el => el.innerText);
  if (!items.length) { setStatus('No matches to export', 'error'); return; }
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.download = 'regex-matches.json';
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
});

runTest();
renderSaved();