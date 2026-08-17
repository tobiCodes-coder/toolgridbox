import { toPng, toBlob } from 'https://esm.sh/html-to-image';

const $ = id => document.getElementById(id);

const THEMES = {
  dracula: { bg: '#282a36', fg: '#f8f8f2', header: '#21222c', c: '#6272a4', s: '#f1fa8c', k: '#ff79c6', n: '#bd93f9', f: '#50fa7b' },
  github: { bg: '#0d1117', fg: '#c9d1d9', header: '#161b22', c: '#8b949e', s: '#a5d6ff', k: '#ff7b72', n: '#79c0ff', f: '#d2a8ff' },
  monokai: { bg: '#272822', fg: '#f8f8f2', header: '#1e1f1c', c: '#75715e', s: '#e6db74', k: '#f92672', n: '#ae81ff', f: '#a6e22e' },
  light: { bg: '#ffffff', fg: '#24292e', header: '#f6f8fa', c: '#6a737d', s: '#032f62', k: '#d73a49', n: '#005cc5', f: '#6f42c1' }
};

const SAMPLE = `// Generate a strong password
function generatePassword(length = 16) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

console.log("Your password:", generatePassword(20));`;

const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function buildRegex(lang) {
  let comment, keywords;
  if (lang === 'python') {
    comment = '#[^\\n]*';
    keywords = 'def|print|None|True|False|self|if|elif|else|for|while|import|from|return|class|try|except|lambda|with|as|in|not|and|or|pass|raise';
  } else if (lang === 'html') {
    comment = '&lt;!--[\\s\\S]*?--&gt;';
    keywords = 'div|span|header|footer|main|section|article|button|input|script|style|body|html|head|meta|link|a|img|ul|ol|li|p|h1|h2|h3';
  } else if (lang === 'css') {
    comment = '\\/\\*[\\s\\S]*?\\*\\/';
    keywords = 'display|flex|grid|margin|padding|color|background|border|radius|font|size|weight|position|absolute|relative|width|height|transition|transform|box-shadow';
  } else if (lang === 'text') {
    return null;
  } else {
    comment = '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/';
    keywords = 'const|let|var|function|return|if|else|for|while|class|import|from|export|default|async|await|try|catch|throw|new|typeof|switch|case|break|continue|of|in';
  }
  const string = '"(?:[^"\\\\\\n]|\\\\.)*"|\'(?:[^\'\\\\\\n]|\\\\.)*\'|`(?:[^`\\\\]|\\\\.)*`';
  const num = '\\b\\d+(?:\\.\\d+)?\\b';
  const func = '[A-Za-z_]\\w*(?=\\()';
  return new RegExp('(' + comment + ')|(' + string + ')|\\b(' + keywords + ')\\b|(' + num + ')|(' + func + ')', 'g');
}

function highlight(code, lang) {
  const esc = escapeHtml(code);
  const re = buildRegex(lang);
  if (!re) return esc;
  return esc.replace(re, (m, c, s, k, n, f) => {
    const cls = c ? 'tok-c' : s ? 'tok-s' : k ? 'tok-k' : n ? 'tok-n' : 'tok-f';
    return '<span class="' + cls + '">' + m + '</span>';
  });
}

function render() {
  const theme = THEMES[$('themeSelect').value];
  const card = $('previewCard');
  card.style.background = theme.bg;
  card.style.color = theme.fg;
  card.style.setProperty('--tok-c', theme.c);
  card.style.setProperty('--tok-s', theme.s);
  card.style.setProperty('--tok-k', theme.k);
  card.style.setProperty('--tok-n', theme.n);
  card.style.setProperty('--tok-f', theme.f);
  const header = $('cardHeader');
  header.style.display = $('windowSelect').value === 'none' ? 'none' : 'flex';
  header.style.background = theme.header;
  header.style.color = theme.fg;
  $('fileName').textContent = $('filenameInput').value || 'snippet';
  const pre = $('previewCode');
  pre.style.fontSize = $('fontRange').value + 'px';
  pre.style.padding = $('padRange').value + 'px';
  $('fontValue').textContent = $('fontRange').value;
  $('padValue').textContent = $('padRange').value;
  pre.innerHTML = highlight($('codeInput').value || '// Your code preview', $('langSelect').value);
}

function setStatus(text, type = '') {
  const el = $('statusMsg');
  el.textContent = text;
  el.className = 'status-msg' + (type ? ' ' + type : '');
}

$('codeInput').addEventListener('input', render);
['themeSelect','langSelect','windowSelect','filenameInput','fontRange','padRange'].forEach(id => $(id).addEventListener('input', render));

$('downloadBtn').addEventListener('click', async () => {
  setStatus('Rendering image...');
  try {
    const dataUrl = await toPng($('previewCard'), { pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = ($('filenameInput').value || 'code') + '.png';
    link.href = dataUrl;
    link.click();
    setStatus('PNG downloaded!', 'success');
  } catch (err) {
    setStatus('Export failed: ' + err.message, 'error');
  }
});

$('copyImgBtn').addEventListener('click', async () => {
  try {
    const blob = await toBlob($('previewCard'), { pixelRatio: 2 });
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    setStatus('Image copied to clipboard!', 'success');
  } catch {
    setStatus('Copy not supported here — use Download instead.', 'error');
  }
});

$('sampleBtn').addEventListener('click', () => {
  $('codeInput').value = SAMPLE;
  render();
});

$('codeInput').value = SAMPLE;
render();