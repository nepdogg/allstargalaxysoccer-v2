/* ============================================================================
   ALLSTAR GALAXY V2.6 — UNIVERSAL SITE FRAME
   ----------------------------------------------------------------------------
   The identity row scrolls normally. Navigation and the status module live in
   their own sticky wrapper so they remain available on every long page.
============================================================================ */
function active(item,page){return item.id===page.active||(item.matches||[]).includes(page.active)}
function submenu(item){return !item.submenu?.length?'':`<button class="submenu-toggle" type="button" aria-expanded="false" aria-label="Open ${item.label} menu"><span>⌄</span></button><div class="submenu" role="menu">${item.submenu.map(link=>`<a role="menuitem" href="${link.href}">${link.label}</a>`).join('')}</div>`}
function nav(site,page){return site.nav.map(item=>`<div class="nav-item ${active(item,page)?'is-active':''} ${item.id==='search'?'nav-search-item':''}"><a class="nav-link" href="${item.href}" ${active(item,page)?'aria-current="page"':''}>${item.label}</a>${submenu(item)}</div>`).join('')}

export function mountSiteFrame(site,page){
  const host=document.querySelector('#site-frame');
  const images=Array.isArray(page.hero)?page.hero.map(value=>String(value||'').trim()).filter(Boolean):[];

  /* Identity row: intentionally not sticky, so the large branding scrolls away. */
  host.className='site-frame';
  host.innerHTML=`<header class="shared-header"><div class="identity-row"><a class="brand-home brand-home-left" href="index.html"><img class="brand-logo" src="${site.logo}" alt="Allstar Galaxy"></a><img class="nav-title" src="${page.navTitle}" alt="The Official Home of the Allstar Galaxy"><a class="brand-home brand-home-right" href="index.html"><img class="brand-logo" src="${site.logo}" alt="Allstar Galaxy"></a><a class="search-control" href="search.html"><span>⌕</span><b>Search</b></a></div></header>`;

  /* Sticky wrapper: navigation and status always travel together. */
  const sticky=document.createElement('div');
  sticky.className='sticky-navigation-shell';
  sticky.innerHTML=`<nav class="main-nav" aria-label="Main navigation">${nav(site,page)}</nav><div class="status-module"><span class="status-border status-border-top"></span><span class="energy-rail energy-rail-top"><i></i></span><div class="status-bar"><span class="status-icon">${page.icon||'★'}</span><span class="status-text">${page.ticker||''}</span><a class="status-open" href="#main">OPEN →</a></div><span class="energy-rail energy-rail-bottom"><i></i></span><span class="status-border status-border-bottom"></span></div>`;
  host.after(sticky);

  /* Hero carousel: one control dot is generated for every configured image. */
  const hero=document.createElement('section');
  hero.className='hero';
  hero.setAttribute('aria-label',`${page.title} hero`);
  hero.innerHTML=images.length?`<div class="hero-track">${images.map((src,index)=>`<img class="hero-slide" src="${src}" alt="${page.title} hero ${index+1}" ${index?'loading="lazy"':'fetchpriority="high"'}>`).join('')}</div><div class="hero-dots">${images.map((_,index)=>`<button class="hero-dot ${index?'':'is-active'}" type="button" aria-label="Show hero ${index+1}" aria-pressed="${!index}" data-index="${index}"></button>`).join('')}</div>`:`<div class="placeholder-panel">Hero image not configured.</div>`;
  sticky.after(hero);

  const track=hero.querySelector('.hero-track');
  const dots=[...hero.querySelectorAll('.hero-dot')];
  let index=0,timer;
  const show=next=>{if(!track||!dots.length)return;index=(next+dots.length)%dots.length;track.style.transform=`translateX(-${index*100}%)`;dots.forEach((dot,dotIndex)=>{dot.classList.toggle('is-active',dotIndex===index);dot.setAttribute('aria-pressed',String(dotIndex===index))})};
  const restart=()=>{clearInterval(timer);if(dots.length>1)timer=setInterval(()=>show(index+1),Number(page.heroInterval)||7000)};
  dots.forEach(dot=>dot.onclick=()=>{show(+dot.dataset.index);restart()});
  restart();

  const closeMenus=exception=>host.ownerDocument.querySelectorAll('.nav-item.is-open').forEach(item=>{if(item!==exception){item.classList.remove('is-open');item.querySelector('.submenu-toggle')?.setAttribute('aria-expanded','false')}});
  sticky.querySelectorAll('.submenu-toggle').forEach(button=>button.onclick=event=>{event.preventDefault();event.stopPropagation();const item=button.closest('.nav-item');const open=!item.classList.contains('is-open');closeMenus(item);item.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open))});
  document.addEventListener('click',()=>closeMenus());
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenus()});
}

export function mountFooter(site){
  const footer=document.querySelector('#site-footer');
  footer.className='site-footer';
  const cfg=site.footer||{};
  const socials=(cfg.social||[]).map(name=>{const href=site.social?.[name]||'#';return `<a href="${href}" ${href==='#'?'':'target="_blank" rel="noopener"'} aria-label="${name}"><img src="assets/images/icons/social/${name}.png" alt=""></a>`}).join('');
  const links=(cfg.links||[]).map(link=>`<a href="${link.href}">${link.label}</a>`).join('');
  const logo=cfg.xitlaliLogo?`<a class="footer-xitlali-logo" href="${cfg.xitlaliHref||'#'}" ${cfg.xitlaliHref?'target="_blank" rel="noopener"':''}><img src="${cfg.xitlaliLogo}" alt="Xitlali Media"></a>`:'';
  const contact=cfg.contactEmail?`<a class="footer-contact" href="mailto:${cfg.contactEmail}"><span aria-hidden="true">✉</span>${cfg.contactLabel||'Contact Administrator'}</a>`:'';

  footer.innerHTML=`<div class="footer-inner"><section class="footer-brand-block">${logo}<div><strong>${cfg.credit||''}</strong><small>${cfg.description||''}</small><em>${cfg.tagline||''}</em></div></section><nav class="footer-links" aria-label="Footer navigation">${links}</nav><div class="footer-actions">${contact}<div class="footer-social">${socials}</div></div><div class="footer-divider"></div><div class="footer-meta"><span>${cfg.copyright||''}</span><small>${cfg.version||'Allstar Galaxy V2.6'}</small></div></div>`;
}
