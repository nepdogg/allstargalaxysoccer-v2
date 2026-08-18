/* ============================================================================
   ALLSTAR GALAXY V3.4 — FRAMEWORK LOCKED
   Shared header, section-colored navigation, status, hero and footer.
============================================================================ */
function active(item,page){return item.id===page.active||(item.matches||[]).includes(page.active)}
function submenu(item){return !item.submenu?.length?'':`<button class="submenu-toggle" type="button" aria-expanded="false" aria-label="Open ${item.label} menu"><span>⌄</span></button><div class="submenu" role="menu">${item.submenu.map(x=>`<a role="menuitem" href="${x.href}">${x.label}</a>`).join('')}</div>`}
function nav(site,page){return site.nav.map(item=>`<div class="nav-item ${active(item,page)?'is-active':''} ${item.id==='search'?'nav-search-item':''}"><a class="nav-link" href="${item.href}" ${active(item,page)?'aria-current="page"':''}>${item.label}</a>${submenu(item)}</div>`).join('')}

async function hydrateLatestStatus(site,page,host){
  /* ========================================================================
     V4.6 LIVE STATUS ROTATION
     ------------------------------------------------------------------------
     The status bar now has three jobs without changing its locked visual frame:
       1. GLOBAL LATEST: newest published game/video notice from latest-update.json.
       2. GLOBAL NEXT: next published/unplayed match from master-content.json.
       3. PAGE CONTEXT: a message specific to the page the visitor is viewing.

     The center sentence remains the ONLY clickable status link. The labels at
     the left/right edges are visual pointers that identify the message type.
     This keeps the bar useful everywhere while still making each page relevant.
  ======================================================================== */
  const config=site.statusBar||{};
  if(config.enabled===false)return;

  const link=host.querySelector('.status-message-link');
  const opens=[...host.querySelectorAll('.status-open')];
  const icons=[...host.querySelectorAll('.status-icon')];
  if(!link)return;

  const clean=value=>String(value??'').trim();
  const safeFetch=async url=>{
    try{
      const response=await fetch(url,{cache:'no-store'});
      if(response.ok)return await response.json();
    }catch(error){console.warn(`Status data unavailable: ${url}`,error);}
    return null;
  };

  const messages=[];
  const add=record=>{
    const message=clean(record?.message);
    const href=clean(record?.href)||'#main';
    if(!message)return;
    if(messages.some(item=>item.message===message&&item.href===href))return;
    messages.push({
      label:(clean(record.label)||'UPDATE').toUpperCase(),
      message,
      href,
      icon:clean(record.icon)||'★',
      type:clean(record.type)||'status'
    });
  };

  /* 1) Global latest content. This file can later be written automatically by
        the Media Administration publish workflow. */
  const latest=config.feed ? await safeFetch(config.feed) : null;
  if(latest?.enabled!==false){
    add({
      label:latest?.label||config.fallbackLabel||'LATEST',
      message:latest?.message||config.fallbackMessage||'Open Latest Games to see the newest Allstar Galaxy game and videos.',
      href:latest?.href||config.fallbackHref||'media.html#latest-games',
      icon:'★',
      type:'latest'
    });
  }

  /* 2) Global next game. Prefer a published schedule item with no result. If
        there is no upcoming game in the data yet, keep a useful Updates link
        instead of showing a blank status item. */
  const master=await safeFetch(config.masterFeed||'data/master-content.json');
  const visible=item=>item&&item.status!=='hidden'&&item.status!=='draft';
  const unplayed=item=>!clean(item?.result);
  const candidates=[...(master?.schedule||[]),...(master?.games||[])].filter(item=>visible(item)&&unplayed(item)&&clean(item.opponent));
  const dateValue=item=>{
    const raw=clean(item.date);
    if(!raw)return Number.POSITIVE_INFINITY;
    const time=Date.parse(raw);
    return Number.isFinite(time)?time:Number.POSITIVE_INFINITY;
  };
  candidates.sort((a,b)=>dateValue(a)-dateValue(b)||(Number(a.order)||9999)-(Number(b.order)||9999));
  const next=candidates[0];
  if(next){
    const pieces=[`Next Game — Allstar Galaxy vs ${clean(next.opponent)}`];
    if(clean(next.date))pieces.push(clean(next.date));
    if(clean(next.time))pieces.push(clean(next.time));
    add({label:'NEXT',message:pieces.join(' • '),href:'updates.html#schedule-standings',icon:'⚽',type:'next-game'});
  }else{
    add({
      label:'NEXT',
      message:config.nextFallbackMessage||'Next Game — check Updates for the next Allstar Galaxy match.',
      href:config.nextFallbackHref||'updates.html#schedule-standings',
      icon:'⚽',
      type:'next-game-fallback'
    });
  }

  /* 3) Page-specific context. This is why Team can advertise the roster while
        Media advertises the library, Search advertises search, etc. */
  add({
    label:page.statusLabel||page.title||page.section||'PAGE',
    message:page.ticker||config.pageFallbackMessage||'',
    href:page.tickerHref||page.statusHref||'#main',
    icon:page.icon||'★',
    type:'page-context'
  });

  if(!messages.length)return;
  let index=0;
  let timer;
  const render=(item,animate=false)=>{
    const paint=()=>{
      link.textContent=item.message;
      link.setAttribute('href',item.href);
      if(opens[0])opens[0].textContent=`${item.label} →`;
      if(opens[1])opens[1].textContent=`← ${item.label}`;
      icons.forEach(icon=>icon.textContent=item.icon);
      host.dataset.statusSource=item.type;
      host.dataset.statusLabel=item.label;
      link.classList.remove('is-changing');
    };
    if(!animate){paint();return;}
    link.classList.add('is-changing');
    window.setTimeout(paint,160);
  };
  const advance=()=>{index=(index+1)%messages.length;render(messages[index],true)};

  render(messages[0]);
  clearInterval(host._allstarStatusTimer);
  if(messages.length>1){
    timer=setInterval(advance,Math.max(4500,Number(config.rotationMs)||7000));
    host._allstarStatusTimer=timer;
  }
}

