/* ============================================================================
   ALLSTAR GALAXY V2 — TEAM PAGE MODULE
   ----------------------------------------------------------------------------
   PAGE-ONLY CODE. This file intentionally does not change the universal
   header, navigation, status bar, hero system, galaxy background, or footer.

   Responsibilities:
   1. Build the visual roster carousel from data/master-content.json.
   2. Open a player viewer without leaving the Team page.
   3. Build six live Team Stats cards from the same master data.
============================================================================ */

const root = document.querySelector('#page-content');

const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const assetPath = (value, fallback = '') => {
  const raw = String(value || fallback || '').trim();
  if (!raw) return '';
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  if (raw.startsWith('assets/')) return raw;
  if (raw.startsWith('images/')) return `assets/${raw}`;
  return raw;
};

const visible = item => item && String(item.status || 'published').toLowerCase() !== 'hidden';

const data = await fetch('data/master-content.json', { cache: 'no-store' }).then(response => {
  if (!response.ok) throw new Error('Team data could not be loaded.');
  return response.json();
});

const players = (data.players || [])
  .filter(visible)
  .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));

const silhouette = assetPath(data.assets?.playerSilhouette, 'assets/images/team/players/player-silhouette.png');
const cardTemplate = 'assets/images/team/templates/player-card-template.png';

function splitPlayerName(player) {
  const parts = String(player.name || '').trim().split(/\s+/).filter(Boolean);
  const first = String(player.firstName || parts.shift() || 'PLAYER');
  const last = String(player.lastName || parts.join(' ') || first);
  return { first, last };
}

function playerCard(player, index, extraClass = '') {
  const { first, last } = splitPlayerName(player);
  const photo = assetPath(player.photo, silhouette) || silhouette;
  const scale = Math.max(0.60, Math.min(1.80, (Number(player.photoScale) || 100) / 100));
  const x = Math.max(-50, Math.min(50, Number(player.photoX) || 0));
  const y = Math.max(-50, Math.min(50, Number(player.photoY) || 0));
  const imageMode = String(player.imageMode || 'cutout').toLowerCase() === 'photo' ? 'photo' : 'cutout';

  return `
    <button class="team-player-card ${extraClass}" type="button" data-player-index="${index}"
      aria-label="Open ${esc(player.name || `${first} ${last}`)} player profile"
      style="--player-scale:${scale};--player-x:${x}%;--player-y:${y}%">
      <span class="team-player-frame image-mode-${imageMode}">
        <img class="team-card-template" src="${cardTemplate}" alt="" aria-hidden="true">
        <span class="team-player-photo-stage">
          <img class="team-player-photo" src="${esc(photo)}" alt="${esc(player.name || 'Allstar Galaxy player')}" loading="lazy"
            onerror="this.onerror=null;this.src='${esc(silhouette)}'">
        </span>
        <span class="team-player-number">${esc(player.number || '00')}</span>
        <span class="team-player-name name-length-${Math.min(20, last.length)}">
          <small>${esc(first)}</small>
          <strong>${esc(last)}</strong>
          <em>${esc(player.position || 'PLAYER')}</em>
        </span>
      </span>
    </button>`;
}

function parseResult(game) {
  const token = String(game.result || '').trim();
  const kind = /^W\b/i.test(token) ? 'win' : /^D\b/i.test(token) ? 'draw' : /^L\b/i.test(token) ? 'loss' : '';
  const scoreMatch = token.match(/(\d+)\s*[-–—]\s*(\d+)/);
  return { kind, score: scoreMatch ? [Number(scoreMatch[1]), Number(scoreMatch[2])] : null };
}

function latestSeasonName(games) {
  const seasonGames = games.filter(game => game.season);
  if (!seasonGames.length) return 'Current Season';
  const ordered = [...seasonGames].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  return ordered.at(-1)?.season || 'Current Season';
}

