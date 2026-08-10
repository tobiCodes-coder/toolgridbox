import { renderHeader } from './components/header/header.js';
import { renderFooter } from './components/footer/footer.js';
import { renderHome, initHomeEvents } from './pages/home/home.js';

document.querySelector('#app').innerHTML = renderHeader() + renderHome() + renderFooter();
initHomeEvents();