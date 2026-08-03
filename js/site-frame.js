/* ============================================================================
   ALLSTAR GALAXY V2 — UNIVERSAL SITE FRAME
   ----------------------------------------------------------------------------
   Builds the header, responsive navigation, dropdown menus, status bar, hero
   carousel, and footer used by every public page. Editing this file changes the
   shared framework site-wide. Page-specific content must not be added here.
============================================================================ */

function isActive(item,page){return item.id===page.active||(item.matches||[]).includes(page.active)}
function submenuMarkup(item){
 if(!item.submenu?.length)return'';
 return `<button class="submenu-toggle" type="button" aria-expanded="false" aria-label="Open ${item.label} menu"><span aria-hidden="true">⌄</span></button><div class="submenu" role="menu">${item.submenu.map(s=>`<a role="menuitem" href="${s.href}">${s.label}</a>`).join('')}</div>`
}
function navMarkup(site,page){
 return site.nav.map(n=>`<div class="nav-item ${isActive(n,page)?'is-active':''} ${n.id==='search'?'nav-search-item':''}"><a class="nav-link" href="${n.href}" ${isActive(n,page)?'aria-current="page"':''}>${n.label}</a>${submenuMarkup(n)}</div>`).join('')
}
export function mountSiteFrame(site,page){
 const host=document.querySelector('#site-frame');
 host.className='site-frame';
 host.innerHTML=`<header class="shared-header">
  <div class="identity-row">
   <a class="brand-home brand-home-left" href="index.html" aria-label="Allstar Galaxy home"><img class="brand-logo" src="${site.logo}" alt="Allstar Galaxy"></a>
   <img class="nav-title" src="${page.navTitle}" alt="The Official Home of the Allstar Galaxy">
   <a class="brand-home brand-home-right" href="index.html" aria-label="Allstar Galaxy home"><img class="brand-logo" src="${site.logo}" alt="Allstar Galaxy"></a>
   <a class="search-control" href="search.html" aria-label="Search Allstar Galaxy"><span aria-hidden="true">⌕</span><b>Search</b></a>
  </div>
  <nav class="main-nav" aria-label="Main navigation">${navMarkup(site,page)}</nav>
  <div class="status-module">
   <span class="status-border status-border-top" aria-hidden="true"></span>
   <span class="energy-rail energy-rail-top" aria-hidden="true"><i></i></span>
   <div class="status-bar">
    <span class="status-icon">${page.icon||'★'}</span>
    <span class="status-text">${page.ticker}</span>
    <a class="status-open" href="#main">OPEN →</a>
   </div>
   <span class="energy-rail energy-rail-bottom" aria-hidden="true"><i></i></span>
   <span class="status-border status-border-bottom" aria-hidden="true"></span>
  </div>
 </header>`;
 const hero=document.createElement('section');
 hero.className='hero';
 hero.setAttribute('aria-label',`${page.title} hero`);
 hero.innerHTML=`<div class="hero-track">${page.hero.map((src,i)=>`<img class="hero-slide" src="${src}" alt="${page.title} hero ${i+1}">`).join('')}</div><div class="hero-dots">${page.hero.map((_,i)=>`<button class="hero-dot ${i===0?'is-active':''}" aria-label="Show hero ${i+1}" data-index="${i}"></button>`).join('')}</div>`;
 host.after(hero);
 const track=hero.querySelector('.hero-track'),dots=[...hero.querySelectorAll('.hero-dot')];let index=0,timer;
 const show=i=>{if(!dots.length)return;index=(i+dots.length)%dots.length;track.style.transform=`translateX(-${index*100}%)`;dots.forEach((d,j)=>d.classList.toggle('is-active',j===index))};
 const restart=()=>{clearInterval(timer);if(dots.length>1)timer=setInterval(()=>show(index+1),7000)};
 dots.forEach(d=>d.addEventListener('click',()=>{show(+d.dataset.index);restart()}));restart();
 const closeAll=except=>host.querySelectorAll('.nav-item.is-open').forEach(x=>{if(x!==except){x.classList.remove('is-open');x.querySelector('.submenu-toggle')?.setAttribute('aria-expanded','false')}});
 host.querySelectorAll('.submenu-toggle').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const item=btn.closest('.nav-item'),open=!item.classList.contains('is-open');closeAll(item);item.classList.toggle('is-open',open);btn.setAttribute('aria-expanded',String(open))}));
 document.addEventListener('click',()=>closeAll());document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
}
export function mountFooter(site){
 const host=document.querySelector('#site-footer');host.className='site-footer';
 const socials=site.footer.social.map(name=>{const href=site.social?.[name]||'#';return `<a href="${href}" ${href==='#'?'':'target="_blank" rel="noopener"'} aria-label="${name}"><img src="assets/images/icons/social/${name}.png" alt=""></a>`}).join('');
 const links=(site.footer.links||[]).map(x=>`<a href="${x.href}">${x.label}</a>`).join('');
 host.innerHTML=`<div class="footer-inner">
  <section class="footer-brand-block"><strong>${site.footer.credit}</strong><small>Preserving every game, player, and memory.</small></section>
  <nav class="footer-links" aria-label="Footer navigation">${links}</nav>
  <div class="footer-social">${socials}</div>
  <div class="footer-divider"></div>
  <div class="footer-meta"><span>${site.footer.copyright}</span><small>Allstar Galaxy V2.2 • Universal shared framework • GitHub Pages</small></div>
 </div>`
}