export function mountSiteFrame(site,page){
 const host=document.querySelector('#site-frame');
 /* Every page permanently owns the same configurable hero architecture.
    Page JSON reserves up to 10 slots, but visitors only see dots/slides for
    populated slots. Adding future photography is therefore content work, not
    a framework redesign. */
 const heroConfig=site.heroCarousel||{};
 const maxHeroSlots=Math.max(1,Number(page.heroSlots||heroConfig.maxSlots||10));
 const heroSlots=Array.isArray(page.hero)?page.hero.slice(0,maxHeroSlots):[];
 while(heroSlots.length<maxHeroSlots)heroSlots.push('');
 const images=heroSlots.map(x=>String(x||'').trim()).filter(Boolean);
 host.className='site-frame';
 host.innerHTML=`<header class="shared-header"><div class="identity-row"><a class="brand-home brand-home-left" href="index.html"><img class="brand-logo" src="${site.logo}" alt="Allstar Galaxy"></a><img class="nav-title" src="${page.navTitle}" alt="The Official Home of the Allstar Galaxy"><a class="brand-home brand-home-right" href="index.html"><img class="brand-logo" src="${site.logo}" alt="Allstar Galaxy"></a><a class="search-control" href="search.html"><span>⌕</span><b>Search</b></a></div><nav class="main-nav" aria-label="Main navigation">${nav(site,page)}</nav><div class="status-module"><span class="status-border status-border-top"></span><span class="energy-rail energy-rail-top"><i></i></span><div class="status-bar"><span class="status-side status-side-left" aria-hidden="true"><span class="status-icon">${page.icon||'★'}</span><span class="status-open">OPEN →</span></span><a class="status-text status-message-link" href="${page.tickerHref||page.statusHref||'#main'}">${page.ticker||''}</a><span class="status-side status-side-right" aria-hidden="true"><span class="status-open">← OPEN</span><span class="status-icon">${page.icon||'★'}</span></span></div><span class="energy-rail energy-rail-bottom"><i></i></span><span class="status-border status-border-bottom"></span></div></header>`;

 hydrateLatestStatus(site,page,host);

 const hero=document.createElement('section'); hero.className='hero'; hero.setAttribute('aria-label',`${page.title} hero`);
 hero.innerHTML=images.length?`<div class="hero-track">${images.map((src,i)=>`<img class="hero-slide" src="${src}" alt="${page.title} hero ${i+1}" ${i?'loading="lazy"':'fetchpriority="high"'}>`).join('')}</div><div class="hero-dots">${images.map((_,i)=>`<button class="hero-dot ${i?'':'is-active'}" type="button" aria-label="Show hero ${i+1}" aria-pressed="${!i}" data-index="${i}"></button>`).join('')}</div>`:`<div class="placeholder-panel">Hero image not configured.</div>`;
 host.after(hero);
 const track=hero.querySelector('.hero-track'),dots=[...hero.querySelectorAll('.hero-dot')]; let index=0,timer,touchStartX=null;
 const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const intervalMs=Number(page.heroInterval||heroConfig.intervalMs)||7000;
 const show=i=>{if(!track||!dots.length)return;index=(i+dots.length)%dots.length;track.style.transform=`translateX(-${index*100}%)`;dots.forEach((d,j)=>{d.classList.toggle('is-active',j===index);d.setAttribute('aria-pressed',String(j===index))})};
 const pause=()=>clearInterval(timer);
 const restart=()=>{pause();if(!reduceMotion&&dots.length>1)timer=setInterval(()=>show(index+1),intervalMs)};
 dots.forEach(d=>d.onclick=()=>{show(+d.dataset.index);restart()});
 if(heroConfig.pauseOnHover!==false){hero.addEventListener('mouseenter',pause);hero.addEventListener('mouseleave',restart);hero.addEventListener('focusin',pause);hero.addEventListener('focusout',restart)}
 if(heroConfig.swipe!==false){
   hero.addEventListener('touchstart',event=>{touchStartX=event.touches?.[0]?.clientX??null},{passive:true});
   hero.addEventListener('touchend',event=>{if(touchStartX==null)return;const end=event.changedTouches?.[0]?.clientX??touchStartX;const delta=end-touchStartX;touchStartX=null;if(Math.abs(delta)>45&&dots.length>1){show(index+(delta<0?1:-1));restart()}},{passive:true});
 }
 restart();

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
 const allLinks=site.footer.links||[];
 const primaryLinks=site.footer.primaryLinks||allLinks.filter(x=>!['About','Administration'].includes(x.label));
 const utilityLinks=site.footer.utilityLinks||allLinks.filter(x=>['About','Administration'].includes(x.label));
 const primary=primaryLinks.map(x=>`<a href="${x.href}">${x.label}</a>`).join('');
 const utility=utilityLinks.map(x=>`<a href="${x.href}">${x.label}</a>`).join('');
 const email=site.contactEmail||'allstargalaxy@example.com';
 host.innerHTML=`<div class="footer-inner">
   <div class="footer-upper">
     <section class="footer-brand-block"><a class="footer-xitlali-link" href="${site.xitlaliUrl||'https://xitlalimedia.com/'}" target="_blank" rel="noopener" aria-label="Visit Xitlali Media"><span class="footer-brand-line"><img class="footer-xitlali-logo" src="${site.xitlaliLogo||'assets/images/logos/xitlali-media-logo.png'}" alt=""><span class="footer-brand-copy"><strong>${site.footer.credit}</strong><em>Capturing Moments. Creating Legacies.</em></span></span></a></section>
     <nav class="footer-links footer-primary-links" aria-label="Footer navigation">${primary}</nav>
     <div class="footer-social">${socials}</div>
   </div>
   <div class="footer-divider" role="presentation" aria-hidden="true"></div>
   <div class="footer-utility">
     <div class="footer-contact-row"><a class="footer-contact" href="mailto:${email}">✉ Contact Administrator</a></div>
     <div class="footer-copyright"><span>© 2026</span><img class="footer-mini-logo" src="${site.logo}" alt=""><span>Allstar Galaxy</span></div>
     <nav class="footer-utility-links" aria-label="Footer utility navigation">${utility}</nav>
   </div>
   <div class="footer-meta"><small>Allstar Galaxy V${site.version||'3.4.0'} • Shared Framework LOCKED • GitHub Pages</small></div>
 </div>`;
}

