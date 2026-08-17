import beautify from 'https://esm.sh/js-beautify';

const $ = id => document.getElementById(id);

let lang = 'css';
let action = 'minify';
let debounceTimer;

const SAMPLE_CSS = `/* Sample stylesheet */
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.card:hover {
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .card {
    padding: 16px;
  }
}`;

const SAMPLE_JS = `// Sample function
function greet(name) {
  const message = "Hello, " + name + "!";
  console.log(message);
  return message;
}

greet("ToolGrid");`;

const sizeOf = s => new Blob([s]).size;
const fmt = b => b < 1024 ? b + ' B' : (b / 1024).toFixed(2) + ' KB';

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function basicMinifyJs(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,=])\s*/g, '$1')
    .trim();
}

async function minifyJs(code) {
  try {
    const { minify } = await import('https://esm.sh/terser');
    const result = await minify(code, { compress: false, mangle: false, format: { comments: false } });
    return result.code;
  } catch {
    return basicMinifyJs(code);
  }
}

async function convert() {
  const input = $('inputArea').value;
  if (!input.trim()) {
    $('outputArea').value = '';
    $('statOrig').textContent = 'Original: 0 B';
    $('statNew').textContent = 'Output: 0 B';
    $('statSaved').textContent = '—';
    return;
  }
  try {
    let out = '';
    if (lang === 'css') {
      out = action === 'minify' ? minifyCss(input) : beautify.css(input, { indent_size: 2 });
    } else {
      out = action === 'minify' ? await minifyJs(input) : beautify.js(input, { indent_size: 2 });
    }
    $('outputArea').value = out;
    const orig = sizeOf(input), now = sizeOf(out);
    $('statOrig').textContent = 'Original: ' + fmt(orig);
    $('statNew').textContent = 'Output: ' + fmt(now);
    if (action === 'minify' && orig > 0) {
      const saved = Math.max(0, Math.round((1 - now / orig) * 100));
      $('statSaved').textContent = '⚡ ' + saved + '% smaller';
    } else {
      $('statSaved').textContent = '✨ formatted';
    }
    setStatus('');
  } catch (err) {
    setStatus('Error: check your code syntax.', 'error');
    console.error(err);
  }
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
    ta.value = t;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

$('langRow').addEventListener('click', e => {
  const btn = e.target.closest('.mode-btn');
  if (!btn) return;
  lang = btn.dataset.lang;
  document.querySelectorAll('#langRow .mode-btn').forEach(b => b.classList.toggle('active', b === btn));
  convert();
});

$('actionRow').addEventListener('click', e => {
  const btn = e.target.closest('.mode-btn');
  if (!btn) return;
  action = btn.dataset.action;
  document.querySelectorAll('#actionRow .mode-btn').forEach(b => b.classList.toggle('active', b === btn));
  convert();
});

$('inputArea').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(convert, 300);
});

$('sampleBtn').addEventListener('click', () => {
  $('inputArea').value = lang === 'css' ? SAMPLE_CSS : SAMPLE_JS;
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
  const ext = lang === 'css' ? 'css' : 'js';
  const blob = new Blob([$('outputArea').value], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = (action === 'minify' ? 'min.' : 'beautified.') + ext;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
});

convert();