function teamStatsMarkup() {
  const completedGames = (data.games || []).filter(visible).filter(game => parseResult(game).kind);
  const latestSeason = latestSeasonName((data.games || []).filter(visible));
  const currentGames = (data.games || []).filter(visible).filter(game => String(game.season || '') === String(latestSeason));
  const currentCompleted = currentGames.filter(game => parseResult(game).kind);

  let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;
  completedGames.forEach(game => {
    const result = parseResult(game);
    if (result.kind === 'win') wins += 1;
    if (result.kind === 'draw') draws += 1;
    if (result.kind === 'loss') losses += 1;
    if (result.score) {
      goalsFor += result.score[0];
      goalsAgainst += result.score[1];
    }
  });

  const currentRecord = currentCompleted.reduce((record, game) => {
    const kind = parseResult(game).kind;
    if (kind === 'win') record.w += 1;
    if (kind === 'draw') record.d += 1;
    if (kind === 'loss') record.l += 1;
    return record;
  }, { w: 0, d: 0, l: 0 });

  const awards = (data.gameAwards || []).filter(visible);
  const awardCounts = new Map();
  awards.forEach(award => {
    const id = String(award.playerId || '').trim();
    if (id) awardCounts.set(id, (awardCounts.get(id) || 0) + 1);
  });

  // V4.0: Featured Player is intentionally automatic. Pick a published
  // roster player on every page load, while avoiding the same player twice in
  // a row in this browser when possible.
  let featured = players[0] || {};
  if (players.length > 1) {
    const previousId = sessionStorage.getItem('allstarGalaxyFeaturedPlayer');
    const pool = players.filter(player => String(player.id || '') !== previousId);
    featured = pool[Math.floor(Math.random() * pool.length)] || players[Math.floor(Math.random() * players.length)];
    if (featured?.id) sessionStorage.setItem('allstarGalaxyFeaturedPlayer', String(featured.id));
  }
  const featuredAwards = awardCounts.get(String(featured.id)) || 0;
  const featuredPhoto = assetPath(featured.photo, silhouette) || silhouette;

  const seasons = new Set(completedGames.map(game => game.season).filter(Boolean));
  const standings = (data.standings || []).filter(visible);
  const galaxyStanding = standings.find(row => /allstar galaxy/i.test(String(row.team || ''))) || standings[0] || {};
  const standingLabel = galaxyStanding.position && galaxyStanding.position !== '—'
    ? `#${galaxyStanding.position}`
    : 'Current';
  const points = galaxyStanding.points && galaxyStanding.points !== '—' ? galaxyStanding.points : '—';

  const cards = [
    {
      title: 'Featured Player',
      key: 'featured',
      feature: true,
      playerIndex: Math.max(0, players.indexOf(featured)),
      body: `
        <div class="team-stat-featured-copy">
          <span class="team-stat-featured-badge">Random Featured Player</span>
          <b>#${esc(featured.number || '—')} ${esc(featured.name || 'Allstar Galaxy')}</b>
          <span>${esc(featured.position || 'Player')}</span>
          <small>${featuredAwards} Game Award${featuredAwards === 1 ? '' : 's'}</small>
        </div>
        <img src="${esc(featuredPhoto)}" alt="${esc(featured.name || 'Featured player')}" loading="lazy">`
    },
    {
      title: 'Club Record',
      key: 'record',
      body: `<ul><li><b>${completedGames.length}</b> Games</li><li><b>${wins}</b> Wins</li><li><b>${draws}</b> Draws</li><li><b>${losses}</b> Losses</li></ul>`
    },
    {
      title: 'Goals & Seasons',
      key: 'goals',
      body: `<ul><li><b>${goalsFor}</b> Goals For</li><li><b>${goalsAgainst}</b> Goals Against</li><li><b>${goalsFor - goalsAgainst}</b> Goal Difference</li><li><b>${seasons.size}</b> Seasons</li></ul>`
    },
    {
      title: 'Team Snapshot',
      key: 'snapshot',
      body: `<ul><li><b>${esc(latestSeason)}</b></li><li><b>${players.length}</b> Roster Players</li><li><b>${currentCompleted.length}</b> Games Played</li><li><b>${currentRecord.w}-${currentRecord.d}-${currentRecord.l}</b> Current Record</li></ul>`
    },
    {
      title: 'Team Honors',
      key: 'honors',
      body: `<ul><li><b>${awards.length}</b> Game Awards</li><li><b>${(data.playlists || []).filter(visible).length}</b> Media Collections</li><li><b>${(data.seasons || []).filter(visible).length}</b> Season Collections</li><li><b>${players.length}</b> Players Archived</li></ul>`
    },
    {
      title: 'Current Standings',
      key: 'standings',
      body: `<ul><li><b>${esc(standingLabel)}</b> Position</li><li><b>${esc(points)}</b> Points</li><li><b>${esc(galaxyStanding.played || '—')}</b> Played</li><li><b>${esc(galaxyStanding.wins || '—')}</b> Wins</li></ul>`
    }
  ];

  const actionLabels = {
    featured: 'Open Profile →', record: 'View Record →', goals: 'View Stats →',
    snapshot: 'View Snapshot →', honors: 'View Honors →', standings: 'View Standings →'
  };
  return cards.map(card => `
    <article class="team-stat-card${card.feature ? ' team-stat-featured' : ''} is-clickable" tabindex="0"
      data-stat-key="${esc(card.key)}" ${card.feature ? `data-featured-player-index="${card.playerIndex}"` : ''}>
      <h3>${card.title}</h3>
      <div class="team-stat-body">${card.body}</div>
      <span class="team-stat-card-destination">${actionLabels[card.key]}</span>
    </article>`).join('');
}

