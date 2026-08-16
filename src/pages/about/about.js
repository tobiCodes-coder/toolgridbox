import { renderHeader, initHeader } from '../../components/header/header.js';
import { renderFooter, initFooter } from '../../components/footer/footer.js';
import { tools } from '../../data/tools.js';

/* ===== Dynamic Stats ===== */
const categories = [...new Set(tools.map(t => t.category))].length;
const totalTools = tools.length;

const stats = [
  { number: `${totalTools}+`, label: 'Free Tools', icon: '🔧' },
  { number: `${categories}`, label: 'Categories', icon: '📂' },
  { number: '0', label: 'Signup Required', icon: '✓' },
  { number: '100%', label: 'Free Forever', icon: '∞' }
];

/* ===== Design Principles ===== */
const principles = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    desc: 'Every tool runs directly in your browser — no server round-trips, instant results.'
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    desc: 'Your files and data never leave your device. Nothing is uploaded anywhere.'
  },
  {
    icon: '🎯',
    title: 'Simple & Focused',
    desc: 'One tool, one purpose. No bloat, no distractions, just get the job done.'
  },
  {
    icon: '♿',
    title: 'Accessible to All',
    desc: 'Free forever, no account needed, works on any device with a modern browser.'
  }
];

/* ===== Roadmap ===== */
const roadmap = [
  {
    icon: '🚀',
    title: 'More Tools',
    desc: 'Expanding the collection with high-quality utilities for developers and designers.'
  },
  {
    icon: '⚡',
    title: 'Better Performance',
    desc: 'Continuous optimization for faster load times and smoother interactions.'
  },
  {
    icon: '♿',
    title: 'Accessibility',
    desc: 'Improving keyboard navigation, screen reader support, and WCAG compliance.'
  },
  {
    icon: '📱',
    title: 'Mobile Experience',
    desc: 'Enhanced mobile-first design for seamless use on phones and tablets.'
  },
  {
    icon: '🔄',
    title: 'Regular Updates',
    desc: 'Monthly releases with new features, bug fixes, and user-requested improvements.'
  }
];

/* ===== Render Functions ===== */
function renderStats() {
  return stats.map(s => `
    <div class="stat-card reveal">
      <div class="stat-icon">${s.icon}</div>
      <div class="stat-number">${s.number}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');
}

function renderPrinciples() {
  return principles.map(p => `
    <div class="principle-card reveal">
      <div class="principle-icon">${p.icon}</div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
    </div>`).join('');
}

function renderRoadmap() {
  return roadmap.map(r => `
    <div class="roadmap-card reveal">
      <div class="roadmap-icon">${r.icon}</div>
      <div class="roadmap-content">
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
      </div>
    </div>`).join('');
}

/* ===== Page Content ===== */
const aboutContent = `
  <section class="about-hero reveal">
    <div class="container">
      <span class="section-badge">About ToolGrid</span>
      <h1>Simple tools.<br>Better workflow.</h1>
      <p class="about-intro">
        ToolGrid is a collection of free, fast and privacy-friendly
        online tools built for developers, designers and creators.
        Every tool is designed to solve everyday problems without
        unnecessary complexity.
      </p>
      <a href="/src/pages/tools/tools.html" class="btn btn-primary">
        Explore All Tools →
      </a>
    </div>
  </section>

  <section class="why-section">
    <div class="container">
      <span class="section-badge reveal">Our Philosophy</span>
      <h2 class="reveal">Why ToolGrid?</h2>
      <div class="why-content reveal">
        <p>
          We believe useful tools should be accessible to everyone.
          That's why ToolGrid focuses on simplicity, performance,
          accessibility and a clean user experience — without requiring
          an account or uploading your data.
        </p>
        <p>
          Every tool is built with a single purpose in mind: solve one
          problem well. No bloated interfaces, no tracking, no distractions.
          Just open, use, and move on with your day.
        </p>
      </div>
    </div>
  </section>

  <section class="principles-section">
    <div class="container">
      <h2 class="reveal">Design Principles</h2>
      <div class="principles-grid">
        ${renderPrinciples()}
      </div>
    </div>
  </section>

  <section class="stats-section">
    <div class="container">
      <h2 class="reveal">ToolGrid by Numbers</h2>
      <div class="stats-grid">
        ${renderStats()}
      </div>
      <div class="stats-cta reveal">
        <a href="/src/pages/tools/tools.html" class="btn btn-outline">
          See All ${totalTools} Tools
        </a>
      </div>
    </div>
  </section>

  <section class="tech-section">
    <div class="container">
      <span class="section-badge reveal">Built With Care</span>
      <h2 class="reveal">Under the Hood</h2>
      <div class="tech-content reveal">
        <p>
          ToolGrid is built with vanilla HTML, CSS, and JavaScript —
          no frameworks, no dependencies, no bloat. This means faster
          load times, better performance, and complete transparency.
        </p>
        <div class="tech-badges">
          <span class="tech-badge">HTML5</span>
          <span class="tech-badge">CSS3</span>
          <span class="tech-badge">JavaScript</span>
          <span class="tech-badge">LocalStorage</span>
          <span class="tech-badge">Canvas API</span>
        </div>
      </div>
    </div>
  </section>

  <section class="roadmap-section">
    <div class="container">
      <span class="section-badge reveal">What's Next</span>
      <h2 class="reveal">Growing Every Month</h2>
      <div class="roadmap-grid">
        ${renderRoadmap()}
      </div>
    </div>
  </section>

  <section class="about-cta reveal">
    <div class="container">
      <h2>Ready to explore ToolGrid?</h2>
      <p>Discover free online tools designed to make everyday tasks faster and easier.</p>
      <a href="/src/pages/tools/tools.html" class="btn btn-primary">
        Start Using Tools
      </a>
    </div>
  </section>
`;

/* ===== Render ===== */
document.querySelector('#app').innerHTML = `
  ${renderHeader()}
  <div class="page-content">${aboutContent}</div>
  ${renderFooter()}
`;

initHeader();
initFooter();

/* ===== Scroll Reveal ===== */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

initReveal();