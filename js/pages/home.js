/* ==========================================================================\n   HOME PAGE MODULE\n   --------------------------------------------------------------------------\n   IMPORTANT: This file controls HOME-PAGE CONTENT ONLY.\n   Do not place shared header, navigation, status-bar, hero, footer, or global\n   framework logic here. Those components are intentionally isolated elsewhere.\n\n   Home page layout:\n     1. Latest Games carousel (data-driven from master-content.json)\n     2. Explore the Allstar Galaxy guided-navigation cards\n   ========================================================================== */

const root = document.querySelector('#page-content');

const FEATURE_CARDS = [
  ['Galaxy Shuffle', 'Discover a completely random video from the archive.', 'galaxy-shuffle.html'],
  ['Search', 'Find players, games, seasons, and media.', 'search.html'],
  ['Latest Games', 'Watch the newest Allstar Galaxy games.', '#latest-games'],
  ['Game Awards', 'Relive goals, saves, assists, plays, and players of the game.', 'game-awards.html'],
  ['Best Of', 'Explore the greatest Allstar Galaxy moments.', 'media.html#best-of'],
  ['Complete Archive', 'Browse every available season and collection.', 'seasons.html']
];

/** Escape user/data supplied strings before placing them into generated HTML. */
function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/** A playable link is any non-empty value that is not the legacy # placeholder. */
function validMediaLink(value) {
  return typeof value === 'string' && value.trim() !== '' && value.trim() !== '#';
}

/** Convert "W (3-2)" into separate result/score display where possible. */
function splitResult(result = '') {
  const match = String(result).trim().match(/^([WDL])\s*\(([^)]+)\)$/i);
  if (!match) return { outcome: result || 'RESULT', score: '' };
  const labels = { W: 'WIN', D: 'DRAW', L: 'LOSS' };
  return { outcome: labels[match[1].toUpperCase()] || match[1], score: match[2] };
}

/**
 * Choose the newest published season automatically.
 * This keeps Home current as new seasons are added without editing this file.
 */
function seasonRank(season = '') {
  const text = String(season).trim();
  const yearMatch = text.match(/(20\d{2})/);
  const year = yearMatch ? Number(yearMatch[1]) : 0;
  const part = /winter/i.test(text) ? 1 : /spring/i.test(text) ? 2 : /summer/i.test(text) ? 3 : /fall|autumn/i.test(text) ? 4 : 0;
  return (year * 10) + part;
}

function getCurrentSeasonGames(games = []) {
  const published = games.filter(game => game && game.status === 'published' && game.group === 'latest');
  if (!published.length) return [];

  const newestSeason = [...published]
    .sort((a, b) => seasonRank(b.season) - seasonRank(a.season))[0]?.season;

  return published
    .filter(game => game.season === newestSeason)
    .sort((a, b) => Number(b.gameNumber || b.order || 0) - Number(a.gameNumber || a.order || 0));
}

