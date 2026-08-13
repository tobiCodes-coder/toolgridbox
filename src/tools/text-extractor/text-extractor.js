const textInput = document.querySelector('#textInput');
const extractBtn = document.querySelector('#extractBtn');
const clearBtn = document.querySelector('#clearBtn');
const statusMsg = document.querySelector('#statusMsg');

const urlList = document.querySelector('#urlList');
const emailList = document.querySelector('#emailList');
const phoneList = document.querySelector('#phoneList');
const urlCount = document.querySelector('#urlCount');
const emailCount = document.querySelector('#emailCount');
const phoneCount = document.querySelector('#phoneCount');

const URL_REGEX = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;

let lastResults = { urls: [], emails: [], phones: [] };

function renderList(container, items, countEl) {
  countEl.textContent = items.length;

  if (items.length === 0) {
    container.innerHTML = '<p class="empty-note">None found.</p>';
    return;
  }

  container.innerHTML = items.map(item => `<div class="result-item">${item}</div>`).join('');
}

extractBtn.addEventListener('click', () => {
  const text = textInput.value;

  if (!text.trim()) {
    statusMsg.textContent = 'Paste some text first.';
    return;
  }

  const urls = [...new Set(text.match(URL_REGEX) || [])];
  const emails = [...new Set(text.match(EMAIL_REGEX) || [])];
  const phones = [...new Set((text.match(PHONE_REGEX) || []).map(p => p.trim()).filter(p => p.replace(/\D/g, '').length >= 7))];

  lastResults = { urls, emails, phones };

  renderList(urlList, urls, urlCount);
  renderList(emailList, emails, emailCount);
  renderList(phoneList, phones, phoneCount);

  statusMsg.textContent = `Found ${urls.length} URLs, ${emails.length} emails, ${phones.length} phone numbers.`;
});

function copyGroup(items) {
  if (items.length === 0) return;
  navigator.clipboard.writeText(items.join('\n')).then(() => {
    statusMsg.textContent = 'Copied to clipboard.';
  });
}

document.querySelector('#copyUrls').addEventListener('click', () => copyGroup(lastResults.urls));
document.querySelector('#copyEmails').addEventListener('click', () => copyGroup(lastResults.emails));
document.querySelector('#copyPhones').addEventListener('click', () => copyGroup(lastResults.phones));

clearBtn.addEventListener('click', () => {
  textInput.value = '';
  lastResults = { urls: [], emails: [], phones: [] };
  renderList(urlList, [], urlCount);
  renderList(emailList, [], emailCount);
  renderList(phoneList, [], phoneCount);
  statusMsg.textContent = '';
});