root.innerHTML = `
  <section class="team-roster-section" id="roster" aria-labelledby="team-roster-heading">
    <img id="team-roster-heading" class="section-title team-roster-title" src="assets/images/titles/section-titles/allstar-galaxy-roster-title.png" alt="Allstar Galaxy Roster">
    <p class="section-copy">Select a player to open their profile.</p>

    <div class="team-roster-carousel" data-team-carousel aria-label="Allstar Galaxy roster carousel">
      <button class="team-carousel-arrow team-carousel-prev" type="button" aria-label="Previous player">‹</button>
      <div class="team-carousel-viewport">
        <div class="team-carousel-track">
          ${players.map((player, index) => playerCard(player, index)).join('')}
        </div>
      </div>
      <button class="team-carousel-arrow team-carousel-next" type="button" aria-label="Next player">›</button>
      <div class="team-carousel-dots" aria-label="Roster carousel position"></div>
    </div>
  </section>

  <section class="team-stats-section" id="team-stats" aria-labelledby="team-stats-heading">
    <img id="team-stats-heading" class="section-title team-stats-title" src="assets/images/titles/section-titles/allstar-galaxy-stats-title.png" alt="Allstar Galaxy Stats">
    <p class="section-copy">Live team information generated from the Allstar Galaxy website data.</p>
    <div class="team-stats-grid">${teamStatsMarkup()}</div>
  </section>

  <div class="team-player-modal" data-team-player-modal hidden>
    <div class="team-player-modal-backdrop" data-player-close></div>
    <section class="team-player-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="team-player-modal-name">
      <button class="team-player-modal-close" type="button" data-player-close aria-label="Close player profile">×</button>
      <button class="team-player-modal-nav team-player-modal-prev" type="button" aria-label="Previous player">‹</button>
      <div class="team-player-modal-content"></div>
      <button class="team-player-modal-nav team-player-modal-next" type="button" aria-label="Next player">›</button>
    </section>
  </div>`;

const carousel = root.querySelector('[data-team-carousel]');
const track = carousel?.querySelector('.team-carousel-track');
const cardButtons = [...(track?.querySelectorAll('.team-player-card') || [])];
const dotsRoot = carousel?.querySelector('.team-carousel-dots');
let activeIndex = 0;
let touchStartX = null;

function buildDots() {
  if (!dotsRoot) return;
  dotsRoot.innerHTML = players.map((player, index) =>
    `<button type="button" class="team-carousel-dot" data-dot-index="${index}" aria-label="Show ${esc(player.name || `player ${index + 1}`)}"></button>`
  ).join('');
  dotsRoot.querySelectorAll('.team-carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => setActive(Number(dot.dataset.dotIndex)));
  });
}

function setActive(nextIndex, options = {}) {
  if (!cardButtons.length || !track) return;
  activeIndex = (nextIndex + cardButtons.length) % cardButtons.length;

  /*
   * V3.9: arrange the roster as a true circular "cover-flow" carousel.
   * This intentionally does NOT translate one long flex row.  Each card is
   * positioned around the center card so the first/last roster entries wrap
   * naturally and the user can always see players on BOTH sides.
   */
  const total = cardButtons.length;
  cardButtons.forEach((card, index) => {
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const distance = Math.abs(offset);
    card.style.setProperty('--carousel-offset', String(offset));
    card.dataset.distance = String(Math.min(distance, 3));
    card.classList.toggle('is-active', offset === 0);
    card.classList.toggle('is-neighbor', distance === 1);
    card.classList.toggle('is-far', distance === 2);
    card.classList.toggle('is-hidden-card', distance > 2);
    card.setAttribute('aria-current', offset === 0 ? 'true' : 'false');
    card.tabIndex = distance <= 2 ? 0 : -1;
  });

  dotsRoot?.querySelectorAll('.team-carousel-dot').forEach((dot, index) => {
    dot.classList.toggle('is-active', index === activeIndex);
    dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
  });

  if (options.focus) cardButtons[activeIndex]?.focus({ preventScroll: true });
}

