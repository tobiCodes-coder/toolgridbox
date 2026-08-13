import { renderHeader } from '../../components/header/header.js';
import { renderFooter } from '../../components/footer/footer.js';

const contactContent = `
  <section class="contact-page">
    <h1>Contact</h1>
    <p>Have a question, suggestion, or found a bug? Send a message below.</p>

    <form id="contactForm" class="contact-form">
      <label>
        Name
        <input type="text" name="name" required />
      </label>
      <label>
        Email
        <input type="email" name="email" required />
      </label>
      <label>
        Message
        <textarea name="message" rows="5" required></textarea>
      </label>
      <button type="submit" id="submitBtn">Send message</button>
      <p id="formStatus" class="form-status"></p>
    </form>
  </section>
`;

document.querySelector('#app').innerHTML = `
  ${renderHeader()}
  <div class="page-content">${contactContent}</div>
  ${renderFooter()}
`;

const form = document.querySelector('#contactForm');
const submitBtn = document.querySelector('#submitBtn');
const formStatus = document.querySelector('#formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  formStatus.textContent = 'Sending...';

  try {
    const response = await fetch('https://formspree.io/f/mnpavlla', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });

    if (response.ok) {
      formStatus.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
      form.reset();
    } else {
      formStatus.textContent = 'Something went wrong. Please try again.';
    }
  } catch (err) {
    formStatus.textContent = 'Something went wrong. Please check your connection.';
  }

  submitBtn.disabled = false;
});