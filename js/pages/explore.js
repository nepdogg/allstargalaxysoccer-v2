/* Explore page navigation cards only. */
const root=document.querySelector('#page-content');
const cards=[
['Galaxy Shuffle','Let the Galaxy select a completely random game and video.','galaxy-shuffle.html','🎲'],
['Search Everything','Find players, games, opponents, seasons, awards, videos, and pages.','search.html','⌕'],
['Latest Games','Open the newest games and choose every available game video.','media.html#latest-games','▶'],
['Game Awards','Relive goals, saves, assists, plays, and players of the game.','game-awards.html','★'],
['Best of Allstar Galaxy','Browse the greatest moments and featured collections.','media.html#best-of','🏆'],
['Season Archive','Travel through complete seasons and historical game collections.','seasons.html','◷'],
['Complete Media Archive','Browse games, playlists, awards, seasons, photos, and videos.','media.html#complete-archive','▦'],
['Meet the Team','Discover the roster, player profiles, and team statistics.','team.html','👥'],
['Follow the Team','Connect with Allstar Galaxy across every social platform.','follow.html','✦']];
root.innerHTML=`<section class="explore-intro"><h1>Explore &amp; Discover</h1><p class="section-copy">Choose a destination, discover something unexpected, or let the Galaxy guide you to your next Allstar Galaxy experience.</p></section><nav class="discovery-strip" aria-label="Quick discovery links"><a href="galaxy-shuffle.html">Surprise Me</a><a href="media.html#latest-games">Newest Game</a><a href="game-awards.html">Latest Awards</a><a href="team.html">Player Profiles</a><a href="search.html">Search Everything</a></nav><section class="feature-grid">${cards.map(x=>`<article class="feature-card"><span class="explore-card-icon">${x[3]}</span><h2>${x[0]}</h2><p>${x[1]}</p><a href="${x[2]}">Explore →</a></article>`).join('')}</section>`;