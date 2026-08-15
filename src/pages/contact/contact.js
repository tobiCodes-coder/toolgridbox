import { renderHeader, initHeader } from '../../components/header/header.js';
import { renderFooter, initFooter } from '../../components/footer/footer.js';

const contactContent = `
<section class="contact-page">
    <div class="contact-header">
        <span class="section-badge">Contact Us</span>
        <h1>Let's get in touch</h1>
        <p>Have a question, suggestion or found a bug? We'd love to hear from you.</p>
    </div>

    <div class="contact-wrapper">
        <div class="contact-info">
            <h2>Get in Touch</h2>
            <p>Whether you have feedback, feature requests, bug reports or partnership ideas, feel free to reach out.</p>

            <div class="info-item">
                <h3>Email</h3>
                <p>support@toolgrid.dev</p>
            </div>

            <div class="info-item">
                <h3>Response Time</h3>
                <p>Usually within 24–48 hours.</p>
            </div>

            <div class="info-item">
                <h3>Privacy</h3>
                <p>Your message stays private and is never shared.</p>
            </div>
        </div>

        <form id="contactForm" class="contact-form">
            <label>
                Name
                <input type="text" name="name" placeholder="Your name" required>
            </label>

            <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required>
            </label>

            <label>
                Message
                <textarea name="message" rows="7" placeholder="Write your message..." required></textarea>
            </label>

            <button type="submit" id="submitBtn">Send Message →</button>
            <p id="formStatus" class="form-status"></p>
        </form>
    </div>
</section>
`;

// 1. Age DOM render
document.querySelector('#app').innerHTML = `
  ${renderHeader()}
  <div class="page-content">${contactContent}</div>
  ${renderFooter()}
`;

// 2. Tarpor header init
initHeader();
initFooter();

// 3. Form logic
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
      formStatus.textContent = "Message sent — thanks! I'll get back to you soon.";
      form.reset();
    } else {
      formStatus.textContent = 'Something went wrong. Please try again.';
    }
  } catch (err) {
    formStatus.textContent = 'Something went wrong. Please check your connection.';
  }

  submitBtn.disabled = false;
});