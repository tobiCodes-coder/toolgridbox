const tabBtns = document.querySelectorAll('.tab-btn');
const textInput = document.querySelector('#textInput');
const encodeBtn = document.querySelector('#encodeBtn');
const decodeBtn = document.querySelector('#decodeBtn');
const copyBtn = document.querySelector('#copyBtn');
const output = document.querySelector('#output');
const statusMsg = document.querySelector('#statusMsg');

let activeTab = 'morse';

const MORSE_MAP = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};
const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTab = btn.dataset.tab;
    output.textContent = '';
    statusMsg.textContent = '';
  });
});

function textToMorse(text) {
  return text.toUpperCase().split('').map(ch => {
    if (ch === ' ') return '/';
    return MORSE_MAP[ch] || '';
  }).filter(Boolean).join(' ');
}

function morseToText(morse) {
  return morse.trim().split(' ').map(code => {
    if (code === '/') return ' ';
    return MORSE_REVERSE[code] || '';
  }).join('');
}

function textToBinary(text) {
  return text.split('').map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

function binaryToText(binary) {
  return binary.trim().split(/\s+/).map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
}

function rot13(text) {
  return text.replace(/[a-zA-Z]/g, ch => {
    const base = ch <= 'Z' ? 65 : 97;
    return String.fromCharCode((ch.charCodeAt(0) - base + 13) % 26 + base);
  });
}

encodeBtn.addEventListener('click', () => {
  const text = textInput.value;
  if (!text.trim()) {
    statusMsg.textContent = 'Enter some text first.';
    return;
  }

  if (activeTab === 'morse') output.textContent = textToMorse(text);
  if (activeTab === 'binary') output.textContent = textToBinary(text);
  if (activeTab === 'rot13') output.textContent = rot13(text);

  statusMsg.textContent = '';
});

decodeBtn.addEventListener('click', () => {
  const text = textInput.value;
  if (!text.trim()) {
    statusMsg.textContent = 'Enter some text first.';
    return;
  }

  try {
    if (activeTab === 'morse') output.textContent = morseToText(text);
    if (activeTab === 'binary') output.textContent = binaryToText(text);
    if (activeTab === 'rot13') output.textContent = rot13(text);
    statusMsg.textContent = '';
  } catch (err) {
    statusMsg.textContent = 'Could not decode — check the input format.';
  }
});

copyBtn.addEventListener('click', () => {
  if (!output.textContent) return;
  navigator.clipboard.writeText(output.textContent).then(() => {
    statusMsg.textContent = 'Copied to clipboard.';
  });
});