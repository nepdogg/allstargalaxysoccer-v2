/* ============================================================================
   ALLSTAR GALAXY V2.8 — UNIVERSAL SITE FRAME
   ----------------------------------------------------------------------------
   The complete masthead (identity, navigation, and status) is one sticky unit.
   This keeps the title, logos, navigation, and status available together on
   every public page while the hero and page content scroll normally.
============================================================================ */
function active(item,page){return item.id===page.active||(item.matches||[]).includes(page.active)}
function submenu(item){return !item.submenu?.length?'':`<button class="submenu-toggle" type="button" aria-expanded="false" aria-label="Open ${item.label} menu"><span>⌄</span></button><div class="submenu" role="menu">${item.submenu.map(link=>`<a role="menuitem" href="${link.href}">${link.label}</a>`).join('')}</div>`}
function nav(site,page){return site.nav.map(item=>`<div class="nav-item ${active(item,page)?'is-active':''} ${item.id==='search'?'nav-search-item':''}"><a class="nav-link" href="${item.href}" ${active(item,page)?'aria-current="page"':''}>${item.label}</a>${submenu(item)}</div>`).join('')}

export function mountSiteFrame(site,page){
  /* A real fixed element is more dependable than nested CSS backgrounds. */
  if(!document.querySelector('.galaxy-backdrop')){
    const backdrop=document.createElement('div');
    backdrop.className='galaxy-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    document.body.prepend(backdrop);
  }
  const host=document.querySelector('#site-frame');
  const images=Array.isArray(page.hero)?page.hero.map(value=>String(value||'').trim()).filter(Boolean):[];

  /*
     UNIVERSAL STICKY MASTHEAD
     The complete header is rendered inside one sticky .site-frame. Keeping the
     identity, navigation, and status together prevents the title from scrolling
     away while the buttons remain behind.
  */
  host.className='site-frame universal-sticky-masthead';
  host.innerHTML=`<header class="shared-header">
    <div class="identity-row">
      <a class="brand-home brand-home-left" href="index.html"><img class="brand-logo" src="${site.logo}" alt="Allstar Galaxy"></a>
      <img class="nav-title" src="${page.navTitle}" alt="The Official Home of the Allstar Galaxy">
      <a class="brand-home brand-home-right" href="index.html"><img class="brand-logo" src="${site.logo}" alt="Allstar Galaxy"></a>
      <a class="search-control" href="search.html"><span>⌕</span><b>Search</b></a>
    </div>
    <nav class="main-nav" aria-label="Main navigation">${nav(site,page)}</nav>
    <div class="status-module">
      <span class="status-border status-border-top"></span>
      <span class="energy-rail energy-rail-top"><i></i></span>
      <div class="status-bar">
        <a class="status-open status-open-left" href="#main" aria-label="Open page content">← OPEN</a>
        <span class="status-icon status-icon-left" aria-hidden="true">${page.icon||'★'}</span>
        <span class="status-text">${page.ticker||''}</span>
        <span class="status-icon status-icon-right" aria-hidden="true">${page.icon||'★'}</span>
        <a class="status-open status-open-right" href="#main" aria-label="Open page content">OPEN →</a>
      </div>
      <span class="energy-rail energy-rail-bottom"><i></i></span>
      <span class="status-border status-border-bottom"></span>
    </div>
  </header>`;

  /* Hero carousel remains below the sticky masthead and scrolls with the page. */
  const hero=document.createElement('section');
  hero.className='hero';
  hero.setAttribute('aria-label',`${page.title} hero`);
  hero.innerHTML=images.length?`<div class="hero-track">${images.map((src,index)=>`<img class="hero-slide" src="${src}" alt="${page.title} hero ${index+1}" ${index?'loading="lazy"':'fetchpriority="high"'}>`).join('')}</div><div class="hero-dots">${images.map((_,index)=>`<button class="hero-dot ${index?'':'is-active'}" type="button" aria-label="Show hero ${index+1}" aria-pressed="${!index}" data-index="${index}"></button>`).join('')}</div>`:`<div class="placeholder-panel">Hero image not configured.</div>`;
  host.after(hero);

  const track=hero.querySelector('.hero-track');
  const dots=[...hero.querySelectorAll('.hero-dot')];
  let index=0,timer;
  const show=next=>{if(!track||!dots.length)return;index=(next+dots.length)%dots.length;track.style.transform=`translateX(-${index*100}%)`;dots.forEach((dot,dotIndex)=>{dot.classList.toggle('is-active',dotIndex===index);dot.setAttribute('aria-pressed',String(dotIndex===index))})};
  const restart=()=>{clearInterval(timer);if(dots.length>1)timer=setInterval(()=>show(index+1),Number(page.heroInterval)||7000)};
  dots.forEach(dot=>dot.onclick=()=>{show(+dot.dataset.index);restart()});
  restart();

  const closeMenus=exception=>host.ownerDocument.querySelectorAll('.nav-item.is-open').forEach(item=>{if(item!==exception){item.classList.remove('is-open');item.querySelector('.submenu-toggle')?.setAttribute('aria-expanded','false')}});
  host.querySelectorAll('.submenu-toggle').forEach(button=>button.onclick=event=>{event.preventDefault();event.stopPropagation();const item=button.closest('.nav-item');const open=!item.classList.contains('is-open');closeMenus(item);item.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open))});
  document.addEventListener('click',()=>closeMenus());
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenus()});
}

export function mountFooter(site){
  const footer=document.querySelector('#site-footer');
  footer.className='site-footer';
  const cfg=site.footer||{};
  const socials=(cfg.social||[]).map(name=>{const href=site.social?.[name]||'#';return `<a class="social-${name}" data-social="${name}" href="${href}" ${href==='#'?'':'target="_blank" rel="noopener"'} aria-label="${name}"><img src="assets/images/icons/social/${name}.png" alt=""></a>`}).join('');
  const links=(cfg.links||[]).map(link=>`<a href="${link.href}">${link.label}</a>`).join('');
  const logo=cfg.xitlaliLogo?`<a class="footer-xitlali-logo" href="${cfg.xitlaliHref||'#'}" ${cfg.xitlaliHref?'target="_blank" rel="noopener"':''}><img src="${cfg.xitlaliLogo}" alt="Xitlali Media"></a>`:'';
  const contact=cfg.contactEmail?`<a class="footer-contact" href="mailto:${cfg.contactEmail}"><span aria-hidden="true">✉</span>${cfg.contactLabel||'Contact Administrator'}</a>`:'';
  const copyrightLogo=site.logo?`<img class="footer-copyright-logo" src="${site.logo}" alt="">`:'';

  footer.innerHTML=`<div class="footer-inner">
    <section class="footer-brand-block">${logo}<div><strong>${cfg.credit||''}</strong><small>${cfg.description||''}</small><em>${cfg.tagline||''}</em></div></section>
    <section class="footer-navigation-zone"><nav class="footer-links" aria-label="Footer navigation">${links}</nav>${contact}</section>
    <div class="footer-social">${socials}</div>
    <div class="footer-divider"></div>
    <div class="footer-meta"><span class="footer-copyright">${copyrightLogo}<span>${cfg.copyright||''}</span></span><small>${cfg.version||'Allstar Galaxy V2.7'}</small></div>
  </div>`;
}

