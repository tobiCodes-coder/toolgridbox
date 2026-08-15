import { renderHeader, initHeader } from '../../components/header/header.js';
import { renderFooter, initFooter } from '../../components/footer/footer.js';;

const aboutContent = `
  <section class="about-section">
    <div class="container">
        <span class="section-badge">About ToolGrid</span>
        <h1>Simple tools. Better workflow.</h1>
        <p class="about-intro">
            ToolGrid is a collection of free, fast and privacy-friendly
            online tools built for developers, designers and creators.
            Every tool is designed to solve everyday problems without
            unnecessary complexity.
        </p>
        <p class="about-text">
            We believe useful tools should be accessible to everyone.
            That's why ToolGrid focuses on simplicity, performance,
            accessibility and a clean user experience without requiring
            an account.
        </p>
    </div>
</section>

<section class="mission-section">
    <div class="container">
        <span class="section-badge">Our Mission</span>
        <h2>Build tools people actually enjoy using.</h2>
        <p>
            Our goal is to create lightweight, browser-based utilities
            that save time, respect user privacy and remain completely
            free for everyone.
        </p>
    </div>
</section>

<section class="stats-section">
    <div class="container">
        <h2>ToolGrid by Numbers</h2>
        <div class="stats-grid">
            <div class="stat-card"><h3>32+</h3><span>Tools</span></div>
            <div class="stat-card"><h3>5</h3><span>Categories</span></div>
            <div class="stat-card"><h3>0</h3><span>Signup Required</span></div>
        </div>
    </div>
</section>

<section class="roadmap-section">
    <div class="container">
        <span class="section-badge">What's Next</span>
        <h2>Growing every month</h2>
        <ul class="roadmap-list">
            <li>✔ More high-quality tools</li>
            <li>✔ Better performance</li>
            <li>✔ Accessibility improvements</li>
            <li>✔ Mobile-first experience</li>
            <li>✔ Continuous updates</li>
        </ul>
    </div>
</section>

<section class="about-cta">
    <div class="container">
        <h2>Ready to explore ToolGrid?</h2>
        <p>Discover free online tools designed to make everyday tasks faster and easier.</p>
        <a href="/src/pages/tools/tools.html" class="hero-btn">Explore Tools</a>
    </div>
</section>
`;

// 1. Age DOM render korun
document.querySelector('#app').innerHTML = `
  ${renderHeader()}
  <div class="page-content">${aboutContent}</div>
  ${renderFooter()}
`;

// 2. Tarpor initHeader() call korun
initHeader();
initFooter();