function gameCard(game, index) {
  const result = splitResult(game.result);
  const available = [game.fullMatch, game.highlights, game.slideshow].filter(validMediaLink).length;
  const label = game.cardLabel === 'new' ? 'NEW' : game.cardLabel === 'current-season' ? 'CURRENT SEASON' : 'LATEST GAME';
  const date = game.date ? new Date(`${game.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return `
    <article class="home-game-card" data-game-index="${index}" tabindex="0" role="button" aria-label="Open ${escapeHtml(game.season)} Game ${escapeHtml(game.gameNumber)} versus ${escapeHtml(game.opponent)}">
      <div class="home-game-card__topline">
        <span class="home-game-card__label">${escapeHtml(label)}</span>
        <span class="home-game-card__videos">${available} VIDEO${available === 1 ? '' : 'S'}</span>
      </div>
      <div class="home-game-card__body">
        <div class="home-game-card__game">${escapeHtml(game.season)}<br><strong>GAME ${String(game.gameNumber || '').padStart(2, '0')}</strong></div>
        <div class="home-game-card__matchup"><span>ALLSTAR GALAXY</span><small>VS</small><span>${escapeHtml(game.opponent || 'Opponent')}</span></div>
        <div class="home-game-card__result"><span>${escapeHtml(result.outcome)}</span><strong>${escapeHtml(result.score)}</strong></div>
      </div>
      ${date ? `<div class="home-game-card__date">${escapeHtml(date)}${game.location ? ` • ${escapeHtml(game.location)}` : ''}</div>` : ''}
      <div class="home-game-card__hint">Open Game →</div>
    </article>`;
}

function mediaButton(label, href, className = '') {
  if (!validMediaLink(href)) return `<span class="game-media-link is-unavailable ${className}">${label}<small>Coming Soon</small></span>`;
  return `<a class="game-media-link ${className}" href="${escapeHtml(href)}" target="_blank" rel="noopener">${label}<small>Watch Now</small></a>`;
}

function openGameDialog(game) {
  let dialog = document.querySelector('#home-game-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'home-game-dialog';
    dialog.className = 'home-game-dialog';
    document.body.append(dialog);
  }

  const result = splitResult(game.result);
  dialog.innerHTML = `
    <div class="home-game-dialog__panel">
      <button class="home-game-dialog__close" type="button" aria-label="Close game menu">×</button>
      <p class="home-game-dialog__eyebrow">${escapeHtml(game.season)} • GAME ${escapeHtml(game.gameNumber)}</p>
      <h2>ALLSTAR GALAXY <span>VS</span> ${escapeHtml(game.opponent || 'Opponent')}</h2>
      <p class="home-game-dialog__result">${escapeHtml(result.outcome)} ${escapeHtml(result.score)}</p>
      <p class="home-game-dialog__copy">Choose an available video from this game.</p>
      <div class="home-game-dialog__links">
        ${mediaButton('FULL MATCH', game.fullMatch, 'is-full')}
        ${mediaButton('HIGHLIGHTS', game.highlights, 'is-highlights')}
        ${mediaButton('SLIDESHOW', game.slideshow, 'is-slideshow')}
      </div>
      <a class="home-game-dialog__media" href="media.html#latest-games">Open Media Center →</a>
    </div>`;

  dialog.querySelector('.home-game-dialog__close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  }, { once: true });

  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function renderExploreSection() {
  return `
    <section class="home-explore" aria-labelledby="home-explore-title">
      <img id="home-explore-title" class="section-title" src="assets/images/titles/section-titles/homepage-explore-galaxy-title.png" alt="Explore the Allstar Galaxy">
      <p class="section-copy">Choose a feature and explore the complete Allstar Galaxy experience.</p>
      <section class="feature-grid">
        ${FEATURE_CARDS.map(item => `
          <article class="feature-card">
            <h2>${item[0]}</h2>
            <p>${item[1]}</p>
            <a href="${item[2]}">Explore →</a>
          </article>`).join('')}
      </section>
    </section>`;
}

function renderLatestGames(games) {
  if (!games.length) {
    return `
      <section id="latest-games" class="home-latest-games" aria-labelledby="latest-games-title">
        <img id="latest-games-title" class="home-latest-games__title" src="assets/images/titles/section-titles/homepage-latest-games-title.png" alt="Latest Games — Allstar Galaxy">
        <p class="home-latest-games__copy">The newest Allstar Galaxy games will appear here as they are published.</p>
      </section>`;
  }

  return `
    <section id="latest-games" class="home-latest-games" aria-labelledby="latest-games-title">
      <img id="latest-games-title" class="home-latest-games__title" src="assets/images/titles/section-titles/homepage-latest-games-title.png" alt="Latest Games — Allstar Galaxy">
      <p class="home-latest-games__copy">Open a game card to choose from every available video.</p>
      <div class="home-games-carousel" data-carousel>
        <button class="home-games-carousel__arrow is-prev" type="button" aria-label="Previous game">‹</button>
        <div class="home-games-carousel__viewport">
          <div class="home-games-carousel__track">
            ${games.map(gameCard).join('')}
          </div>
        </div>
        <button class="home-games-carousel__arrow is-next" type="button" aria-label="Next game">›</button>
      </div>
      <div class="home-games-carousel__dots" aria-label="Choose a game">
        ${games.map((_, i) => `<button type="button" data-slide="${i}" class="${i === 0 ? 'is-active' : ''}" aria-label="Show game ${i + 1}"></button>`).join('')}
      </div>
      <a class="home-latest-games__all" href="media.html#latest-games">View All Games in Media Center →</a>
    </section>`;
}

function setupCarousel(games) {
  const carousel = root.querySelector('[data-carousel]');
  if (!carousel || !games.length) return;

  const track = carousel.querySelector('.home-games-carousel__track');
  const viewport = carousel.querySelector('.home-games-carousel__viewport');
  const cards = [...carousel.querySelectorAll('.home-game-card')];
  const dots = [...root.querySelectorAll('.home-games-carousel__dots [data-slide]')];
  let current = 0;

  const goTo = index => {
    current = (index + cards.length) % cards.length;
    const card = cards[current];
    const offset = card.offsetLeft - ((viewport.clientWidth - card.offsetWidth) / 2);
    track.style.transform = `translateX(${-Math.max(0, offset)}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    cards.forEach((item, i) => item.classList.toggle('is-current', i === current));
  };

  carousel.querySelector('.is-prev')?.addEventListener('click', () => goTo(current - 1));
  carousel.querySelector('.is-next')?.addEventListener('click', () => goTo(current + 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(Number(dot.dataset.slide))));

  cards.forEach((card, index) => {
    const open = () => openGameDialog(games[index]);
    card.addEventListener('click', open);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });

  window.addEventListener('resize', () => goTo(current));
  requestAnimationFrame(() => goTo(0));
}

async function initHome() {
  let games = [];
  try {
    const response = await fetch('data/master-content.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    games = getCurrentSeasonGames(Array.isArray(data.games) ? data.games : []);
  } catch (error) {
    console.warn('[Home] Latest Games data could not be loaded.', error);
  }

  root.innerHTML = `${renderLatestGames(games)}${renderExploreSection()}`;
  setupCarousel(games);
}

initHome();
