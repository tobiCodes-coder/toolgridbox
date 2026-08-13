const FONTS = [
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Playfair Display',
  'Merriweather', 'Raleway', 'Nunito', 'Inter', 'Oswald', 'Source Sans Pro',
  'Lora', 'Work Sans', 'PT Sans', 'Rubik', 'Josefin Sans', 'Quicksand',
  'DM Sans', 'Space Grotesk'
];

const headingFont = document.querySelector('#headingFont');
const bodyFont = document.querySelector('#bodyFont');
const shuffleBtn = document.querySelector('#shuffleBtn');
const previewHeading = document.querySelector('#previewHeading');
const previewBody = document.querySelector('#previewBody');
const cssOutput = document.querySelector('#cssOutput');
const copyBtn = document.querySelector('#copyBtn');
const statusMsg = document.querySelector('#statusMsg');

function loadFontLink(font) {
  const id = `font-${font.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
}

function populateSelects() {
  FONTS.forEach(font => {
    const opt1 = document.createElement('option');
    opt1.value = font;
    opt1.textContent = font;
    headingFont.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = font;
    opt2.textContent = font;
    bodyFont.appendChild(opt2);
  });

  headingFont.value = 'Playfair Display';
  bodyFont.value = 'Open Sans';
}

function applyFonts() {
  const heading = headingFont.value;
  const body = bodyFont.value;

  loadFontLink(heading);
  loadFontLink(body);

  previewHeading.style.fontFamily = `'${heading}', sans-serif`;
  previewBody.style.fontFamily = `'${body}', sans-serif`;

  cssOutput.textContent = `/* Heading */
font-family: '${heading}', sans-serif;

/* Body */
font-family: '${body}', sans-serif;

/* Add this to your <head> to load these fonts: */
<link href="https://fonts.googleapis.com/css2?family=${heading.replace(/\s+/g, '+')}:wght@400;600;700&family=${body.replace(/\s+/g, '+')}:wght@400;600&display=swap" rel="stylesheet">`;

  statusMsg.textContent = '';
}

headingFont.addEventListener('change', applyFonts);
bodyFont.addEventListener('change', applyFonts);

shuffleBtn.addEventListener('click', () => {
  headingFont.value = FONTS[Math.floor(Math.random() * FONTS.length)];
  bodyFont.value = FONTS[Math.floor(Math.random() * FONTS.length)];
  applyFonts();
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(cssOutput.textContent).then(() => {
    statusMsg.textContent = 'Copied to clipboard.';
  });
});

populateSelects();
applyFonts();