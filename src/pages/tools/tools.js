import { renderHeader, initHeader } from '../../components/header/header.js';
import { renderFooter, initFooter } from '../../components/footer/footer.js';
import { tools } from '../../data/tools.js';

const categories = ['All', 'Image', 'Text', 'Developer', 'Design', 'PDF'];
const RECENT_KEY = 'toolgrid-recent';

/* ===== Recently used ===== */
function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
  catch { return []; }
}

function trackRecent(url) {
  const list = getRecent().filter(u => u !== url);
  list.unshift(url);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6)));
}

function renderRecent() {
  const recent = getRecent()
    .map(url => tools.find(t => t.url === url))
    .filter(Boolean);

  if (!recent.length) return '';

  return `
    <div class="recent-section">
      <h2>Recently used</h2>
      <div class="recent-row">
        ${recent.map(t => `
          <a href="${t.url}" class="recent-chip">
            <i class="icon">${t.icon}</i>
            <span>${t.name}</span>
          </a>`).join('')}
      </div>
    </div>`;
}

/* ===== Cards ===== */
function renderCards(filtered) {
  if (filtered.length === 0) {
    return `
      <div class="no-tools">
        <div class="no-tools-icon">🔍</div>
        <h3>No tools found</h3>
        <p>Try another keyword or choose a different category.</p>
      </div>`;
  }

  return filtered.map(tool => `
    <a href="${tool.url}" class="tool-card" data-url="${tool.url}">
      <i class="icon">${tool.icon}</i>
      <h3>${tool.name}</h3>
      <p>${tool.desc}</p>
    </a>`).join('');
}

function catCount(cat) {
  return cat === 'All'
    ? tools.length
    : tools.filter(t => t.category === cat).length;
}

/* ===== Page ===== */
const toolsContent = `
<div class="page-content">
  <section class="tools-page">
    <h1>All Tools</h1>
    <p class="tools-subtitle">Fast, free and privacy-friendly online tools.</p>

    ${renderRecent()}

    <div class="tools-toolbar">
      <div class="search-box">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
        <input type="text" id="toolSearch" class="tool-search" placeholder="Search tools..." autocomplete="off">
        <button class="search-clear" id="searchClear" type="button" aria-label="Clear search" hidden>×</button>
        <div class="search-suggestions" id="searchSuggestions" hidden></div>
      </div>

      <div class="tools-topbar">
        <div class="tools-controls">
          <select id="sortSelect" class="sort-select" aria-label="Sort tools">
            <option value="default">Sort: Default</option>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
          </select>
          <div class="view-toggle" role="group" aria-label="View mode">
            <button class="view-btn active" type="button" data-view="grid" aria-label="Grid view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button class="view-btn" type="button" data-view="list" aria-label="List view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>
        <span class="results-count" id="resultsCount">${tools.length} Tools</span>
      </div>

      <div class="categories" id="categoryBar">
        ${categories.map((cat, i) => `
          <span class="cat${i === 0 ? ' active' : ''}" data-cat="${cat}">
            ${cat}<span class="cat-count">${catCount(cat)}</span>
          </span>`).join('')}
      </div>
    </div>

    <div class="tool-grid" id="toolGrid">
      ${renderCards(tools)}
    </div>
  </section>
</div>
`;

document.querySelector('#app').innerHTML = `
  ${renderHeader()}
  ${toolsContent}
  ${renderFooter()}
`;

initHeader();
initFooter();

/* ===== Elements ===== */
const categoryBar = document.querySelector('#categoryBar');
const toolGrid = document.querySelector('#toolGrid');
const toolSearch = document.querySelector('#toolSearch');
const resultsCount = document.querySelector('#resultsCount');
const sortSelect = document.querySelector('#sortSelect');
const searchClear = document.querySelector('#searchClear');
const suggestions = document.querySelector('#searchSuggestions');

let activeCategory = 'All';
let searchText = '';
let sortMode = 'default';

/* ===== Core ===== */
function applySort(list) {
  if (sortMode === 'az') return [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sortMode === 'za') return [...list].sort((a, b) => b.name.localeCompare(a.name));
  return list;
}

function updateTools() {
  let filtered = tools;

  if (activeCategory !== 'All') {
    filtered = filtered.filter(t => t.category === activeCategory);
  }

  if (searchText !== '') {
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(searchText) ||
      t.desc.toLowerCase().includes(searchText)
    );
  }

  filtered = applySort(filtered);

  toolGrid.innerHTML = renderCards(filtered);
  resultsCount.textContent = `${filtered.length} Tool${filtered.length !== 1 ? 's' : ''}`;
  searchClear.hidden = searchText === '';
}

/* ===== Suggestions ===== */
function showSuggestions() {
  if (!searchText) { suggestions.hidden = true; return; }

  const matches = tools
    .filter(t => t.name.toLowerCase().includes(searchText))
    .slice(0, 6);

  if (!matches.length) { suggestions.hidden = true; return; }

  suggestions.innerHTML = matches.map(t => `
    <button type="button" class="suggestion" data-name="${t.name}">
      <i class="s-icon">${t.icon}</i>${t.name}
    </button>`).join('');
  suggestions.hidden = false;
}

/* ===== Events ===== */
categoryBar.addEventListener('click', (e) => {
  const cat = e.target.closest('.cat');
  if (!cat) return;

  categoryBar.querySelectorAll('.cat').forEach(item => item.classList.remove('active'));
  cat.classList.add('active');
  activeCategory = cat.dataset.cat;
  updateTools();
});

toolSearch.addEventListener('input', (e) => {
  searchText = e.target.value.toLowerCase().trim();
  updateTools();
  showSuggestions();
});

toolSearch.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    toolSearch.value = '';
    searchText = '';
    suggestions.hidden = true;
    updateTools();
  }
});

toolSearch.addEventListener('blur', () => {
  setTimeout(() => { suggestions.hidden = true; }, 150);
});

suggestions.addEventListener('click', (e) => {
  const s = e.target.closest('.suggestion');
  if (!s) return;
  toolSearch.value = s.dataset.name;
  searchText = s.dataset.name.toLowerCase();
  suggestions.hidden = true;
  updateTools();
});

searchClear.addEventListener('click', () => {
  toolSearch.value = '';
  searchText = '';
  toolSearch.focus();
  updateTools();
});

sortSelect.addEventListener('change', () => {
  sortMode = sortSelect.value;
  updateTools();
});

document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    toolGrid.classList.toggle('list-view', btn.dataset.view === 'list');
  });
});

toolGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.tool-card');
  if (card) trackRecent(card.dataset.url);
});