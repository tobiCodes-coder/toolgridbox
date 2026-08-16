(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(){let e=window.location.pathname,t=e===`/`||e.endsWith(`/index.html`)||e.endsWith(`/`),n=e.includes(`/tools/tools.html`),r=e.includes(`/about/about.html`),i=e.includes(`/contact/contact.html`);return`
    <header class="site-header">
      <div class="site-header-inner">
        <a href="/index.html" class="logo" aria-label="ToolGrid home">
          <span class="logo-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span class="logo-text">ToolGrid</span>
        </a>

        <button
          class="nav-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="site-nav"
          aria-label="Open menu"
        >
          <span class="nav-toggle-icon" aria-hidden="true"></span>
        </button>

        <nav id="site-nav" class="site-nav" aria-label="Main navigation">
          <a href="/index.html" class="${t?`active`:``}">Home</a>
          <a href="/src/pages/tools/tools.html" class="${n?`active`:``}">Tools</a>
          <a href="/src/pages/about/about.html" class="${r?`active`:``}">About</a>
          <a href="/src/pages/contact/contact.html" class="${i?`active`:``}">Contact</a>
        </nav>
      </div>
    </header>
  `}function t(){let e=document.querySelector(`.site-header`),t=e?.querySelector(`.nav-toggle`),n=e?.querySelector(`.site-nav`);if(!e||!t||!n)return;let r=()=>{n.classList.remove(`open`),t.setAttribute(`aria-expanded`,`false`),t.setAttribute(`aria-label`,`Open menu`)};t.addEventListener(`click`,()=>{let e=n.classList.toggle(`open`);t.setAttribute(`aria-expanded`,String(e)),t.setAttribute(`aria-label`,e?`Close menu`:`Open menu`)}),n.querySelectorAll(`a`).forEach(e=>{e.addEventListener(`click`,r)}),document.addEventListener(`click`,t=>{!e.contains(t.target)&&n.classList.contains(`open`)&&r()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&n.classList.contains(`open`)&&(r(),t.focus())})}function n(){return`
    <footer class="site-footer">
      <div class="footer-container">

        <div class="footer-main">

          <div class="footer-brand">
            <a href="/index.html" class="footer-logo" aria-label="ToolGrid home">
              <span class="footer-logo-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
              <span class="footer-logo-text">ToolGrid</span>
            </a>
            <p class="footer-tagline">
              Free, fast, browser-based tools for developers
              and designers. No signup, no uploads, no cost.
            </p>
            <div class="footer-socials">
              <a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener" aria-label="Twitter/X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="mailto:support@toolgrid.dev" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>

          <div class="footer-nav">

            <div class="footer-col">
              <h4>Pages</h4>
              <nav class="footer-links" aria-label="Footer pages">
                <a href="/index.html">Home</a>
                <a href="/src/pages/tools/tools.html">All Tools</a>
                <a href="/src/pages/about/about.html">About</a>
                <a href="/src/pages/contact/contact.html">Contact</a>
              </nav>
            </div>

            <div class="footer-col">
              <h4>Categories</h4>
              <nav class="footer-links" aria-label="Footer categories">
                <a href="/src/pages/tools/tools.html">Image Tools</a>
                <a href="/src/pages/tools/tools.html">PDF Tools</a>
                <a href="/src/pages/tools/tools.html">Developer Tools</a>
                <a href="/src/pages/tools/tools.html">Design Tools</a>
              </nav>
            </div>

            <div class="footer-col">
              <h4>Popular</h4>
              <nav class="footer-links" aria-label="Footer popular tools">
                <a href="/src/tools/image-resizer/image-resizer.html">Image Resizer</a>
                <a href="/src/tools/pdf-merge/pdf-merge.html">PDF Merge</a>
                <a href="/src/tools/qr-generator/qr-generator.html">QR Generator</a>
                <a href="/src/tools/json-formatter/json-formatter.html">JSON Formatter</a>
              </nav>
            </div>

          </div>

        </div>

        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} ToolGrid. All rights reserved.</p>
          <button class="back-to-top" type="button" aria-label="Back to top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            Back to top
          </button>
        </div>

      </div>
    </footer>
  `}function r(){document.addEventListener(`click`,e=>{if(!e.target.closest(`.back-to-top`))return;e.preventDefault();let t=document.querySelector(`#app`);t&&t.scrollTo({top:0,behavior:`smooth`}),window.scrollTo({top:0,behavior:`smooth`})})}var i=[{number:`32+`,label:`Free tools`},{number:`100%`,label:`Free forever`},{number:`0`,label:`Signups required`}],a=[{name:`Text diff highlighter`,icon:`DIFF`,url:`/src/tools/text-diff/text-diff.html`},{name:`QR generator`,icon:`QR`,url:`/src/tools/qr-generator/qr-generator.html`},{name:`Image compressor`,icon:`IMG`,url:`/src/tools/image-compressor/image-compressor.html`},{name:`JSON formatter`,icon:`{ }`,url:`/src/tools/json-formatter/json-formatter.html`},{name:`Encode, decode & hash`,icon:`DEC`,url:`/src/tools/converter/converter.html`},{name:`Data visualizer`,icon:`CHT`,url:`/src/tools/data-visualizer/data-visualizer.html`},{name:`CSS gradient generator`,icon:`GRD`,url:`/src/tools/gradient-generator/gradient-generator.html`},{name:`Algorithm visualizer`,icon:`ALG`,url:`/src/tools/algorithm-visualizer/algorithm-visualizer.html`},{name:`Box shadow generator`,icon:`BXS`,url:`/src/tools/box-shadow/box-shadow.html`},{name:`PDF password protect`,icon:`PDF`,url:`/src/tools/pdf-password-protect/pdf-password-protect.html`},{name:`PDF page number adder`,icon:`PDF`,url:`/src/tools/pdf-page-numbers/pdf-page-numbers.html`},{name:`PDF metadata editor`,icon:`PDF`,url:`/src/tools/pdf-metadata-editor/pdf-metadata-editor.html`},{name:`PDF page organizer`,icon:`PDF`,url:`/src/tools/pdf-page-organizer/pdf-page-organizer.html`}],o=[{title:`100% free`,desc:`Every tool is free to use, with no hidden limits or paywalls.`,icon:`✓`},{title:`No signup`,desc:`Jump straight into any tool. No account, no email required.`,icon:`⚡`},{title:`Runs in your browser`,desc:`Tools run entirely on your device — fast, with no server round-trip.`,icon:`🚀`},{title:`Privacy first`,desc:`Your files and data are never uploaded anywhere. Nothing leaves your device.`,icon:`🔒`}],s=[{q:`Is ToolGrid really free?`,a:`Yes — every tool on this site is completely free to use, with no hidden fees or usage limits.`},{q:`Do I need to create an account?`,a:`No signup is required for any tool. Just open a tool and start using it.`},{q:`Is my data uploaded anywhere?`,a:`No. Every tool runs directly in your browser — your files and data never leave your device.`},{q:`Can I use these tools on mobile?`,a:`Yes, all tools are designed to work on both desktop and mobile browsers.`}];function c(){return i.map(e=>`
    <div class="stat-item">
      <span class="stat-number">${e.number}</span>
      <span class="stat-label">${e.label}</span>
    </div>
  `).join(``)}function l(){return a.map(e=>`
    <a href="${e.url}" class="mini-tool-card">
      <i class="icon">${e.icon}</i>
      <span>${e.name}</span>
    </a>
  `).join(``)}function u(){return o.map(e=>`
    <div class="feature-card">
      <span class="feature-icon">${e.icon}</span>
      <h3>${e.title}</h3>
      <p>${e.desc}</p>
    </div>
  `).join(``)}function d(){return s.map(e=>`
    <details class="faq-item">
      <summary>${e.q}<span class="faq-arrow">+</span></summary>
      <div class="faq-answer">${e.a}</div>
    </details>
  `).join(``)}function f(){return`
    <div class="page-content">
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <span class="hero-badge">Free & open to everyone</span>
          <h1>Free online tools<br>for developers</h1>
          <p>Fast, simple tools that run entirely in your browser. No signup, no uploads, no cost.</p>
          <div class="hero-actions">
            <a href="/src/pages/tools/tools.html" class="hero-cta">
              Browse all tools
              <span class="hero-cta-arrow">→</span>
            </a>
            <a href="/src/pages/about/about.html" class="hero-cta-secondary">
              Learn more
            </a>
          </div>
          <div class="hero-stats">
            ${c()}
          </div>
        </div>
      </section>
      

      <section class="popular-tools reveal">
        <div class="section-header">
          <h2>Popular tools</h2>
          <p>Most used tools by our community</p>
        </div>
        <div class="mini-tool-grid">
          ${l()}
        </div>
        <a href="/src/pages/tools/tools.html" class="view-all-link">
          View all tools
          <span>→</span>
        </a>
      </section>

      <section class="why-choose-us reveal">
        <div class="section-header">
          <h2>Why choose ToolGrid</h2>
          <p>Built with simplicity and privacy in mind</p>
        </div>
        <div class="feature-grid">
          ${u()}
        </div>
      </section>

      <section class="faq-section reveal">
        <div class="section-header">
          <h2>Frequently asked questions</h2>
          <p>Everything you need to know</p>
        </div>
        <div class="faq-list">
          ${d()}
        </div>
      </section>
      <button class="scroll-down" type="button" aria-label="Scroll down">↓</button>
    </div>
  `}function p(){let e=document.querySelectorAll(`.reveal`),t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`revealed`),t.unobserve(e.target))})},{threshold:.15});e.forEach(e=>t.observe(e));let n=document.querySelector(`.scroll-down`),r=document.querySelector(`#app`);if(n&&r){let e=[`.hero`,`.popular-tools`,`.why-choose-us`,`.faq-section`];n.addEventListener(`click`,()=>{let t=e.map(e=>document.querySelector(e)).filter(Boolean),n=r.scrollTop,i=t.find(e=>e.offsetTop>n+100);i?r.scrollTo({top:i.offsetTop,behavior:`smooth`}):r.scrollTo({top:r.scrollHeight,behavior:`smooth`})}),r.addEventListener(`scroll`,()=>{let e=r.scrollTop+r.clientHeight>=r.scrollHeight-40;n.style.opacity=e?`0`:`1`,n.style.pointerEvents=e?`none`:`auto`})}}document.querySelector(`#app`).innerHTML=e()+f()+n(),document.querySelector(`#app`).classList.add(`app-home`),t(),p(),r();function m(){let e=document.querySelector(`.site-header`);e&&document.documentElement.style.setProperty(`--header-h`,e.offsetHeight+`px`)}m(),window.addEventListener(`resize`,m),document.addEventListener(`click`,e=>{e.target.closest(`.back-to-top`)&&(e.preventDefault(),window.scrollTo({top:0,behavior:`smooth`}))});