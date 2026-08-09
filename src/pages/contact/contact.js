import { renderHeader } from '../../components/header/header.js';
import { renderFooter } from '../../components/footer/footer.js';

const contactContent = `
  <section class="contact-page">
    <h1>Contact</h1>
    <p>Have a question, suggestion, or found a bug? Reach out.</p>
    <p>Email: <a href="mailto:hello@toolgrid.com">hello@toolgrid.com</a></p>
  </section>
`;

document.querySelector('#app').innerHTML = renderHeader() + contactContent + renderFooter();