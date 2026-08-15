import { renderHeader, initHeader } from './components/header/header.js';
import { renderFooter, initFooter } from './components/footer/footer.js';
import { renderHome, initHomeEvents } from './pages/home/home.js';

document.querySelector('#app').innerHTML = renderHeader() + renderHome() + renderFooter();
document.querySelector('#app').classList.add('app-home');

// Header events attach
initHeader();

// Home events attach
initHomeEvents();

initFooter(); 

// Header height variable
function setHeaderHeightVar() {
  const header = document.querySelector('.site-header');
  if (header) {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
}

setHeaderHeightVar();
window.addEventListener('resize', setHeaderHeightVar);

// Back to top
document.addEventListener('click', (e) => {
  const backToTop = e.target.closest('.back-to-top');
  if (backToTop) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});