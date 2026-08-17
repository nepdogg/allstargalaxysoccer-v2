const root=document.querySelector('#page-content');

async function loadSite(){
  if(window.AllstarGalaxy?.site) return window.AllstarGalaxy.site;
  const r=await fetch('data/site-config.json',{cache:'no-store'});
  return r.ok?r.json():{};
}

const site=await loadSite();
const s=site.social||{};
const email=site.contactEmail||'allstargalaxy@example.com';
const cards=[
  ['youtube','YouTube','Watch Full Games, Highlights & More','assets/images/icons/social/youtube.png'],
  ['instagram','Instagram','Photos & Team Moments','assets/images/icons/social/instagram.png'],
  ['facebook','Facebook','Updates & Community','assets/images/icons/social/facebook.png'],
  ['tiktok','TikTok','Short Clips & Plays','assets/images/icons/social/tiktok.png'],
  ['x','X','Quick Updates','assets/images/icons/social/x.png']
];
root.innerHTML=`
<section id="follow" class="follow-hub anchor-section" aria-labelledby="follow-title">
  <header class="follow-intro">
    <h1 id="follow-title">FOLLOW ALLSTAR GALAXY</h1>
    <p>Follow Allstar Galaxy across social media for videos, photos, updates, and highlights.</p>
  </header>
  <div class="follow-social-grid" aria-label="Allstar Galaxy social links">
    ${cards.map(([key,title,sub,img])=>`<a class="follow-card follow-${key}" href="${s[key]||'#'}" target="_blank" rel="noopener noreferrer" aria-label="Follow Allstar Galaxy on ${title}"><span class="follow-icon-wrap"><img src="${img}" alt=""></span><strong>${title}</strong><span>${sub}</span></a>`).join('')}
  </div>
  <a class="follow-email-card" href="mailto:${email}" aria-label="Message Allstar Galaxy">
    <span class="follow-email-icon">✉</span><span><strong>MESSAGE ALLSTAR GALAXY</strong><small>Send photos, updates, questions, or team information.</small></span>
  </a>
</section>`;
