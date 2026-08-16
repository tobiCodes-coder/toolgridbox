import { writeFileSync } from 'fs';
import { tools } from '../src/data/tools.js';

const BASE = 'https://toolgridbox.pages.dev';

const pages = [
  { loc: '/index.html', priority: '1.0' },
  { loc: '/src/pages/tools/tools.html', priority: '0.9' },
  { loc: '/src/pages/about/about.html', priority: '0.5' },
  { loc: '/src/pages/contact/contact.html', priority: '0.5' }
];

const all = [...pages, ...tools.map(t => ({ loc: t.url, priority: '0.8' }))];

const urls = all.map(p => `  <url>
    <loc>${BASE}${p.loc}</loc>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync('public/sitemap.xml', xml);
console.log(`✅ sitemap.xml generated — ${all.length} URLs`);
