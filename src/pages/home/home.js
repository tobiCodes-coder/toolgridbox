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
      <a href="/tools/qr-generator/qr-generator.html" class="tool-card">
        <i class="icon">QR</i>
        <h3>QR generator</h3>
        <p>Create QR codes instantly</p>
      </a>
      <a href="/tools/image-compressor/image-compressor.html" class="tool-card">
        <i class="icon">IMG</i>
        <h3>Image compressor</h3>
        <p>Compress images in-browser</p>
      </a>
      <a href="/tools/color-picker/color-picker.html" class="tool-card">
        <i class="icon">CLR</i>
        <h3>Color picker</h3>
        <p>Pick and convert colors</p>
      </a>
    </div>
  `;
}