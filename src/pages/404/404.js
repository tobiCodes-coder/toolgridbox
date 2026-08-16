import { renderHeader, initHeader } from '../../components/header/header.js';
import { renderFooter, initFooter } from '../../components/footer/footer.js';

const notFoundContent = `
  <div class="page-content">
    <section class="notfound-page">
      <div class="notfound-visual" aria-hidden="true">
        <span class="nf-sq"></span>
        <span class="nf-sq dim"></span>
        <span class="nf-sq missing">?</span>
        <span class="nf-sq dim"></span>
      </div>
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div class="notfound-actions">
        <a href="/index.html" class="btn btn-primary">Back to home</a>
        <a href="/src/pages/tools/tools.html" class="btn btn-outline">Browse tools</a>
      </div>
    </section>
  </div>
`;

document.querySelector('#app').innerHTML = `
  ${renderHeader()}
  ${notFoundContent}
  ${renderFooter()}
`;

initHeader();
initFooter();