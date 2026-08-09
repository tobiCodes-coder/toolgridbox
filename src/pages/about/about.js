import { renderHeader } from '../../components/header/header.js';
import { renderFooter } from '../../components/footer/footer.js';

const aboutContent = `
  <section class="about-page">
    <h1>About ToolGrid</h1>
    <p>ToolGrid is a collection of free, fast, and simple online tools for developers and everyday users.</p>
    <p>No signup, no ads getting in your way — just tools that work.</p>
  </section>
`;

document.querySelector('#app').innerHTML = renderHeader() + aboutContent + renderFooter();