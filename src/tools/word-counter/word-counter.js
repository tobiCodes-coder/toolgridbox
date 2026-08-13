const textInput = document.querySelector('#textInput');
const wordCount = document.querySelector('#wordCount');
const charWithSpace = document.querySelector('#charWithSpace');
const charNoSpace = document.querySelector('#charNoSpace');
const sentenceCount = document.querySelector('#sentenceCount');
const paragraphCount = document.querySelector('#paragraphCount');
const uniqueWordCount = document.querySelector('#uniqueWordCount');
const readingTime = document.querySelector('#readingTime');
const speakingTime = document.querySelector('#speakingTime');
const longestWord = document.querySelector('#longestWord');
const avgWordLength = document.querySelector('#avgWordLength');
const keywordList = document.querySelector('#keywordList');

const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'of', 'for', 'with', 'this', 'that', 'it', 'as', 'be', 'by', 'from']);

function analyze() {
  const text = textInput.value;
  const trimmed = text.trim();

  const words = trimmed ? trimmed.match(/[\w'-]+/g) || [] : [];
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g) || (trimmed ? [trimmed] : [])) : [];
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim() !== '') : [];

  wordCount.textContent = words.length;
  charWithSpace.textContent = text.length;
  charNoSpace.textContent = text.replace(/\s/g, '').length;
  sentenceCount.textContent = sentences.length;
  paragraphCount.textContent = paragraphs.length;

  const lowerWords = words.map(w => w.toLowerCase());
  const uniqueWords = new Set(lowerWords);
  uniqueWordCount.textContent = uniqueWords.size;

  const wpm = 200;
  const spm = 130;
  readingTime.textContent = words.length > 0 ? `${Math.max(1, Math.ceil(words.length / wpm))} min` : '0 min';
  speakingTime.textContent = words.length > 0 ? `${Math.max(1, Math.ceil(words.length / spm))} min` : '0 min';

  if (words.length > 0) {
    const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');
    longestWord.textContent = longest;

    const totalLength = words.reduce((sum, w) => sum + w.length, 0);
    avgWordLength.textContent = (totalLength / words.length).toFixed(1);
  } else {
    longestWord.textContent = '—';
    avgWordLength.textContent = '0';
  }

  updateKeywords(lowerWords);
}

function updateKeywords(lowerWords) {
  if (lowerWords.length === 0) {
    keywordList.innerHTML = '<p class="empty-note">Start typing to see keyword frequency.</p>';
    return;
  }

  const freq = {};
  lowerWords.forEach(w => {
    if (STOP_WORDS.has(w) || w.length < 3) return;
    freq[w] = (freq[w] || 0) + 1;
  });

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (sorted.length === 0) {
    keywordList.innerHTML = '<p class="empty-note">No significant keywords found yet.</p>';
    return;
  }

  keywordList.innerHTML = sorted
    .map(([word, count]) => `<span class="keyword-chip">${word}<span>${count}</span></span>`)
    .join('');
}

textInput.addEventListener('input', analyze);

analyze();