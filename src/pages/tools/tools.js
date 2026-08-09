import { renderHeader } from '../../components/header/header.js';
import { renderFooter } from '../../components/footer/footer.js';

const toolsContent = `
  <section class="tools-page">
    <h1>All tools</h1>
    <div class="tool-grid">
      <a href="/src/tools/text-diff/text-diff.html" class="tool-card">
        <i class="icon">DIFF</i>
        <h3>Text diff highlighter</h3>
        <p>Compare two texts and see differences</p>
      </a>
    </div>
  </section>
`;

document.querySelector('#app').innerHTML = renderHeader() + toolsContent + renderFooter();