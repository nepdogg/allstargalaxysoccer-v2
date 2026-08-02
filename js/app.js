
import { mountSiteFrame, mountFooter } from './site-frame.js';
const pageId=document.body.dataset.page;
const [site,page]=await Promise.all([fetch('data/site-config.json').then(r=>r.json()),fetch(`data/pages/${pageId}.json`).then(r=>r.json())]);
document.documentElement.style.setProperty('--accent',page.accent);document.documentElement.style.setProperty('--accent-rgb',page.rgb);document.body.style.setProperty('--site-bg',`url("${site.background}")`);
mountSiteFrame(site,page);mountFooter(site,page);
window.AllstarGalaxy={site,page};
