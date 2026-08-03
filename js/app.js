/* ============================================================================
   ALLSTAR GALAXY V2 — PUBLIC PAGE BOOTSTRAP
   ----------------------------------------------------------------------------
   PURPOSE
   This small entry file starts every public page.

   HOW IT WORKS
   1. Reads the page key from <body data-page="...">.
   2. Loads the shared site configuration from data/site-config.json.
   3. Loads only that page's configuration from data/pages/<page>.json.
   4. Applies the page accent color and universal galaxy background.
   5. Mounts the shared header/status/hero and shared footer.

   EDITING RULE
   Do not place page-specific content here. Page-only behavior belongs in
   js/pages/<page>.js so it cannot accidentally affect another page.
============================================================================ */
import { mountSiteFrame, mountFooter } from './site-frame.js';

const pageId = document.body.dataset.page;

if (!pageId) {
  throw new Error('Missing body[data-page]. Every public page must declare its page key.');
}

const [site, page] = await Promise.all([
  fetch('data/site-config.json').then(response => {
    if (!response.ok) throw new Error('Unable to load data/site-config.json');
    return response.json();
  }),
  fetch(`data/pages/${pageId}.json`).then(response => {
    if (!response.ok) throw new Error(`Unable to load data/pages/${pageId}.json`);
    return response.json();
  })
]);

document.documentElement.style.setProperty('--accent', page.accent);
document.documentElement.style.setProperty('--accent-rgb', page.rgb);
document.body.style.setProperty('--site-bg', `url("${site.background}")`);

mountSiteFrame(site, page);
mountFooter(site);

/* Exposed for troubleshooting from the browser console. */
window.AllstarGalaxy = { site, page };
