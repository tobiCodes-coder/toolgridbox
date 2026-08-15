export function renderFooter() {
  const year = new Date().getFullYear();

  return `
    <footer class="site-footer">
      <div class="footer-container">

        <div class="footer-main">

          <div class="footer-brand">
            <a href="/index.html" class="footer-logo" aria-label="ToolGrid home">
              <span class="footer-logo-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
              <span class="footer-logo-text">ToolGrid</span>
            </a>
            <p class="footer-tagline">
              Free, fast, browser-based tools for developers
              and designers. No signup, no uploads, no cost.
            </p>
            <div class="footer-socials">
              <a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener" aria-label="Twitter/X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="mailto:support@toolgrid.dev" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>

          <div class="footer-nav">

            <div class="footer-col">
              <h4>Pages</h4>
              <nav class="footer-links" aria-label="Footer pages">
                <a href="/index.html">Home</a>
                <a href="/src/pages/tools/tools.html">All Tools</a>
                <a href="/src/pages/about/about.html">About</a>
                <a href="/src/pages/contact/contact.html">Contact</a>
              </nav>
            </div>

            <div class="footer-col">
              <h4>Categories</h4>
              <nav class="footer-links" aria-label="Footer categories">
                <a href="/src/pages/tools/tools.html">Image Tools</a>
                <a href="/src/pages/tools/tools.html">PDF Tools</a>
                <a href="/src/pages/tools/tools.html">Developer Tools</a>
                <a href="/src/pages/tools/tools.html">Design Tools</a>
              </nav>
            </div>

            <div class="footer-col">
              <h4>Popular</h4>
              <nav class="footer-links" aria-label="Footer popular tools">
                <a href="/src/tools/image-resizer/image-resizer.html">Image Resizer</a>
                <a href="/src/tools/pdf-merge/pdf-merge.html">PDF Merge</a>
                <a href="/src/tools/qr-generator/qr-generator.html">QR Generator</a>
                <a href="/src/tools/json-formatter/json-formatter.html">JSON Formatter</a>
              </nav>
            </div>

          </div>

        </div>

        <div class="footer-bottom">
          <p>&copy; ${year} ToolGrid. All rights reserved.</p>
          <button class="back-to-top" type="button" aria-label="Back to top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            Back to top
          </button>
        </div>

      </div>
    </footer>
  `;
}

export function initFooter() {
  document.addEventListener('click', (e) => {
    const backToTop = e.target.closest('.back-to-top');
    if (!backToTop) return;

    e.preventDefault();
    const app = document.querySelector('#app');
    if (app) app.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}