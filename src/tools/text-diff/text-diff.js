function compareTexts(text1, text2) {
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);

  const result = [];
  const maxLen = Math.max(words1.length, words2.length);

  for (let i = 0; i < maxLen; i++) {
    const w1 = words1[i];
    const w2 = words2[i];

    if (w1 === w2) {
      result.push(w1 || '');
    } else {
      if (w1) result.push(`<span class="diff-removed">${w1}</span>`);
      if (w2) result.push(`<span class="diff-added">${w2}</span>`);
    }
  }

  return result.join(' ');
}

const compareBtn = document.querySelector('#compareBtn');
const resultDiv = document.querySelector('#result');

compareBtn.addEventListener('click', () => {
  const text1 = document.querySelector('#text1').value;
  const text2 = document.querySelector('#text2').value;

  if (!text1.trim() && !text2.trim()) {
    resultDiv.innerHTML = '<p style="color:#999">Enter text in both boxes to compare.</p>';
    return;
  }

  resultDiv.innerHTML = compareTexts(text1, text2);
});