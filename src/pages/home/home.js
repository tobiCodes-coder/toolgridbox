export function renderHome() {
  return `
    <section class="hero">
      <h1>Free online tools for developers</h1>
      <p>100+ fast, simple tools. No signup required.</p>
      <input type="text" class="search" placeholder="Search tools..." />
    </section>

    <div class="categories">
      <span class="cat active">Image</span>
      <span class="cat">PDF</span>
      <span class="cat">Text</span>
      <span class="cat">Developer</span>
    </div>

    <div class="tool-grid">
      <a href="/tools/json-formatter/json-formatter.html" class="tool-card">
        <i class="icon">{ }</i>
        <h3>JSON formatter</h3>
        <p>Format and validate JSON</p>
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
      <a href="/src/tools/text-diff/text-diff.html" class="tool-card">
        <i class="icon">DIFF</i>
        <h3>Text diff highlighter</h3>
        <p>Compare two texts and see differences</p>
      </a>
    </div>
  `;
}