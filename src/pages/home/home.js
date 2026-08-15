const stats = [
  { number: '32+', label: 'Free tools' },
  { number: '100%', label: 'Free forever' },
  { number: '0', label: 'Signups required' },
];

const popularTools = [
  { name: 'Text diff highlighter', icon: 'DIFF', url: '/src/tools/text-diff/text-diff.html' },
  { name: 'QR generator', icon: 'QR', url: '/src/tools/qr-generator/qr-generator.html' },
  { name: 'Image compressor', icon: 'IMG', url: '/src/tools/image-compressor/image-compressor.html' },
  { name: 'JSON formatter', icon: '{ }', url: '/src/tools/json-formatter/json-formatter.html' },
  { name: 'Encode, decode & hash', icon: 'DEC', url: '/src/tools/converter/converter.html' },
  { name: 'Data visualizer', icon: 'CHT', url: '/src/tools/data-visualizer/data-visualizer.html' },
  { name: 'CSS gradient generator', icon: 'GRD', url: '/src/tools/gradient-generator/gradient-generator.html' },
  { name: 'Algorithm visualizer', icon: 'ALG', url: '/src/tools/algorithm-visualizer/algorithm-visualizer.html' },
  { name: 'Box shadow generator', icon: 'BXS', url: '/src/tools/box-shadow/box-shadow.html' },
  { name: 'PDF password protect', icon: 'PDF', url: '/src/tools/pdf-password-protect/pdf-password-protect.html' },
  { name: 'PDF page number adder', icon: 'PDF', url: '/src/tools/pdf-page-numbers/pdf-page-numbers.html' },
  { name: 'PDF metadata editor', icon: 'PDF', url: '/src/tools/pdf-metadata-editor/pdf-metadata-editor.html' },
  { name: 'PDF page organizer', icon: 'PDF', url: '/src/tools/pdf-page-organizer/pdf-page-organizer.html' }
];

const features = [
  { title: '100% free', desc: 'Every tool is free to use, with no hidden limits or paywalls.', icon: '✓' },
  { title: 'No signup', desc: 'Jump straight into any tool. No account, no email required.', icon: '⚡' },
  { title: 'Runs in your browser', desc: 'Tools run entirely on your device — fast, with no server round-trip.', icon: '🚀' },
  { title: 'Privacy first', desc: 'Your files and data are never uploaded anywhere. Nothing leaves your device.', icon: '🔒' }
];

const faqs = [
  { q: 'Is ToolGrid really free?', a: 'Yes — every tool on this site is completely free to use, with no hidden fees or usage limits.' },
  { q: 'Do I need to create an account?', a: 'No signup is required for any tool. Just open a tool and start using it.' },
  { q: 'Is my data uploaded anywhere?', a: 'No. Every tool runs directly in your browser — your files and data never leave your device.' },
  { q: 'Can I use these tools on mobile?', a: 'Yes, all tools are designed to work on both desktop and mobile browsers.' }
];

function renderStats() {
  return stats.map(s => `
    <div class="stat-item">
      <span class="stat-number">${s.number}</span>
      <span class="stat-label">${s.label}</span>
    </div>
  `).join('');
}

function renderPopularTools() {
  return popularTools.map(t => `
    <a href="${t.url}" class="mini-tool-card">
      <i class="icon">${t.icon}</i>
      <span>${t.name}</span>
    </a>
  `).join('');
}

function renderFeatures() {
  return features.map(f => `
    <div class="feature-card">
      <span class="feature-icon">${f.icon}</span>
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
    </div>
  `).join('');
}

function renderFaqs() {
  return faqs.map(f => `
    <details class="faq-item">
      <summary>${f.q}<span class="faq-arrow">+</span></summary>
      <div class="faq-answer">${f.a}</div>
    </details>
  `).join('');
}

export function renderHome() {
  return `
    <div class="page-content">
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <span class="hero-badge">Free & open to everyone</span>
          <h1>Free online tools<br>for developers</h1>
          <p>Fast, simple tools that run entirely in your browser. No signup, no uploads, no cost.</p>
          <div class="hero-actions">
            <a href="/src/pages/tools/tools.html" class="hero-cta">
              Browse all tools
              <span class="hero-cta-arrow">→</span>
            </a>
            <a href="/src/pages/about/about.html" class="hero-cta-secondary">
              Learn more
            </a>
          </div>
          <div class="hero-stats">
            ${renderStats()}
          </div>
        </div>
      </section>
      

      <section class="popular-tools reveal">
        <div class="section-header">
          <h2>Popular tools</h2>
          <p>Most used tools by our community</p>
        </div>
        <div class="mini-tool-grid">
          ${renderPopularTools()}
        </div>
        <a href="/src/pages/tools/tools.html" class="view-all-link">
          View all tools
          <span>→</span>
        </a>
      </section>

      <section class="why-choose-us reveal">
        <div class="section-header">
          <h2>Why choose ToolGrid</h2>
          <p>Built with simplicity and privacy in mind</p>
        </div>
        <div class="feature-grid">
          ${renderFeatures()}
        </div>
      </section>

      <section class="faq-section reveal">
        <div class="section-header">
          <h2>Frequently asked questions</h2>
          <p>Everything you need to know</p>
        </div>
        <div class="faq-list">
          ${renderFaqs()}
        </div>
      </section>
      <button class="scroll-down" type="button" aria-label="Scroll down">↓</button>
    </div>
  `;
}

export function initHomeEvents() {
  const revealTargets = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));

  const scrollDown = document.querySelector('.scroll-down');
  const app = document.querySelector('#app');

  if (scrollDown && app) {
    const sectionSelectors = ['.hero', '.popular-tools', '.why-choose-us', '.faq-section'];

    scrollDown.addEventListener('click', () => {
      const sections = sectionSelectors
        .map(s => document.querySelector(s))
        .filter(Boolean);

      const current = app.scrollTop;
      const next = sections.find(sec => sec.offsetTop > current + 100);

      if (next) {
        app.scrollTo({ top: next.offsetTop, behavior: 'smooth' });
      } else {
        app.scrollTo({ top: app.scrollHeight, behavior: 'smooth' });
      }
    });

    app.addEventListener('scroll', () => {
      const atBottom = app.scrollTop + app.clientHeight >= app.scrollHeight - 40;
      scrollDown.style.opacity = atBottom ? '0' : '1';
      scrollDown.style.pointerEvents = atBottom ? 'none' : 'auto';
    });
  }
}