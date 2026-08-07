/* ============================================================================
   ALLSTAR GALAXY V3.3 — UNIVERSAL SITE FRAME
   Shared header, section-colored navigation, status, hero and footer.
============================================================================ */
function active(item,page){return item.id===page.active||(item.matches||[]).includes(page.active)}
function submenu(item){return !item.submenu?.length?'':`<button class="submenu-toggle" type="button" aria-expanded="false" aria-label="Open ${item.label} menu"><span>⌄</span></button><div class="submenu" role="menu">${item.submenu.map(x=>`<a role="menuitem" href="${x.href}">${x.label}</a>`).join('')}</div>`}
function nav(site,page){return site.nav.map(item=>`<div class="nav-item ${active(item,page)?'is-active':''} ${item.id==='search'?'nav-search-item':''}"><a class="nav-link" href="${item.href}" ${active(item,page)?'aria-current="page"':''}>${item.label}</a>${submenu(item)}</div>`).join('')}

export function mountSiteFrame(site,page){
 const host=document.querySelector('#site-frame');
 const images=Array.isArray(page.hero)?page.hero.map(x=>String(x||'').trim()).filter(Boolean):[];
 host.className='site-frame';
 host.innerHTML=`<header class="shared-header"><div class="identity-row"><a class="brand-home brand-home-left" href="index.html"><img class="brand-logo" src="${site.logo}" alt="Allstar Galaxy"></a><img class="nav-title" src="${page.navTitle}" alt="The Official Home of the Allstar Galaxy"><a class="brand-home brand-home-right" href="index.html"><img class="brand-logo" src="${site.logo}" alt="Allstar Galaxy"></a><a class="search-control" href="search.html"><span>⌕</span><b>Search</b></a></div><nav class="main-nav" aria-label="Main navigation">${nav(site,page)}</nav><div class="status-module"><span class="status-border status-border-top"></span><span class="energy-rail energy-rail-top"><i></i></span><div class="status-bar"><span class="status-side status-side-left" aria-hidden="true"><span class="status-icon">${page.icon||'★'}</span><span class="status-open">OPEN →</span></span><a class="status-text status-message-link" href="${page.tickerHref||page.statusHref||'#main'}">${page.ticker||''}</a><span class="status-side status-side-right" aria-hidden="true"><span class="status-open">← OPEN</span><span class="status-icon">${page.icon||'★'}</span></span></div><span class="energy-rail energy-rail-bottom"><i></i></span><span class="status-border status-border-bottom"></span></div></header>`;

 const hero=document.createElement('section'); hero.className='hero'; hero.setAttribute('aria-label',`${page.title} hero`);
 hero.innerHTML=images.length?`<div class="hero-track">${images.map((src,i)=>`<img class="hero-slide" src="${src}" alt="${page.title} hero ${i+1}" ${i?'loading="lazy"':'fetchpriority="high"'}>`).join('')}</div><div class="hero-dots">${images.map((_,i)=>`<button class="hero-dot ${i?'':'is-active'}" type="button" aria-label="Show hero ${i+1}" aria-pressed="${!i}" data-index="${i}"></button>`).join('')}</div>`:`<div class="placeholder-panel">Hero image not configured.</div>`;
 host.after(hero);
 const track=hero.querySelector('.hero-track'),dots=[...hero.querySelectorAll('.hero-dot')]; let index=0,timer;
 const show=i=>{if(!track||!dots.length)return;index=(i+dots.length)%dots.length;track.style.transform=`translateX(-${index*100}%)`;dots.forEach((d,j)=>{d.classList.toggle('is-active',j===index);d.setAttribute('aria-pressed',String(j===index))})};
 const restart=()=>{clearInterval(timer);if(dots.length>1)timer=setInterval(()=>show(index+1),Number(page.heroInterval)||7000)};
 dots.forEach(d=>d.onclick=()=>{show(+d.dataset.index);restart()}); restart();

 /* Forgiving dropdown behavior: hover bridge + 280ms close delay + click/touch. */
 const items=[...host.querySelectorAll('.nav-item')];
 const closeAll=except=>items.forEach(item=>{if(item!==except){item.classList.remove('is-open');item.querySelector('.submenu-toggle')?.setAttribute('aria-expanded','false')}});
 items.forEach(item=>{
   const button=item.querySelector('.submenu-toggle'); if(!button)return;
   let closeTimer;
   const open=()=>{clearTimeout(closeTimer);closeAll(item);item.classList.add('is-open');button.setAttribute('aria-expanded','true')};
   const delayedClose=()=>{clearTimeout(closeTimer);closeTimer=setTimeout(()=>{item.classList.remove('is-open');button.setAttribute('aria-expanded','false')},280)};
   item.addEventListener('mouseenter',open); item.addEventListener('mouseleave',delayedClose);
   button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();item.classList.contains('is-open')?delayedClose():open()});
 });
 document.addEventListener('click',()=>closeAll()); document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
}

export function mountFooter(site){
 const host=document.querySelector('#site-footer'); host.className='site-footer';
 const socials=(site.footer.social||[]).map(name=>{const href=site.social?.[name]||'#';return`<a data-social="${name}" href="${href}" ${href==='#'?'':'target="_blank" rel="noopener"'} aria-label="${name}"><img src="assets/images/icons/social/${name}.png" alt=""></a>`}).join('');
 const links=(site.footer.links||[]).map(x=>`<a href="${x.href}">${x.label}</a>`).join('');
 const email=site.contactEmail||'allstargalaxy@example.com';
 host.innerHTML=`<div class="footer-inner"><section class="footer-brand-block"><a class="footer-xitlali-link" href="${site.xitlaliUrl||'https://xitlalimedia.com/'}" target="_blank" rel="noopener" aria-label="Visit Xitlali Media"><span class="footer-brand-line"><img class="footer-xitlali-logo" src="${site.xitlaliLogo||'assets/images/logos/xitlali-media-logo.png'}" alt=""><span class="footer-brand-copy"><strong>${site.footer.credit}</strong><em>Capturing Moments. Creating Legacies.</em></span></span></a></section><nav class="footer-links" aria-label="Footer navigation">${links}</nav><div class="footer-social">${socials}</div><div class="footer-contact-row"><a class="footer-contact" href="mailto:${email}">✉ Contact Administrator</a></div><div class="footer-divider" role="presentation" aria-hidden="true" style="height:1px;border:0;background:linear-gradient(90deg,transparent 0%,rgba(var(--accent-rgb),.60) 18%,var(--accent) 50%,rgba(var(--accent-rgb),.60) 82%,transparent 100%);box-shadow:0 0 5px rgba(var(--accent-rgb),.38);opacity:.82;"></div><div class="footer-meta"><span class="footer-copyright"><span>© 2026</span><img class="footer-mini-logo" src="${site.logo}" alt=""><span>Allstar Galaxy</span></span><small>Allstar Galaxy V${site.version||'3.3.0'} • Final Footer Consistency Lockdown • GitHub Pages</small></div></div>`;
}
