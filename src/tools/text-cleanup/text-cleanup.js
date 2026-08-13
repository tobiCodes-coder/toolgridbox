const textInput = document.querySelector('#textInput');
const output = document.querySelector('#output');
const removeDuplicates = document.querySelector('#removeDuplicates');
const removeEmptyLines = document.querySelector('#removeEmptyLines');
const trimSpaces = document.querySelector('#trimSpaces');
const cleanBtn = document.querySelector('#cleanBtn');
const copyBtn = document.querySelector('#copyBtn');
const clearBtn = document.querySelector('#clearBtn');
const statusMsg = document.querySelector('#statusMsg');

cleanBtn.addEventListener('click', () => {
  let lines = textInput.value.split('\n');

  if (trimSpaces.checked) {
    lines = lines.map(line => line.trim().replace(/\s+/g, ' '));
  }

  if (removeEmptyLines.checked) {
    lines = lines.filter(line => line !== '');
  }

  if (removeDuplicates.checked) {
    lines = [...new Set(lines)];
  }

  output.value = lines.join('\n');
  statusMsg.textContent = `Done — ${lines.length} lines in the result.`;
});

copyBtn.addEventListener('click', () => {
  if (!output.value) return;
  navigator.clipboard.writeText(output.value).then(() => {
    statusMsg.textContent = 'Copied to clipboard.';
  });
});

clearBtn.addEventListener('click', () => {
  textInput.value = '';
  output.value = '';
  statusMsg.textContent = '';
});