const $ = id => document.getElementById(id);

let mode = 'md2html';
let debounceTimer;

const EXAMPLE_MD = `# Welcome to ToolGrid

This is a **live preview** of your *Markdown* — converted to clean HTML instantly.

## Features

- **Bold**, *italic* and \`inline code\`
- [Links](https://toolgridbox.pages.dev) that work
- Lists, quotes and code blocks

> Markdown is the fastest way to write for the web.

### Code block

\`\`\`js
const tools = 31;
console.log('ToolGrid has ' + tools + ' tools');
\`\`\`

1. Write Markdown
2. Copy the HTML
3. Publish anywhere

---

Made with ❤️ by ToolGrid`;

const EXAMPLE_HTML = `<h1>Welcome to ToolGrid</h1>
<p>This HTML will be converted to <strong>clean Markdown</strong> instantly.</p>
<h2>Features</h2>
<ul>
<li>Headings become <code>#</code> symbols</li>
<li>Links become <a href="https://toolgridbox.pages.dev">readable text</a></li>
</ul>
<blockquote>Perfect for migrating blog posts.</blockquote>
<ol>
<li>Paste HTML</li>
<li>Copy Markdown</li>
</ol>`;

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const decodeEntities = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const strip = s => decodeEntities(s.replace(/<[^>]*>/g, ''));

function inline(text) {
  let t = escapeHtml(text);
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  return t;
}

function mdToHtml(md) {
  const codeBlocks = [];
  md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => {
    codeBlocks.push('<pre><code>' + escapeHtml(code) + '</code></pre>');
    return '\u0000' + (codeBlocks.length - 1) + '\u0000';
  });
  const lines = md.split('\n');
  let html = '', inList = null, inQuote = false, para = [];
  const flushPara = () => { if (para.length) { html += '<p>' + inline(para.join(' ')) + '</p>'; para = []; } };
  const closeList = () => { if (inList) { html += '</' + inList + '>'; inList = null; } };
  const closeQuote = () => { if (inQuote) { html += '</blockquote>'; inQuote = false; } };
  for (const line of lines) {
    const ph = line.match(/^\u0000(\d+)\u0000$/);
    if (ph) { flushPara(); closeList(); closeQuote(); html += codeBlocks[+ph[1]]; continue; }
    const h = line.match(/^(#{1,6})\s+(.*)/);
    if (h) { flushPara(); closeList(); closeQuote(); html += '<h' + h[1].length + '>' + inline(h[2]) + '</h' + h[1].length + '>'; continue; }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { flushPara(); closeList(); closeQuote(); html += '<hr>'; continue; }
    const ul = line.match(/^\s*[-*]\s+(.*)/);
    if (ul) { flushPara(); closeQuote(); if (inList !== 'ul') { closeList(); html += '<ul>'; inList = 'ul'; } html += '<li>' + inline(ul[1]) + '</li>'; continue; }
    const ol = line.match(/^\s*\d+\.\s+(.*)/);
    if (ol) { flushPara(); closeQuote(); if (inList !== 'ol') { closeList(); html += '<ol>'; inList = 'ol'; } html += '<li>' + inline(ol[1]) + '</li>'; continue; }
    const q = line.match(/^>\s?(.*)/);
    if (q) { flushPara(); closeList(); if (!inQuote) { html += '<blockquote>'; inQuote = true; } html += '<p>' + inline(q[1]) + '</p>'; continue; }
    if (!line.trim()) { flushPara(); closeList(); closeQuote(); continue; }
    para.push(line);
  }
  flushPara(); closeList(); closeQuote();
  return html;
}

function htmlToMd(html) {
  let s = html;
  s = s.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (m, c) => '\n```\n' + decodeEntities(c) + '\n```\n');
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (m, l, c) => '\n' + '#'.repeat(+l) + ' ' + strip(c) + '\n');
  s = s.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  s = s.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  s = s.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  s = s.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');
  s = s.replace(/<img[^>]*?src="([^"]*)"[^>]*?alt="([^"]*)"[^>]*?\/?>/gi, '![$2]($1)');
  s = s.replace(/<img[^>]*?src="([^"]*)"[^>]*?\/?>/gi, '![]($1)');
  s = s.replace(/<a[^>]*?href="([^"]*)"[^>]*?>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  s = s.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (m, inner) => { let i = 0; return '\n' + inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (mm, c) => '\n' + (++i) + '. ' + strip(c)) + '\n'; });
  s = s.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (m, inner) => '\n' + inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (mm, c) => '\n- ' + strip(c)) + '\n');
  s = s.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (m, c) => '\n' + strip(c).split('\n').filter(l => l.trim()).map(l => '> ' + l).join('\n') + '\n');
  s = s.replace(/<hr[^>]*\/?>/gi, '\n---\n');
  s = s.replace(/<br[^>]*\/?>/gi, '\n');
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (m, c) => '\n' + c + '\n');
  s = s.replace(/<[^>]+>/g, '');
  s = decodeEntities(s);
  return s.replace(/\n{3,}/g, '\n\n').trim();
}

