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
      <a href="/src/tools/qr-generator/qr-generator.html" class="tool-card">
        <i class="icon">QR</i>
        <h3>QR generator</h3>
        <p>Create QR codes instantly</p>
      </a>
      <a href="/src/tools/image-compressor/image-compressor.html" class="tool-card">
        <i class="icon">IMG</i>
        <h3>Image compressor</h3>
        <p>Compress and resize images in-browser</p>
      </a>
      <a href="/src/tools/json-formatter/json-formatter.html" class="tool-card">
        <i class="icon">{ }</i>
        <h3>JSON formatter</h3>
        <p>Format, validate, and minify JSON</p>
      </a>
      <a href="/src/tools/converter/converter.html" class="tool-card">
        <i class="icon">DEC</i>
        <h3>Encode, decode & hash</h3>
        <p>Base64, URL, and hash conversion</p>
      </a>
      <a href="/src/tools/data-visualizer/data-visualizer.html" class="tool-card">
        <i class="icon">CHT</i>
        <h3>Data visualizer</h3>
        <p>Turn your data into bar, line, or pie charts</p>
      </a>
      <a href="/src/tools/gradient-generator/gradient-generator.html" class="tool-card">
        <i class="icon">GRD</i>
        <h3>CSS gradient generator</h3>
        <p>Build linear and radial gradients visually</p>
      </a>
    </div>
  </section>
`;

document.querySelector('#app').innerHTML = renderHeader() + toolsContent + renderFooter();