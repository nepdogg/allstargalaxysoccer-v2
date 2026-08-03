/* ============================================================================
   404 PAGE CONTENT
   ----------------------------------------------------------------------------
   Creates helpful recovery choices when a visitor opens an invalid URL.
   The universal header, hero, status bar, and footer are mounted by js/app.js.
============================================================================ */
const host = document.querySelector('#page-content');

const recoveryCards = [
  ['Home', 'Return to the Allstar Galaxy homepage.', 'index.html'],
  ['Search Everything', 'Search players, games, seasons, awards, videos, and pages.', 'search.html'],
  ['Galaxy Shuffle', 'Let the Galaxy choose something unexpected.', 'galaxy-shuffle.html'],
  ['Latest Games', 'Open the newest matches and every available game video.', 'media.html#latest-games'],
  ['Meet the Team', 'Browse the roster and open player profiles.', 'team.html#roster'],
  ['Media Center', 'Explore seasons, awards, highlights, and the archive.', 'media.html']
];

host.innerHTML = `
  <section class="error-intro">
    <p class="error-code">404</p>
    <h1 class="error-title">Lost in the Galaxy</h1>
    <p class="section-copy">The page you requested could not be found. Use Search Everything or choose another destination.</p>
    <div class="error-actions">
      <a class="error-button" href="search.html">Search Everything</a>
      <a class="error-button" href="index.html">Return Home</a>
    </div>
  </section>
  <section class="feature-grid" aria-label="Recovery links">
    ${recoveryCards.map(([title, copy, href]) => `
      <article class="feature-card">
        <h2>${title}</h2>
        <p>${copy}</p>
        <a href="${href}">Open →</a>
      </article>`).join('')}
  </section>`;
