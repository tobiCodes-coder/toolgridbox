import { renderHeader } from '../../components/header/header.js';
import { renderFooter } from '../../components/footer/footer.js';

import { tools } from '../../data/tools.js';

const categories = ['All', 'Image', 'Text', 'Developer', 'Design', 'PDF'];

function renderCards(filtered) {
  if (filtered.length === 0) {
    return '<p class="no-tools">No tools in this category yet.</p>';
  }

  return filtered.map(tool => `
    <a href="${tool.url}" class="tool-card">
      <i class="icon">${tool.icon}</i>
      <h3>${tool.name}</h3>
      <p>${tool.desc}</p>
    </a>
  `).join('');
}

const toolsContent = `
  <div class="page-content">
    <section class="tools-page">
      <h1>All tools</h1>

      <div class="categories" id="categoryBar">
        ${categories.map((cat, i) => `<span class="cat${i === 0 ? ' active' : ''}" data-cat="${cat}">${cat}</span>`).join('')}
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

const categoryBar = document.querySelector('#categoryBar');
const toolGrid = document.querySelector('#toolGrid');

categoryBar.addEventListener('click', (e) => {
  if (!e.target.classList.contains('cat')) return;

  categoryBar.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');

  const selected = e.target.dataset.cat;
  const filtered = selected === 'All' ? tools : tools.filter(t => t.category === selected);
  toolGrid.innerHTML = renderCards(filtered);
});