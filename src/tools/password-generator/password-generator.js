const $ = id => document.getElementById(id);

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()-_=+[]{}<>?/|~'
};
const AMBIGUOUS = 'Il1O0o5S8B';
const WORDS = ['apple','river','stone','tiger','cloud','maple','ember','frost','grape','harbor','ivory','juniper','koala','lemon','mango','nectar','olive','pearl','quartz','raven','silver','topaz','velvet','willow','yonder','zephyr','anchor','breeze','canyon','dawn','eagle','falcon','glade','hill','iris','jade','kite','lark','meadow','north','oak','pine','quill','ridge','snow','trail','unity','vale','wave','birch','cedar','dune','elm','fern','grove','hazel','island','jasmine','kelp','lava','moss','nova','orchid','poppy','reef','sage','thyme','brook','coral','drift','echo','flint','gale','hollow','ingot','jewel','knoll','lagoon','mist','nook','onyx','prairie','quarry','rust','shell','timber','vivid','wharf','yarn','zest','alpha','brisk','charm','dusk','atlas','beacon','cinder','delta','fable','gizmo','haven','icon','jigsaw','kernel','lumen','marble','nexus','orbit','pixel','quiver','rocket','sonic','turbo','umbra','vector','widget','xenon','yield','zenith'];

const MODES = {
  random: { min: 6, max: 64, def: 16, label: 'Length' },
  pin: { min: 4, max: 12, def: 6, label: 'Digits' },
  passphrase: { min: 3, max: 8, def: 4, label: 'Words' },
  memorable: { min: 6, max: 20, def: 10, label: 'Length' }
};

let mode = 'random';
let currentPassword = '';
let history = [];
let bulkPasswords = [];

function secureRandom(max) {
  const buf = new Uint32Array(1);
  const limit = 4294967296 - (4294967296 % max);
  do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
  return buf[0] % max;
}
const pick = arr => arr[secureRandom(arr.length)];
const pickFrom = str => str[secureRandom(str.length)];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const clean = set => $('chkNoAmbiguous').checked ? set.split('').filter(c => !AMBIGUOUS.includes(c)).join('') : set;

function activeSets() {
  const sets = [];
  if ($('chkUpper').checked) sets.push(clean(CHARSETS.upper));
  if ($('chkLower').checked) sets.push(clean(CHARSETS.lower));
  if ($('chkNumber').checked) sets.push(clean(CHARSETS.number));
  if ($('chkSymbol').checked) sets.push(clean(CHARSETS.symbol));
  return sets.filter(s => s.length);
}

function genRandom(len) {
  const sets = activeSets();
  if (!sets.length) return null;
  const pool = sets.join('');
  const chars = [];
  if ($('chkGuarantee').checked) sets.forEach(s => chars.push(pickFrom(s)));
  while (chars.length < len) chars.push(pickFrom(pool));
  return shuffle(chars).join('').slice(0, len);
}

function genPin(len) {
  let out = pickFrom('123456789');
  while (out.length < len) out += pickFrom('0123456789');
  return out;
}

function genPassphrase(words) {
  const sep = $('sepSelect').value;
  const chosen = [];
  for (let i = 0; i < words; i++) {
    let w = pick(WORDS);
    if ($('chkCapitalize').checked) w = w[0].toUpperCase() + w.slice(1);
    chosen.push(w);
  }
  let out = chosen.join(sep);
  if ($('chkAddNumber').checked) out += sep + (10 + secureRandom(90));
  return out;
}

function genMemorable(len) {
  const cons = 'bcdfghjkmnprstvwz', vow = 'aeiou';
  let out = '';
  while (out.length < len) {
    out += pickFrom(cons).toUpperCase() + pickFrom(vow);
    if (out.length < len && secureRandom(4) === 0) out += pickFrom('23456789');
  }
  return out.slice(0, len);
}

function entropyFor(pw) {
  if (mode === 'pin') return pw.length * Math.log2(10);
  if (mode === 'passphrase') {
    let e = parseInt($('lengthRange').value) * Math.log2(WORDS.length);
    if ($('chkCapitalize').checked) e += parseInt($('lengthRange').value);
    if ($('chkAddNumber').checked) e += Math.log2(90);
    return e;
  }
  if (mode === 'memorable') return pw.length * 3.3;
  const pool = activeSets().join('').length;
  return pw.length * Math.log2(pool || 2);
}

