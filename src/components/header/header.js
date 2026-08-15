export function renderHeader() {
  // Detect current page from URL
  const path = window.location.pathname;
  const isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('/');
  const isTools = path.includes('/tools/tools.html');
  const isAbout = path.includes('/about/about.html');
  const isContact = path.includes('/contact/contact.html');

  return `
    <header class="site-header">
      <div class="site-header-inner">
        <a href="/index.html" class="logo" aria-label="ToolGrid home">
          <span class="logo-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span class="logo-text">ToolGrid</span>
        </a>

        <button
          class="nav-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="site-nav"
          aria-label="Open menu"
        >
          <span class="nav-toggle-icon" aria-hidden="true"></span>
        </button>

        <nav id="site-nav" class="site-nav" aria-label="Main navigation">
          <a href="/index.html" class="${isHome ? 'active' : ''}">Home</a>
          <a href="/src/pages/tools/tools.html" class="${isTools ? 'active' : ''}">Tools</a>
          <a href="/src/pages/about/about.html" class="${isAbout ? 'active' : ''}">About</a>
          <a href="/src/pages/contact/contact.html" class="${isContact ? 'active' : ''}">Contact</a>
        </nav>
      </div>
    </header>
  `;
}

export function initHeader() {
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.nav-toggle');
  const nav = header?.querySelector('.site-nav');

  if (!header || !toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target) && nav.classList.contains('open')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });
}