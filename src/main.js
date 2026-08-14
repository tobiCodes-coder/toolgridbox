import { renderHeader } from './components/header/header.js';
import { renderFooter } from './components/footer/footer.js';
import { renderHome, initHomeEvents } from './pages/home/home.js';

document.querySelector('#app').innerHTML = renderHeader() + renderHome() + renderFooter();
initHomeEvents();

function setHeaderHeightVar() {
  const header = document.querySelector('.site-header');
  if (header) {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
}

setHeaderHeightVar();
window.addEventListener('resize', setHeaderHeightVar);

document.addEventListener('click', (e) => {
  const backToTop = e.target.closest('.back-to-top');
  if (backToTop) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});