import { renderHeader } from '../../components/header/header.js';
import { renderFooter } from '../../components/footer/footer.js';

const tools = [
  { name: 'Text diff highlighter', desc: 'Compare two texts and see differences', icon: 'DIFF', url: '/src/tools/text-diff/text-diff.html', category: 'Text' },
  { name: 'QR generator', desc: 'Create QR codes instantly', icon: 'QR', url: '/src/tools/qr-generator/qr-generator.html', category: 'Developer' },
  { name: 'Image compressor', desc: 'Compress and resize images in-browser', icon: 'IMG', url: '/src/tools/image-compressor/image-compressor.html', category: 'Image' },
  { name: 'JSON formatter', desc: 'Format, validate, and minify JSON', icon: '{ }', url: '/src/tools/json-formatter/json-formatter.html', category: 'Developer' },
  { name: 'Encode, decode & hash', desc: 'Base64, URL, and hash conversion', icon: 'DEC', url: '/src/tools/converter/converter.html', category: 'Developer' },
  { name: 'Data visualizer', desc: 'Turn your data into bar, line, or pie charts', icon: 'CHT', url: '/src/tools/data-visualizer/data-visualizer.html', category: 'Developer' },
  { name: 'CSS gradient generator', desc: 'Build linear and radial gradients visually', icon: 'GRD', url: '/src/tools/gradient-generator/gradient-generator.html', category: 'Design' },
  { name: 'Algorithm visualizer', desc: 'Watch sorting algorithms in action', icon: 'ALG', url: '/src/tools/algorithm-visualizer/algorithm-visualizer.html', category: 'Developer' },
  { name: 'Box shadow generator', desc: 'Build multi-layer CSS box shadows visually', icon: 'BXS', url: '/src/tools/box-shadow/box-shadow.html', category: 'Design' },
  { name: "CSS Animation Studio", desc: "Create CSS animations visually with live preview", icon: "ANI", url: "/src/tools/animation-studio/animation-studio.html", category: "Design" },
  { name: 'Color accessibility studio', desc: 'Check contrast, preview UI, simulate color blindness', icon: 'A11Y', url: '/src/tools/color-accessibility/color-accessibility.html', category: 'Design' },
  { name: 'PDF merge', desc: 'Combine multiple PDFs into one file', icon: 'PDF', url: '/src/tools/pdf-merge/pdf-merge.html', category: 'PDF' },
  { name: 'PDF split', desc: 'Split a PDF into pages or extract a page range', icon: 'SPL', url: '/src/tools/pdf-split/pdf-split.html', category: 'PDF' },
  { name: 'Images to PDF', desc: 'Combine JPG or PNG images into one PDF', icon: 'IMG2PDF', url: '/src/tools/images-to-pdf/images-to-pdf.html', category: 'PDF' },
  { name: 'PDF rotate', desc: 'Rotate PDF pages and download the result', icon: 'ROT', url: '/src/tools/pdf-rotate/pdf-rotate.html', category: 'PDF' },
  { name: 'PDF watermark', desc: 'Add a custom text watermark to your PDF', icon: 'WM', url: '/src/tools/pdf-watermark/pdf-watermark.html', category: 'PDF' },
  { name: 'PDF text extractor', desc: 'Extract all text from a PDF file', icon: 'TXT', url: '/src/tools/pdf-text-extractor/pdf-text-extractor.html', category: 'PDF' },
  { name: 'PDF password protect', desc: 'Add a password to a PDF file, right in your browser', icon: 'PDF', url: '/src/tools/pdf-password-protect/pdf-password-protect.html', category: 'PDF' },
  { name: 'PDF page number adder', desc: 'Add page numbers to a PDF file, right in your browser', icon: 'PDF', url: '/src/tools/pdf-page-numbers/pdf-page-numbers.html', category: 'PDF' },
  { name: 'PDF metadata editor', desc: 'View and edit a PDF\'s title, author, and document info', icon: 'PDF', url: '/src/tools/pdf-metadata-editor/pdf-metadata-editor.html', category: 'PDF' },
  { name: 'PDF page organizer', desc: 'Merge PDFs, reorder, rotate, and delete pages', icon: 'PDF', url: '/src/tools/pdf-page-organizer/pdf-page-organizer.html', category: 'PDF' },
  { name: 'Image resizer', desc: 'Resize images by pixels, percentage, or social media presets', icon: 'Image', url: '/src/tools/image-resizer/image-resizer.html', category: 'Image' },
  { name: 'QR logo generator', desc: 'Generate custom QR codes with your own logo, colors, and shapes', icon: 'QR', url: '/src/tools/qr-logo-generator/qr-logo-generator.html', category: 'Image' },
  { name: 'Image color extractor', desc: 'Extract design color palette and generate HTML/CSS variables', icon: 'Palette', url: '/src/tools/image-color-extractor/image-color-extractor.html', category: 'Developer' },
  { name: 'Word counter', desc: 'Count words, characters, sentences, and reading time', icon: 'WC', url: '/src/tools/word-counter/word-counter.html', category: 'Text' },
  { name: 'Text to Morse, Binary & ROT13', desc: 'Convert text between Morse code, binary, and ROT13', icon: 'ENC', url: '/src/tools/text-encoder/text-encoder.html', category: 'Text' },
  { name: 'Text cleanup', desc: 'Remove duplicate lines, extra spaces, and empty lines', icon: 'CLN', url: '/src/tools/text-cleanup/text-cleanup.html', category: 'Text' },
  
];

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