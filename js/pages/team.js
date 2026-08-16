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

  const featured = [...players].sort((a, b) =>
    (awardCounts.get(String(b.id)) || 0) - (awardCounts.get(String(a.id)) || 0)
  )[0] || players[0] || {};
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
      feature: true,
      body: `
        <div class="team-stat-featured-copy">
          <b>#${esc(featured.number || '—')} ${esc(featured.name || 'Allstar Galaxy')}</b>
          <span>${esc(featured.position || 'Player')}</span>
          <small>${featuredAwards} Game Award${featuredAwards === 1 ? '' : 's'}</small>
        </div>
        <img src="${esc(featuredPhoto)}" alt="${esc(featured.name || 'Featured player')}" loading="lazy">`
    },
    {
      title: 'Club Record',
      body: `<ul><li><b>${completedGames.length}</b> Games</li><li><b>${wins}</b> Wins</li><li><b>${draws}</b> Draws</li><li><b>${losses}</b> Losses</li></ul>`
    },
    {
      title: 'Goals & Seasons',
      body: `<ul><li><b>${goalsFor}</b> Goals For</li><li><b>${goalsAgainst}</b> Goals Against</li><li><b>${goalsFor - goalsAgainst}</b> Goal Difference</li><li><b>${seasons.size}</b> Seasons</li></ul>`
    },
    {
      title: 'Team Snapshot',
      body: `<ul><li><b>${esc(latestSeason)}</b></li><li><b>${players.length}</b> Roster Players</li><li><b>${currentCompleted.length}</b> Games Played</li><li><b>${currentRecord.w}-${currentRecord.d}-${currentRecord.l}</b> Current Record</li></ul>`
    },
    {
      title: 'Team Honors',
      body: `<ul><li><b>${awards.length}</b> Game Awards</li><li><b>${(data.playlists || []).filter(visible).length}</b> Media Collections</li><li><b>${(data.seasons || []).filter(visible).length}</b> Season Collections</li><li><b>${players.length}</b> Players Archived</li></ul>`
    },
    {
      title: 'Current Standings',
      body: `<ul><li><b>${esc(standingLabel)}</b> Position</li><li><b>${esc(points)}</b> Points</li><li><b>${esc(galaxyStanding.played || '—')}</b> Played</li><li><b>${esc(galaxyStanding.wins || '—')}</b> Wins</li></ul>`
    }
  ];

  return cards.map(card => `
    <article class="team-stat-card${card.feature ? ' team-stat-featured' : ''}">
      <h3>${card.title}</h3>
      <div class="team-stat-body">${card.body}</div>
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

  cardButtons.forEach((card, index) => {
    const distance = Math.abs(index - activeIndex);
    card.classList.toggle('is-active', index === activeIndex);
    card.classList.toggle('is-neighbor', distance === 1);
    card.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
  });

  dotsRoot?.querySelectorAll('.team-carousel-dot').forEach((dot, index) => {
    dot.classList.toggle('is-active', index === activeIndex);
    dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
  });

  const viewport = carousel.querySelector('.team-carousel-viewport');
  const activeCard = cardButtons[activeIndex];
  if (viewport && activeCard) {
    const cardCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;
    const viewportCenter = viewport.clientWidth / 2;
    track.style.transform = `translateX(${viewportCenter - cardCenter}px)`;
  }

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

/* Player viewer ------------------------------------------------------------ */
const modal = root.querySelector('[data-team-player-modal]');
const modalContent = modal?.querySelector('.team-player-modal-content');
let modalIndex = 0;

function profileCard(player) {
  const { first, last } = splitPlayerName(player);
  const facts = [
    ['DATE OF BIRTH', player.dateOfBirth || 'N/A'],
    ['NATIONALITY', player.nationality || 'N/A'],
    ['PREFERRED FOOT', player.preferredFoot || 'N/A'],
    ['HEIGHT', player.height || 'N/A'],
    ['WEIGHT', player.weight || 'N/A']
  ];

  return `
    <div class="team-profile-card" aria-label="${esc(player.name || `${first} ${last}`)} profile card">
      <img class="team-profile-template" src="assets/images/team/templates/player-profile-card-template.png" alt="" aria-hidden="true">
      <div class="team-profile-number">${esc(player.number || '00')}</div>
      <div class="team-profile-position">${esc(player.position || 'PLAYER')}</div>
      <div class="team-profile-name">
        <small>${esc(first)}</small>
        <strong>${esc(last)}</strong>
      </div>
      <div class="team-profile-facts">
        ${facts.map(([label, value]) => `
          <div class="team-profile-fact">
            <span>${esc(label)}</span>
            <b>${esc(value)}</b>
          </div>`).join('')}
      </div>
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
      <div class="team-player-modal-panel">
        <span class="team-player-card-label">FRONT CARD</span>
        <div class="team-player-modal-card">${playerCard(player, index, 'is-modal-card')}</div>
      </div>
      <div class="team-player-modal-panel">
        <span class="team-player-card-label">PROFILE CARD</span>
        ${profileCard(player)}
      </div>
    </div>

    <div class="team-player-modal-footer">
      ${quote ? `<blockquote>${esc(quote).replace(/\n/g, '<br>')}</blockquote>` : '<p class="team-player-modal-note">Player details can be managed from Administration.</p>'}
      <a class="team-player-photo-link" href="${esc(fullPhoto)}" target="_blank" rel="noopener">Open Full Player Photo</a>
    </div>`;
}
function showModal(index) {
  if (!modal || !modalContent || !players.length) return;
  modalIndex = (index + players.length) % players.length;
  modalContent.innerHTML = modalMarkup(players[modalIndex], modalIndex);
  modal.hidden = false;
  document.body.classList.add('team-modal-open');
  modal.querySelector('.team-player-modal-close')?.focus();
}

function closeModal() {
  if (!modal) return;
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

document.addEventListener('keydown', event => {
  if (!modal || modal.hidden) return;
  if (event.key === 'Escape') closeModal();
  if (event.key === 'ArrowLeft') showModal(modalIndex - 1);
  if (event.key === 'ArrowRight') showModal(modalIndex + 1);
});