function convert() {
  const input = $('inputArea').value;
  if (mode === 'md2html') {
    const html = mdToHtml(input);
    $('previewContent').innerHTML = html;
    $('outputArea').value = html;
  } else {
    $('outputArea').value = htmlToMd(input);
  }
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  $('statsWords').textContent = words + ' words';
  $('statsChars').textContent = input.length + ' characters';
  $('statsTime').textContent = '~' + Math.ceil(words / 200) + ' min read';
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

function setMode(m) {
  mode = m;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  const isMd = m === 'md2html';
  $('mdToolbar').style.display = isMd ? 'flex' : 'none';
  $('previewPane').style.display = isMd ? 'flex' : 'none';
  $('inputTitle').textContent = isMd ? 'Markdown' : 'HTML';
  $('outputTitle').textContent = isMd ? 'HTML Output' : 'Markdown Output';
  $('inputArea').value = '';
  $('inputArea').placeholder = isMd ? 'Type or paste your Markdown here...' : 'Paste your HTML here...';
  convert();
}

function wrapSelection(before, after) {
  const ta = $('inputArea');
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.slice(s, e) || 'text';
  ta.value = ta.value.slice(0, s) + before + sel + after + ta.value.slice(e);
  ta.focus();
  convert();
}

function prefixLines(prefix) {
  const ta = $('inputArea');
  const s = ta.selectionStart, e = ta.selectionEnd;
  const start = ta.value.lastIndexOf('\n', s - 1) + 1;
  const segment = ta.value.slice(start, e || s);
  ta.value = ta.value.slice(0, start) + segment.split('\n').map(l => prefix + l).join('\n') + ta.value.slice(e || s);
  ta.focus();
  convert();
}

document.querySelectorAll('.mode-btn').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

$('mdToolbar').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const a = btn.dataset.action;
  if (a === 'bold') wrapSelection('**', '**');
  else if (a === 'italic') wrapSelection('*', '*');
  else if (a === 'code') wrapSelection('`', '`');
  else if (a === 'link') wrapSelection('[', '](https://)');
  else if (a === 'h1') prefixLines('# ');
  else if (a === 'h2') prefixLines('## ');
  else if (a === 'ul') prefixLines('- ');
  else if (a === 'ol') prefixLines('1. ');
  else if (a === 'quote') prefixLines('> ');
});

$('inputArea').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(convert, 200);
});

$('loadExampleBtn').addEventListener('click', () => {
  $('inputArea').value = mode === 'md2html' ? EXAMPLE_MD : EXAMPLE_HTML;
  convert();
});

$('clearBtn').addEventListener('click', () => {
  $('inputArea').value = '';
  convert();
});

$('copyOutputBtn').addEventListener('click', () => {
  copyText($('outputArea').value).then(() => setStatus('Copied to clipboard!', 'success'));
});

$('downloadBtn').addEventListener('click', () => {
  const isMd = mode === 'md2html';
  const blob = new Blob([$('outputArea').value], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = isMd ? 'output.html' : 'output.md';
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
});

setMode('md2html');
$('inputArea').value = EXAMPLE_MD;
convert();