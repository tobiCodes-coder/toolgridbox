import { renderHeader } from '../../components/header/header.js';
import { renderFooter } from '../../components/footer/footer.js';

const notFoundContent = `
  <div class="page-content">
    <section class="notfound-page">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a href="/index.html">Back to home</a>
    </section>
  </div>
`;

document.querySelector('#app').innerHTML = `
  ${renderHeader()}
  ${notFoundContent}
  ${renderFooter()}
`;