buildDots();
requestAnimationFrame(() => setActive(0));
window.addEventListener('resize', () => requestAnimationFrame(() => setActive(activeIndex)));
carousel?.querySelector('.team-carousel-prev')?.addEventListener('click', () => setActive(activeIndex - 1));
carousel?.querySelector('.team-carousel-next')?.addEventListener('click', () => setActive(activeIndex + 1));

carousel?.addEventListener('touchstart', event => {
  touchStartX = event.touches[0]?.clientX ?? null;
}, { passive: true });
carousel?.addEventListener('touchend', event => {
  if (touchStartX == null) return;
  const endX = event.changedTouches[0]?.clientX ?? touchStartX;
  const distance = touchStartX - endX;
  if (Math.abs(distance) > 45) setActive(activeIndex + (distance > 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });

/* Team Stats interactions are wired after the player viewer so Featured
   Player can open the exact same player modal as the roster carousel. */

/* Player viewer ------------------------------------------------------------ */
const modal = root.querySelector('[data-team-player-modal]');
const modalContent = modal?.querySelector('.team-player-modal-content');
let modalIndex = 0;

/*
 * IMPORTANT: move the modal out of #page-content and attach it directly to
 * <body>. Some of the visual page layers use transforms/filters. A fixed
 * element inside one of those layers can behave like an absolutely positioned
 * page element instead of a true viewport overlay. That was why the player
 * viewer appeared far down the Team page and could only be seen at 25% zoom.
 */
if (modal && modal.parentElement !== document.body) document.body.append(modal);

/* Full-card lightbox --------------------------------------------------------
   Clicking either card in the player viewer opens that card by itself at the
   largest size that fits the current viewport. */
const cardLightbox = document.createElement('div');
cardLightbox.className = 'team-card-lightbox';
cardLightbox.hidden = true;
cardLightbox.innerHTML = `
  <div class="team-card-lightbox-backdrop" data-card-lightbox-close></div>
  <section class="team-card-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Full size player card">
    <button class="team-card-lightbox-close" type="button" data-card-lightbox-close aria-label="Close full size card">×</button>
    <div class="team-card-lightbox-title"></div>
    <div class="team-card-lightbox-content"></div>
  </section>`;
document.body.append(cardLightbox);

function closeCardLightbox() {
  cardLightbox.hidden = true;
  cardLightbox.querySelector('.team-card-lightbox-content').innerHTML = '';
}

function openCardLightbox(type) {
  const player = players[modalIndex];
  if (!player) return;
  const title = cardLightbox.querySelector('.team-card-lightbox-title');
  const content = cardLightbox.querySelector('.team-card-lightbox-content');
  title.textContent = type === 'profile' ? 'PROFILE CARD' : 'FRONT CARD';
  content.innerHTML = type === 'profile'
    ? `<div class="team-card-lightbox-card team-card-lightbox-profile">${profileCard(player)}</div>`
    : `<div class="team-card-lightbox-card team-card-lightbox-front">${playerCard(player, modalIndex, 'is-full-card')}</div>`;
  cardLightbox.hidden = false;
  cardLightbox.querySelector('.team-card-lightbox-close')?.focus();
}

cardLightbox.querySelectorAll('[data-card-lightbox-close]').forEach(el => el.addEventListener('click', closeCardLightbox));

function profileCard(player) {
  const { first, last } = splitPlayerName(player);
  const quote = String(player.quote || '').trim();
  const facts = [
    player.dateOfBirth || 'N/A',
    player.nationality || 'N/A',
    player.preferredFoot || 'N/A',
    player.height || 'N/A',
    player.weight || 'N/A'
  ];

  return `
    <div class="team-profile-card" aria-label="${esc(player.name || `${first} ${last}`)} profile card">
      <img class="team-profile-template" src="assets/images/team/templates/player-profile-card-template.png" alt="" aria-hidden="true">
      <div class="team-profile-number">${esc(player.number || '00')}</div>
      <div class="team-profile-position">${esc(player.position || 'PLAYER')}</div>
      <div class="team-profile-name ${last.length > 14 ? 'name-long' : last.length > 9 ? 'name-medium' : ''}">
        <small>${esc(first)}</small>
        <strong>${esc(last)}</strong>
      </div>
      <div class="team-profile-values" aria-label="Player details">
        ${facts.map((value, index) => `<b class="team-profile-value team-profile-value-${index + 1}">${esc(value)}</b>`).join('')}
      </div>
      <blockquote class="team-profile-quote ${quote.length > 90 ? 'quote-long' : quote.length > 50 ? 'quote-medium' : ''}">${quote ? esc(quote).replace(/\n/g, '<br>') : 'ALLSTAR GALAXY'}</blockquote>
    </div>`;
}
function modalMarkup(player, index) {
  const { first, last } = splitPlayerName(player);
  const quote = String(player.quote || '').trim();
  const fullPhoto = assetPath(player.photo, silhouette) || silhouette;

  return `
    <header class="team-player-modal-header">
      <span class="team-player-modal-kicker">ALLSTAR GALAXY PLAYER</span>
      <h2 id="team-player-modal-name"><small>#${esc(player.number || '—')}</small> ${esc(first)} <strong>${esc(last)}</strong></h2>
      <p class="team-player-modal-position">${esc(player.position || 'Player')}</p>
    </header>

    <div class="team-player-modal-cards">
      <div class="team-player-modal-panel team-card-zoom-trigger" data-card-zoom="front" role="button" tabindex="0" aria-label="Open full size front player card">
        <span class="team-player-card-label">FRONT CARD</span>
        <div class="team-player-modal-card">${playerCard(player, index, 'is-modal-card')}</div>
      </div>
      <div class="team-player-modal-panel team-card-zoom-trigger" data-card-zoom="profile" role="button" tabindex="0" aria-label="Open full size profile card">
        <span class="team-player-card-label">PROFILE CARD</span>
        ${profileCard(player)}
      </div>
    </div>

    <div class="team-player-modal-footer">
      <a class="team-player-photo-link" href="${esc(fullPhoto)}" target="_blank" rel="noopener">View Original Player Photo</a>
    </div>`;
}
function showModal(index) {
  if (!modal || !modalContent || !players.length) return;
  modalIndex = (index + players.length) % players.length;
  modalContent.innerHTML = modalMarkup(players[modalIndex], modalIndex);
  modalContent.querySelectorAll('[data-card-zoom]').forEach(panel => {
    const open = () => openCardLightbox(panel.dataset.cardZoom);
    panel.addEventListener('click', open);
    panel.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
    });
  });
  modal.hidden = false;
  document.body.classList.add('team-modal-open');
  modal.querySelector('.team-player-modal-close')?.focus();
}

