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
    icon: 'shuffle'
  },
  {
    id: 'search',
    title: 'Search',
    description: 'Find games, players, opponents, seasons, awards, and playlists.',
    href: 'search.html',
    cta: 'Search the Galaxy →',
    icon: 'search'
  },
  {
    id: 'latest',
    title: 'Latest Games',
    description: 'Open the newest matches and choose from every available game video.',
    href: 'media.html#latest-games',
    cta: 'Watch Latest Games →',
    icon: 'latest'
  },
  {
    id: 'awards',
    title: 'Game Awards',
    description: 'Celebrate the player, goal, save, assist, and play of each game.',
    href: 'game-awards.html',
    cta: 'View Game Awards →',
    icon: 'awards'
  },
  {
    id: 'best',
    title: 'Best Of',
    description: 'Watch the greatest goals, saves, assists, plays, and moments.',
    href: 'media.html#best-of',
    cta: 'Explore the Best →',
    icon: 'best'
  },
  {
    id: 'archive',
    title: 'Complete Archive',
    description: 'Browse the full collection of seasons, games, playlists, and videos.',
    href: 'seasons.html',
    cta: 'Open the Archive →',
    icon: 'archive'
  }
];


function homeIconSvg(id) {
  const common = `viewBox="0 0 24 24" aria-hidden="true" focusable="false"`;
  const icons = {
    shuffle: `<svg ${common}><path d="M4 7h3.5c3.5 0 4.5 10 9 10H20"/><path d="m17 14 3 3-3 3"/><path d="M4 17h3.5c1.7 0 2.8-2.4 4-4.8"/><path d="M13 9c1-1.2 2.1-2 3.5-2H20"/><path d="m17 4 3 3-3 3"/></svg>`,
    search: `<svg ${common}><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/></svg>`,
    latest: `<svg ${common}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m10 9 5 3-5 3Z"/><path d="M7 6.8h10"/></svg>`,
    awards: `<svg ${common}><path d="M8 4h8v4a4 4 0 0 1-8 0Z"/><path d="M8 6H5v1a4 4 0 0 0 4 4"/><path d="M16 6h3v1a4 4 0 0 1-4 4"/><path d="M12 12v5"/><path d="M8.5 20h7"/><path d="M10 17h4"/></svg>`,
    best: `<svg ${common}><path d="m12 3 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.03l-5.5 2.89 1.05-6.12L3.1 9.47l6.15-.9Z"/></svg>`,
    archive: `<svg ${common}><path d="M4 7h16v13H4Z"/><path d="M3 4h18v4H3Z"/><path d="M9 11h6"/></svg>`
  };
  return icons[id] || icons.archive;
}

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
      <span class="home-card-icon">${homeIconSvg(card.icon)}</span>
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
