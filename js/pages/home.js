/* ============================================================================
   ALLSTAR GALAXY — HOME PAGE
   Final Home architecture: Hero -> Explore the Allstar Galaxy live cards.

   IMPORTANT:
   - This file only controls Home page content.
   - The universal header/status/hero/footer remain in js/site-frame.js.
   - Live card counts are calculated from data/master-content.json at load time.
     When Administration publishes a new game/video/player/playlist and updates
     master-content.json, these counts update automatically on the next visit.
============================================================================ */

const root = document.querySelector('#page-content');

const CARD_DEFINITIONS = [
  {
    id: 'shuffle',
    title: 'Galaxy Shuffle',
    description: 'Let the Galaxy choose a random game and video from the archive.',
    href: 'galaxy-shuffle.html',
    cta: 'Start Shuffle →',
    icon: '◉'
  },
  {
    id: 'search',
    title: 'Search',
    description: 'Find games, players, opponents, seasons, awards, and playlists.',
    href: 'search.html',
    cta: 'Search the Galaxy →',
    icon: '⌕'
  },
  {
    id: 'latest',
    title: 'Latest Games',
    description: 'Open the newest matches and choose from every available game video.',
    href: 'media.html#latest-games',
    cta: 'Watch Latest Games →',
    icon: '▤'
  },
  {
    id: 'awards',
    title: 'Game Awards',
    description: 'Celebrate the player, goal, save, assist, and play of each game.',
    href: 'game-awards.html',
    cta: 'View Game Awards →',
    icon: '♜'
  },
  {
    id: 'best',
    title: 'Best Of',
    description: 'Watch the greatest goals, saves, assists, plays, and moments.',
    href: 'media.html#best-of',
    cta: 'Explore the Best →',
    icon: '★'
  },
  {
    id: 'archive',
    title: 'Complete Archive',
    description: 'Browse the full collection of seasons, games, playlists, and videos.',
    href: 'seasons.html',
    cta: 'Open the Archive →',
    icon: '□'
  }
];

function isPublished(item = {}) {
  const status = String(item.status ?? 'published').trim().toLowerCase();
  return !['hidden', 'inactive', 'draft', 'archived', 'retired'].includes(status);
}

function isRealLink(value) {
  const text = String(value ?? '').trim();
  return Boolean(text && text !== '#' && text.toLowerCase() !== 'coming soon');
}

function gameVideoCount(games) {
  const videoFields = ['fullMatch', 'highlights', 'slideshow'];
  return games.reduce((total, game) => total + videoFields.filter(field => isRealLink(game[field])).length, 0);
}

function metricsFrom(data = {}) {
  const games = (data.games || []).filter(isPublished);
  const players = (data.players || []).filter(isPublished);
  const seasons = (data.seasons || []).filter(isPublished);
  const playlists = (data.playlists || []).filter(isPublished);
  const awards = (data.gameAwards || []).filter(isPublished);
  const news = (data.news || []).filter(isPublished);

  const videos = gameVideoCount(games);
  const awardVideos = awards.filter(item => isRealLink(item.videoUrl)).length;
  const shuffleVideos = videos + awardVideos;
  const searchable = games.length + players.length + seasons.length + playlists.length + awards.length + news.length;
  const bestOf = playlists.filter(item => Array.isArray(item.locations) && item.locations.includes('home-best')).length;

  return {
    shuffle: `${shuffleVideos} VIDEO${shuffleVideos === 1 ? '' : 'S'} READY TO SHUFFLE`,
    search: `${searchable} SEARCHABLE ITEM${searchable === 1 ? '' : 'S'}`,
    latest: `${games.length} GAME${games.length === 1 ? '' : 'S'} • ${videos} VIDEO${videos === 1 ? '' : 'S'}`,
    awards: `${awardVideos} AWARD VIDEO${awardVideos === 1 ? '' : 'S'}`,
    best: `${bestOf} FEATURED COLLECTION${bestOf === 1 ? '' : 'S'}`,
    archive: `${seasons.length} SEASON${seasons.length === 1 ? '' : 'S'} • ${playlists.length} COLLECTION${playlists.length === 1 ? '' : 'S'}`
  };
}

function cardMarkup(card, metric = 'LIVE') {
  return `
    <a class="home-live-card" href="${card.href}" aria-label="${card.title}: ${card.cta.replace(' →', '')}">
      <span class="home-card-icon" aria-hidden="true">${card.icon}</span>
      <h2>${card.title}</h2>
      <p>${card.description}</p>
      <span class="home-card-metric" data-metric="${card.id}">${metric}</span>
      <span class="home-card-cta">${card.cta}</span>
    </a>`;
}

function render(metrics = {}) {
  root.innerHTML = `
    <section class="home-explore" aria-labelledby="home-explore-title">
      <img id="home-explore-title" class="section-title home-explore-title" src="assets/images/titles/section-titles/homepage-explore-galaxy-title.png" alt="Explore the Allstar Galaxy">
      <p class="section-copy">Discover the unique ways to search, watch, shuffle, and explore the complete Allstar Galaxy media collection.</p>
      <div class="home-live-grid">
        ${CARD_DEFINITIONS.map(card => cardMarkup(card, metrics[card.id])).join('')}
      </div>
    </section>`;
}

async function init() {
  /* Render immediately so Home never waits on data before showing navigation. */
  render({
    shuffle: 'VIDEOS READY TO SHUFFLE',
    search: 'SEARCHABLE ITEMS',
    latest: 'LATEST GAMES',
    awards: 'AWARD VIDEOS',
    best: 'FEATURED COLLECTIONS',
    archive: 'SEASONS • COLLECTIONS'
  });

  try {
    const response = await fetch('data/master-content.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const metrics = metricsFrom(await response.json());
    Object.entries(metrics).forEach(([id, value]) => {
      const node = root.querySelector(`[data-metric="${id}"]`);
      if (node) node.textContent = value;
    });
  } catch (error) {
    console.warn('Home live-card counts unavailable; navigation remains usable.', error);
  }
}

init();