function closeModal() {
  if (!modal) return;
  closeCardLightbox();
  modal.hidden = true;
  document.body.classList.remove('team-modal-open');
  cardButtons[activeIndex]?.focus({ preventScroll: true });
}

cardButtons.forEach((card, index) => card.addEventListener('click', () => {
  setActive(index);
  showModal(index);
}));
modal?.querySelectorAll('[data-player-close]').forEach(button => button.addEventListener('click', closeModal));
modal?.querySelector('.team-player-modal-prev')?.addEventListener('click', () => showModal(modalIndex - 1));
modal?.querySelector('.team-player-modal-next')?.addEventListener('click', () => showModal(modalIndex + 1));

/* Team Stats detail viewer -------------------------------------------------- */
const statsModal = document.createElement('div');
statsModal.className = 'team-stats-modal';
statsModal.hidden = true;
statsModal.innerHTML = `
  <div class="team-stats-modal-backdrop" data-stats-close></div>
  <section class="team-stats-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="team-stats-modal-title">
    <button class="team-stats-modal-close" type="button" data-stats-close aria-label="Close team statistics">×</button>
    <span class="team-stats-modal-kicker">ALLSTAR GALAXY LIVE TEAM DATA</span>
    <h2 id="team-stats-modal-title"></h2>
    <div class="team-stats-modal-content"></div>
  </section>`;
document.body.append(statsModal);

