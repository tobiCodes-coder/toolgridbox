document.addEventListener('DOMContentLoaded', () => {
  const link = document.querySelector('.back-home');
  if (!link) return;

  link.addEventListener('click', (e) => {
    if (document.referrer && document.referrer.includes(window.location.host)) {
      e.preventDefault();
      window.history.back();
    }
  });
});