function crackLabel(entropy) {
  const log10Sec = (entropy - 1) * 0.30103 - 10;
  if (log10Sec < 0) return 'cracked instantly';
  if (log10Sec < 2) return Math.round(10 ** log10Sec) + ' seconds to crack';
  if (log10Sec < 4) return Math.round(10 ** log10Sec / 60) + ' minutes to crack';
  if (log10Sec < 6) return Math.round(10 ** log10Sec / 3600) + ' hours to crack';
  if (log10Sec < 8) return Math.round(10 ** log10Sec / 86400) + ' days to crack';
  const years = 10 ** (log10Sec - 7.5);
  if (years < 1000) return Math.round(years) + ' years to crack';
  if (years < 1e6) return Math.round(years / 1000) + 'k years to crack';
  if (years < 1e9) return Math.round(years / 1e6) + ' million years to crack';
  return 'practically forever ♾️';
}

function updateStrength(pw) {
  const e = entropyFor(pw);
  const bar = $('strengthBar');
  const label = $('strengthLabel');
  let width, color, text;
  if (e < 40) { width = '25%'; color = '#dc2626'; text = 'Weak'; }
  else if (e < 65) { width = '50%'; color = '#f59e0b'; text = 'Fair'; }
  else if (e < 90) { width = '75%'; color = '#16a34a'; text = 'Strong'; }
  else { width = '100%'; color = '#185fa5'; text = 'Very strong'; }
  bar.style.width = width;
  bar.style.background = color;
  label.textContent = text;
  label.style.color = color;
  $('entropyLabel').textContent = Math.round(e) + ' bits entropy';
  $('crackLabel').textContent = crackLabel(e);
}

function setStatus(text, type = '') {
  const el = $('statusMsg');
  el.textContent = text;
  el.className = 'status-msg' + (type ? ' ' + type : '');
}

function generate() {
  const len = parseInt($('lengthRange').value);
  $('lengthValue').textContent = len;
  let pw = null;
  if (mode === 'random') pw = genRandom(len);
  else if (mode === 'pin') pw = genPin(len);
  else if (mode === 'passphrase') pw = genPassphrase(len);
  else pw = genMemorable(len);
  if (!pw) { setStatus('Select at least one character type.', 'error'); return; }
  currentPassword = pw;
  $('passwordOutput').textContent = pw;
  updateStrength(pw);
  history = [pw, ...history.filter(h => h !== pw)].slice(0, 5);
  renderList($('historyList'), history);
  setStatus('');
}

function renderList(listEl, items) {
  listEl.innerHTML = '';
  items.forEach(pw => {
    const li = document.createElement('li');
    const code = document.createElement('code');
    code.textContent = pw;
    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    btn.onclick = () => copyText(pw).then(() => { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy', 1500); });
    li.appendChild(code);
    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

async function copyText(t) {
  try { await navigator.clipboard.writeText(t); }
  catch {
    const ta = document.createElement('textarea');
    ta.value = t;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  return true;
}

function setMode(m) {
  mode = m;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  const cfg = MODES[m];
  const range = $('lengthRange');
  range.min = cfg.min;
  range.max = cfg.max;
  range.value = cfg.def;
  $('lengthLabel').textContent = cfg.label;
  $('randomOptions').style.display = m === 'random' ? 'flex' : 'none';
  $('passphraseOptions').style.display = m === 'passphrase' ? 'flex' : 'none';
  generate();
}

$('modeRow').addEventListener('click', e => {
  const btn = e.target.closest('.mode-btn');
  if (btn) setMode(btn.dataset.mode);
});

$('lengthRange').addEventListener('input', generate);
$('regenBtn').addEventListener('click', generate);
['chkUpper','chkLower','chkNumber','chkSymbol','chkNoAmbiguous','chkGuarantee','chkCapitalize','chkAddNumber'].forEach(id => $(id).addEventListener('change', generate));
$('sepSelect').addEventListener('change', generate);

$('copyBtn').addEventListener('click', () => {
  if (!currentPassword) return;
  copyText(currentPassword).then(() => setStatus('Copied to clipboard!', 'success'));
});

$('bulkBtn').addEventListener('click', () => {
  const n = Math.min(50, Math.max(1, parseInt($('bulkCount').value) || 1));
  bulkPasswords = [];
  for (let i = 0; i < n; i++) {
    const len = parseInt($('lengthRange').value);
    let pw = mode === 'random' ? genRandom(len) : mode === 'pin' ? genPin(len) : mode === 'passphrase' ? genPassphrase(len) : genMemorable(len);
    if (pw) bulkPasswords.push(pw);
  }
  renderList($('bulkList'), bulkPasswords);
  $('downloadAllBtn').style.display = bulkPasswords.length ? 'inline-block' : 'none';
  setStatus(bulkPasswords.length + ' passwords generated!', 'success');
});

$('downloadAllBtn').addEventListener('click', () => {
  const blob = new Blob([bulkPasswords.join('\n')], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = 'passwords.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
});

generate();