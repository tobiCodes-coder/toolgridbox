const tools = [
  { name: 'Text diff highlighter', desc: 'Compare two texts and see differences', icon: 'DIFF', url: '/src/tools/text-diff/text-diff.html', category: 'Text' },
  { name: 'QR generator', desc: 'Create QR codes instantly', icon: 'QR', url: '/src/tools/qr-generator/qr-generator.html', category: 'Developer' },
  { name: 'Image compressor', desc: 'Compress and resize images in-browser', icon: 'IMG', url: '/src/tools/image-compressor/image-compressor.html', category: 'Image' },
  { name: 'JSON formatter', desc: 'Format, validate, and minify JSON', icon: '{ }', url: '/src/tools/json-formatter/json-formatter.html', category: 'Developer' },
  { name: 'Data visualizer', desc: 'Turn your data into bar, line, or pie charts', icon: 'CHT', url: '/src/tools/data-visualizer/data-visualizer.html', category: 'Developer' },
  { name: 'CSS gradient generator', desc: 'Build linear and radial gradients visually', icon: 'GRD', url: '/src/tools/gradient-generator/gradient-generator.html', category: 'Design' },
  { name: 'Algorithm visualizer', desc: 'Watch sorting algorithms in action', icon: 'ALG', url: '/src/tools/algorithm-visualizer/algorithm-visualizer.html', category: 'Developer' },
  { name: 'Box shadow generator', desc: 'Build multi-layer CSS box shadows visually', icon: 'BXS', url: '/src/tools/box-shadow/box-shadow.html', category: 'Design' }
];

const categories = ['All', 'Image', 'Text', 'Developer', 'Design', 'PDF'];

function renderCards(filtered) {
  if (filtered.length === 0) {
    return '<p class="no-tools">No tools found.</p>';
  }

  return filtered.map(tool => `
    <a href="${tool.url}" class="tool-card">
      <i class="icon">${tool.icon}</i>
      <h3>${tool.name}</h3>
      <p>${tool.desc}</p>
    </a>
  `).join('');
}

export function renderHome() {
  return `
    <div class="page-content">
      <section class="hero">
        <h1>Free online tools for developers</h1>
        <p>100+ fast, simple tools. No signup required.</p>
        <input type="text" class="search" placeholder="Search tools..." />
      </section>

      <div class="categories" id="categoryBar">
        ${categories.map((cat, i) => `<span class="cat${i === 0 ? ' active' : ''}" data-cat="${cat}">${cat}</span>`).join('')}
      </div>

      <div class="tool-grid" id="toolGrid">
        ${renderCards(tools)}
      </div>
    </div>
  `;
}

export function initHomeEvents() {
  const categoryBar = document.querySelector('#categoryBar');
  const toolGrid = document.querySelector('#toolGrid');
  const searchInput = document.querySelector('.search');

  let activeCategory = 'All';

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();

    let filtered = activeCategory === 'All' ? tools : tools.filter(t => t.category === activeCategory);

    if (query) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.desc.toLowerCase().includes(query)
      );
    }

    toolGrid.innerHTML = renderCards(filtered);
  }

  categoryBar.addEventListener('click', (e) => {
    if (!e.target.classList.contains('cat')) return;

    categoryBar.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');

    activeCategory = e.target.dataset.cat;
    applyFilters();
  });

  searchInput.addEventListener('input', applyFilters);
}