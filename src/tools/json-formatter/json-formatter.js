const jsonInput = document.querySelector('#jsonInput');
const jsonOutput = document.querySelector('#jsonOutput');
const errorBox = document.querySelector('#errorBox');
const formatBtn = document.querySelector('#formatBtn');
const minifyBtn = document.querySelector('#minifyBtn');
const copyBtn = document.querySelector('#copyBtn');
const clearBtn = document.querySelector('#clearBtn');
const sampleBtn = document.querySelector('#sampleBtn');
const indentSelect = document.querySelector('#indentSelect');
const statusMsg = document.querySelector('#statusMsg');

const sampleJSON = {
  name: "ToolGrid",
  type: "developer tools",
  tools: ["json-formatter", "qr-generator", "image-compressor"],
  active: true
};

function getIndent() {
  const val = indentSelect.value;
  return val === 'tab' ? '\t' : Number(val);
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = 'block';
  jsonOutput.textContent = '';
  statusMsg.textContent = '';
}

function hideError() {
  errorBox.style.display = 'none';
}

function findErrorPosition(text, error) {
  const match = error.message.match(/position (\d+)/);
  if (!match) return '';

  const pos = Number(match[1]);
  const lines = text.slice(0, pos).split('\n');
  const line = lines.length;
  const col = lines[lines.length - 1].length + 1;
  return ` (line ${line}, column ${col})`;
}

function formatJSON() {
  const text = jsonInput.value.trim();

  if (!text) {
    showError('Input is empty.');
    return;
  }

  try {
    const parsed = JSON.parse(text);
    const formatted = JSON.stringify(parsed, null, getIndent());
    jsonOutput.textContent = formatted;
    hideError();
    statusMsg.textContent = 'Valid JSON, formatted successfully.';
  } catch (err) {
    const posInfo = findErrorPosition(text, err);
    showError(`Invalid JSON: ${err.message}${posInfo}`);
  }
}

function minifyJSON() {
  const text = jsonInput.value.trim();

  if (!text) {
    showError('Input is empty.');
    return;
  }

  try {
    const parsed = JSON.parse(text);
    const minified = JSON.stringify(parsed);
    jsonOutput.textContent = minified;
    hideError();
    statusMsg.textContent = 'Valid JSON, minified successfully.';
  } catch (err) {
    const posInfo = findErrorPosition(text, err);
    showError(`Invalid JSON: ${err.message}${posInfo}`);
  }
}

formatBtn.addEventListener('click', formatJSON);
minifyBtn.addEventListener('click', minifyJSON);

clearBtn.addEventListener('click', () => {
  jsonInput.value = '';
  jsonOutput.textContent = '';
  hideError();
  statusMsg.textContent = '';
});

sampleBtn.addEventListener('click', () => {
  jsonInput.value = JSON.stringify(sampleJSON);
  formatJSON();
});

copyBtn.addEventListener('click', async () => {
  const text = jsonOutput.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    statusMsg.textContent = 'Copied to clipboard.';
  } catch (err) {
    statusMsg.textContent = 'Copy failed.';
  }
});

indentSelect.addEventListener('change', () => {
  if (jsonOutput.textContent) formatJSON();
});