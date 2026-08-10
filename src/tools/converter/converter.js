const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const statusMsg = document.querySelector('#statusMsg');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`#${btn.dataset.tab}Tab`).classList.add('active');
    statusMsg.textContent = '';
  });
});

function copyText(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    statusMsg.textContent = 'Copied to clipboard.';
  }).catch(() => {
    statusMsg.textContent = 'Copy failed.';
  });
}

// --- Base64 ---
const base64Input = document.querySelector('#base64Input');
const base64Output = document.querySelector('#base64Output');

document.querySelector('#base64EncodeBtn').addEventListener('click', () => {
  try {
    base64Output.textContent = btoa(unescape(encodeURIComponent(base64Input.value)));
  } catch (err) {
    base64Output.textContent = 'Error encoding text.';
  }
});

document.querySelector('#base64DecodeBtn').addEventListener('click', () => {
  try {
    base64Output.textContent = decodeURIComponent(escape(atob(base64Input.value.trim())));
  } catch (err) {
    base64Output.textContent = 'Invalid Base64 input.';
  }
});

document.querySelector('#base64CopyBtn').addEventListener('click', () => {
  copyText(base64Output.textContent);
});

// --- URL ---
const urlInput = document.querySelector('#urlInput');
const urlOutput = document.querySelector('#urlOutput');

document.querySelector('#urlEncodeBtn').addEventListener('click', () => {
  urlOutput.textContent = encodeURIComponent(urlInput.value);
});

document.querySelector('#urlDecodeBtn').addEventListener('click', () => {
  try {
    urlOutput.textContent = decodeURIComponent(urlInput.value);
  } catch (err) {
    urlOutput.textContent = 'Invalid URL-encoded input.';
  }
});

document.querySelector('#urlCopyBtn').addEventListener('click', () => {
  copyText(urlOutput.textContent);
});

// --- Hash ---
const hashInput = document.querySelector('#hashInput');
const hashAlgo = document.querySelector('#hashAlgo');
const hashOutput = document.querySelector('#hashOutput');

async function generateHash() {
  const text = hashInput.value;
  if (!text) {
    hashOutput.textContent = '';
    return;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(hashAlgo.value, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  hashOutput.textContent = hashHex;
}

document.querySelector('#hashGenerateBtn').addEventListener('click', generateHash);
document.querySelector('#hashCopyBtn').addEventListener('click', () => {
  copyText(hashOutput.textContent);
});