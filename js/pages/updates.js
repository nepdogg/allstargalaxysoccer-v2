/* ALLSTAR GALAXY — UPDATES PAGE V4.11
   Four admin-ready vertical graphic modules: Schedule, Results, Standings, News. */
const root = document.querySelector('#page-content');
const DATA_URL = 'data/updates-cards.json';
const FALLBACK = [
 {id:'schedule',title:'Schedule',eyebrow:'UPCOMING MATCHES',summary:'View the latest Allstar Galaxy schedule.',graphic:'',updated:'',badge:'',icon:'calendar',cta:'VIEW FULL SCHEDULE →',status:'published',order:1},
 {id:'results',title:'Results',eyebrow:'LATEST RESULTS',summary:'View the latest Allstar Galaxy match results.',graphic:'',updated:'',badge:'',icon:'results',cta:'VIEW FULL RESULTS →',status:'published',order:2},
 {id:'standings',title:'Standings',eyebrow:'CURRENT LEAGUE TABLE',summary:'View the latest league standings.',graphic:'',updated:'',badge:'',icon:'standings',cta:'VIEW FULL STANDINGS →',status:'published',order:3},
 {id:'latest-news',title:'Latest News',eyebrow:'LATEST UPDATE',summary:'Read the newest Allstar Galaxy update.',graphic:'',updated:'',badge:'',icon:'news',cta:'VIEW LATEST NEWS →',status:'published',order:4}
];
function icon(name){const c='viewBox="0 0 24 24" aria-hidden="true"';return ({
 calendar:`<svg ${c}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 18h3"/></svg>`,
 results:`<svg ${c}><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.2 2.2 4.8-5M12 3l2.2 3.2 3.8.4-2.5 2.8.7 3.7-4.2-1.8-4.2 1.8.7-3.7L6 6.6l3.8-.4Z"/></svg>`,
 standings:`<svg ${c}><path d="M5 20V10h4v10M10 20V4h4v16M15 20v-7h4v7M3 20h18"/></svg>`,
 news:`<svg ${c}><path d="M5 4h12v16H5zM17 7h2v12a1 1 0 0 1-1 1M8 8h6M8 12h6M8 16h4"/></svg>`
 })[name]||''}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function stamp(value){if(!value)return 'UPDATE DATE PENDING'; const d=new Date(value); return Number.isNaN(d.valueOf())?String(value):d.toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'}).toUpperCase()}
function card(c){const has=String(c.graphic||'').trim();return `<section class="updates-module" id="${esc(c.id)}" data-update-id="${esc(c.id)}">
 <button class="updates-live-card" type="button" data-open="${esc(c.id)}" aria-label="Open ${esc(c.title)} update">
  <div class="updates-card-head"><div><span class="updates-eyebrow">${esc(c.eyebrow||'LIVE UPDATE')}</span><h2>${esc(c.title)}</h2></div><span class="updates-icon">${icon(c.icon)}</span></div>
  <div class="updates-preview ${has?'has-graphic':'is-placeholder'}">${has?`<img src="${esc(c.graphic)}" alt="${esc(c.alt||c.title)}" loading="lazy">`:`<div><strong>${esc(c.title)} GRAPHIC</strong><span>Upload or select this graphic in Administration.</span></div>`}</div>
  <div class="updates-card-foot"><div><p>${esc(c.summary||'')}</p><span class="updates-timestamp">UPDATED • ${esc(stamp(c.updated))}</span>${c.badge?`<span class="updates-badge">${esc(c.badge)}</span>`:''}</div><span class="updates-cta">${esc(c.cta||'VIEW FULL UPDATE →')}</span></div>
 </button></section>`}
function modal(){return `<div class="updates-lightbox" id="updates-lightbox" hidden><div class="updates-lightbox-backdrop" data-close></div><div class="updates-lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby="updates-lightbox-title"><button class="updates-close" type="button" data-close aria-label="Close">×</button><button class="updates-nav updates-prev" type="button" aria-label="Previous update">‹</button><div class="updates-lightbox-content"><h2 id="updates-lightbox-title"></h2><span class="updates-lightbox-time"></span><div class="updates-full-image"></div></div><button class="updates-nav updates-next" type="button" aria-label="Next update">›</button></div></div>`}
let cards=[];let active=0;
function openAt(i){const c=cards[i];if(!c)return;active=i;const box=document.querySelector('#updates-lightbox');box.querySelector('#updates-lightbox-title').textContent=c.title;box.querySelector('.updates-lightbox-time').textContent=`UPDATED • ${stamp(c.updated)}`;box.querySelector('.updates-full-image').innerHTML=c.graphic?`<img src="${esc(c.graphic)}" alt="${esc(c.alt||c.title)}">`:`<div class="updates-modal-placeholder"><strong>${esc(c.title)} GRAPHIC</strong><span>No graphic has been uploaded yet.</span></div>`;box.hidden=false;document.body.classList.add('updates-modal-open');box.querySelector('.updates-close').focus()}
function close(){document.querySelector('#updates-lightbox').hidden=true;document.body.classList.remove('updates-modal-open')}
function bind(){document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{const i=cards.findIndex(c=>c.id===b.dataset.open);if(i>=0)openAt(i)}));const box=document.querySelector('#updates-lightbox');box.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',close));box.querySelector('.updates-prev').onclick=()=>openAt((active-1+cards.length)%cards.length);box.querySelector('.updates-next').onclick=()=>openAt((active+1)%cards.length);document.addEventListener('keydown',e=>{if(box.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')box.querySelector('.updates-prev').click();if(e.key==='ArrowRight')box.querySelector('.updates-next').click()});}
function scrollHash(){if(!location.hash)return;requestAnimationFrame(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'smooth',block:'start'}))}
async function init(){let data;try{const r=await fetch(DATA_URL,{cache:'no-store'});if(!r.ok)throw 0;data=await r.json()}catch{data={cards:FALLBACK}}cards=(data.cards||FALLBACK).filter(c=>!['hidden','draft','inactive'].includes(String(c.status||'published').toLowerCase())).sort((a,b)=>(a.order||0)-(b.order||0));root.innerHTML=`<section class="updates-page"><header class="updates-intro"><h1>ALLSTAR GALAXY UPDATES</h1><p>Schedule, results, standings, and club news — always one click away.</p></header><div class="updates-stack">${cards.map(card).join('')}</div></section>${modal()}`;bind();scrollHash();}
init();
