import { renderHeader, initHeader } from '../../components/header/header.js';
import { renderFooter, initFooter } from '../../components/footer/footer.js';

const contactContent = `
<section class="contact-page">
    <div class="contact-header reveal">
        <span class="section-badge">Contact Us</span>
        <h1>Let's get in touch</h1>
        <p class="contact-subtitle">Have a question, suggestion or found a bug? We'd love to hear from you.</p>
    </div>

    <div class="contact-wrapper">
        <div class="contact-info reveal">
            <h2>Get in Touch</h2>
            <p class="info-intro">Whether you have feedback, feature requests, bug reports or partnership ideas, feel free to reach out.</p>

            <div class="info-cards">
                <div class="info-card">
                    <div class="info-icon">✉️</div>
                    <div class="info-text">
                        <h3>Email</h3>
                        <p>support@toolgrid.dev</p>
                    </div>
                </div>

                <div class="info-card">
                    <div class="info-icon">⏱️</div>
                    <div class="info-text">
                        <h3>Response Time</h3>
                        <p>Usually within 24–48 hours.</p>
                    </div>
                </div>

                <div class="info-card">
                    <div class="info-icon">🔒</div>
                    <div class="info-text">
                        <h3>Privacy</h3>
                        <p>Your message stays private and is never shared.</p>
                    </div>
                </div>
            </div>
        </div>

        <form id="contactForm" class="contact-form reveal" novalidate>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" required>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="you@example.com" required>
            </div>

            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="6" placeholder="Write your message..." required></textarea>
            </div>

            <button type="submit" id="submitBtn" class="btn btn-primary submit-btn">
                <span class="btn-text">Send Message</span>
                <span class="btn-arrow">→</span>
            </button>
            
            <div id="formStatus" class="form-status" aria-live="polite"></div>
        </form>
    </div>
</section>
`;

document.querySelector('#app').innerHTML = `
  ${renderHeader()}
  <div class="page-content">${contactContent}</div>
  ${renderFooter()}
`;

initHeader();
initFooter();

// Form logic
const form = document.querySelector('#contactForm');
const submitBtn = document.querySelector('#submitBtn');
const formStatus = document.querySelector('#formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  formStatus.textContent = 'Sending...';
  formStatus.className = 'form-status loading';

  try {
    const response = await fetch('https://formspree.io/f/mnpavlla', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });

    if (response.ok) {
      formStatus.textContent = "✅ Message sent — thanks! I'll get back to you soon.";
      formStatus.className = 'form-status success';
      form.reset();
    } else {
      formStatus.textContent = '⚠️ Something went wrong. Please try again.';
      formStatus.className = 'form-status error';
    }
  } catch (err) {
    formStatus.textContent = '⚠️ Network error. Please check your connection.';
    formStatus.className = 'form-status error';
  }

  submitBtn.disabled = false;
  submitBtn.classList.remove('loading');
});

// Scroll reveal
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