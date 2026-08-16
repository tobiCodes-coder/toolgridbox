import { readFileSync, writeFileSync } from 'fs';
import { tools } from '../src/data/tools.js';

const BASE = 'https://toolgridbox.pages.dev';
const esc = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');

let count = 0;
for (const t of tools) {
  const file = '.' + t.url;
  let html;
  try { html = readFileSync(file, 'utf8'); } catch { console.log('skip', t.url); continue; }
  if (html.includes('og:title')) { console.log('already', t.url); continue; }
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, 'Free Online Tool — ToolGrid'])[1].trim();
  const dm = html.match(/<meta name="description" content="([^"]*)"/);
  const desc = dm ? dm[1] : title + ' — free online tool by ToolGrid. Fast, simple, no signup required.';
  const canonical = html.includes('rel="canonical"') ? '' : '  <link rel="canonical" href="' + BASE + t.url + '" />\n';
  const block =
'  <meta property="og:type" content="website" />\n' +
'  <meta property="og:url" content="' + BASE + t.url + '" />\n' +
'  <meta property="og:title" content="' + esc(title) + '" />\n' +
'  <meta property="og:description" content="' + esc(desc) + '" />\n' +
'  <meta property="og:image" content="' + BASE + '/assets/og-image.png" />\n' +
'  <meta property="twitter:card" content="summary_large_image" />\n' +
'  <meta property="twitter:title" content="' + esc(title) + '" />\n' +
'  <meta property="twitter:description" content="' + esc(desc) + '" />\n' +
canonical;
  html = html.replace('</head>', block + '</head>');
  writeFileSync(file, html);
  count++;
  console.log('done', t.url);
}
console.log('TOTAL UPDATED: ' + count);