function statsDetailMarkup(key) {
  const completedGames = (data.games || []).filter(visible).filter(game => parseResult(game).kind);
  const latestSeason = latestSeasonName((data.games || []).filter(visible));
  const currentGames = (data.games || []).filter(visible).filter(game => String(game.season || '') === String(latestSeason));
  const currentCompleted = currentGames.filter(game => parseResult(game).kind);
  let wins=0, draws=0, losses=0, goalsFor=0, goalsAgainst=0;
  completedGames.forEach(game => { const r=parseResult(game); if(r.kind==='win')wins++; if(r.kind==='draw')draws++; if(r.kind==='loss')losses++; if(r.score){goalsFor+=r.score[0];goalsAgainst+=r.score[1];} });
  const awards=(data.gameAwards||[]).filter(visible), seasons=new Set(completedGames.map(g=>g.season).filter(Boolean));
  const standings=(data.standings||[]).filter(visible), row=standings.find(r=>/allstar galaxy/i.test(String(r.team||'')))||standings[0]||{};
  const pct=completedGames.length ? Math.round((wins/completedGames.length)*100) : 0;
  const current=currentCompleted.reduce((r,g)=>{const k=parseResult(g).kind;if(k==='win')r.w++;if(k==='draw')r.d++;if(k==='loss')r.l++;return r},{w:0,d:0,l:0});
  const definitions={
    record:['Club Record',[['Games Played',completedGames.length],['Wins',wins],['Draws',draws],['Losses',losses],['Win Percentage',pct+'%'],['Goal Difference',goalsFor-goalsAgainst]]],
    goals:['Goals & Seasons',[['Goals For',goalsFor],['Goals Against',goalsAgainst],['Goal Difference',goalsFor-goalsAgainst],['Goals / Game',completedGames.length?(goalsFor/completedGames.length).toFixed(2):'—'],['Seasons',seasons.size],['Current Season',latestSeason]]],
    snapshot:['Team Snapshot',[['Current Season',latestSeason],['Roster Players',players.length],['Games Played',currentCompleted.length],['Current Record',`${current.w}-${current.d}-${current.l}`],['Media Collections',(data.playlists||[]).filter(visible).length],['Games Archived',(data.games||[]).filter(visible).length]]],
    honors:['Team Honors',[['Game Awards',awards.length],['Media Collections',(data.playlists||[]).filter(visible).length],['Season Collections',(data.seasons||[]).filter(visible).length],['Players Archived',players.length],['Awarded Players',new Set(awards.map(a=>a.playerId).filter(Boolean)).size],['Seasons',seasons.size]]],
    standings:['Current Standings',[['Position',row.position&&row.position!=='—'?`#${row.position}`:'Not Published'],['Points',row.points||'—'],['Played',row.played||'—'],['Wins',row.wins||'—'],['Draws',row.draws||'—'],['Losses',row.losses||'—']]]
  };
  const [title,items]=definitions[key]||['Team Stats',[]];
  return {title,html:`<div class="team-stats-detail-grid">${items.map(([label,value])=>`<div class="team-stats-detail-item"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}</div>`};
}
function closeStatsModal(){ statsModal.hidden=true; }
function openStatsModal(key){ const d=statsDetailMarkup(key); statsModal.querySelector('h2').textContent=d.title; statsModal.querySelector('.team-stats-modal-content').innerHTML=d.html; statsModal.hidden=false; statsModal.querySelector('.team-stats-modal-close')?.focus(); }
statsModal.querySelectorAll('[data-stats-close]').forEach(el=>el.addEventListener('click',closeStatsModal));

root.querySelectorAll('.team-stat-card[data-stat-key]').forEach(card => {
  const activate=()=>{
    if(card.dataset.statKey==='featured'){ showModal(Number(card.dataset.featuredPlayerIndex)||0); return; }
    openStatsModal(card.dataset.statKey);
  };
  card.addEventListener('click',activate);
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
});

document.addEventListener('keydown', event => {
  if (!statsModal.hidden) { if (event.key === 'Escape') closeStatsModal(); return; }
  if (!cardLightbox.hidden) {
    if (event.key === 'Escape') closeCardLightbox();
    return;
  }
  if (!modal || modal.hidden) return;
  if (event.key === 'Escape') closeModal();
  if (event.key === 'ArrowLeft') showModal(modalIndex - 1);
  if (event.key === 'ArrowRight') showModal(modalIndex + 1);
});
