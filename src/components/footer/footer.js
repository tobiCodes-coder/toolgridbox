export function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-mark">TG</span>
            <span class="logo-text">ToolGrid</span>
          </div>
          <p>Free, fast, browser-based tools for developers and designers. No signup, no uploads, no cost.</p>
        </div>

        <div class="footer-col">
          <h4>Navigate</h4>
          <a href="/index.html">Home</a>
          <a href="/src/pages/tools/tools.html">All tools</a>
          <a href="/src/pages/about/about.html">About</a>
          <a href="/src/pages/contact/contact.html">Contact</a>
        </div>

        <div class="footer-col">
          <h4>Categories</h4>
          <a href="/src/pages/tools/tools.html">Developer tools</a>
          <a href="/src/pages/tools/tools.html">Design tools</a>
          <a href="/src/pages/tools/tools.html">PDF tools</a>
          <a href="/src/pages/tools/tools.html">Image tools</a>
        </div>

        <div class="footer-col">
          <h4>Connect</h4>
          <div class="footer-socials">
            <a href="#" aria-label="GitHub">GH</a>
            <a href="#" aria-label="Twitter/X">X</a>
            <a href="#" aria-label="Email">✉</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
  <p>&copy; 2026 ToolGrid. All rights reserved.</p>
  <a href="#" class="back-to-top">Back to top ↑</a>
</div>
    </footer>
  `;
}