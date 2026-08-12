import { renderHeader } from '../../components/header/header.js';
import { renderFooter } from '../../components/footer/footer.js';

const aboutContent = `
  <section class="about-page">
    <h1>About ToolGrid</h1>
    <p>ToolGrid is a growing collection of free, fast, and simple online tools — built for developers, designers, and anyone who wants to get things done without signing up or waiting around.</p>
    <p>Everything runs right in your browser. No uploads, no accounts, no ads getting in your way — just tools that work.</p>

    <div class="about-features">
      <div class="about-feature">
        <h3>No signup</h3>
        <p>Use any tool instantly, no account needed.</p>
      </div>
      <div class="about-feature">
        <h3>Privacy-friendly</h3>
        <p>Most tools run entirely in your browser — your files stay on your device.</p>
      </div>
      <div class="about-feature">
        <h3>Always free</h3>
        <p>No paywalls, no premium tiers, no hidden costs.</p>
      </div>
      <div class="about-feature">
        <h3>Growing library</h3>
        <p>New tools added regularly, based on what people actually need.</p>
      </div>
    </div>

    <div class="about-stats">
      <div class="stat-box">
        <span class="stat-number">11+</span>
        <span class="stat-label">Tools</span>
      </div>
      <div class="stat-box">
        <span class="stat-number">5</span>
        <span class="stat-label">Categories</span>
      </div>
      <div class="stat-box">
        <span class="stat-number">0</span>
        <span class="stat-label">Signups required</span>
      </div>
    </div>
  </section>
`;

document.querySelector('#app').innerHTML = `
  ${renderHeader()}
  <div class="page-content">${aboutContent}</div>
  ${renderFooter()}
`;