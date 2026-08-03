
const root=document.querySelector('#page-content');
const site=window.AllstarGalaxy?.site;
const searchable=[
 ['Home','Explore Allstar Galaxy features and latest content.','index.html','home explore'],
 ['Team Roster','Players, profiles, team statistics, and club records.','team.html#roster','team player roster profile stats'],
 ['Updates','Schedule, standings, results, and latest news.','updates.html','updates schedule standings results news'],
 ['Media Center','Latest games, full matches, highlights, slideshows, seasons, and archives.','media.html','media games highlights slideshow archive seasons'],
 ['Galaxy Shuffle','Open a completely random Allstar Galaxy video.','galaxy-shuffle.html','shuffle random video discover'],
 ['Game Awards','Goals, saves, assists, plays, and players of the game.','game-awards.html','awards goal save assist play player'],
 ['Live Stream','Watch current and upcoming Allstar Galaxy broadcasts.','livestream.html','live stream broadcast'],
 ['Follow the Team','Allstar Galaxy social media links.','follow.html','follow social youtube instagram facebook tiktok x'],
 ['About Allstar Galaxy','The story, purpose, and archive behind the website.','about.html','about history mission archive']
];
root.innerHTML=`<section class="search-intro"><h1>SEARCH EVERYTHING</h1><p class="section-copy">One search across every Allstar Galaxy page, player, game, season, award, and media collection.</p></section><section class="search-shell"><form class="search-form" role="search"><input class="search-input" type="search" name="q" autocomplete="off" placeholder="Search players, games, videos, awards, seasons…" aria-label="Search Allstar Galaxy"><button class="search-submit" type="submit">Search</button></form><div class="quick-searches">${['Players','Latest Games','Highlights','Awards','Seasons','Schedule','Live','About'].map(x=>`<button class="quick-search" type="button">${x}</button>`).join('')}</div><div class="search-results" aria-live="polite"><p class="search-empty">Start typing or choose a quick search.</p></div></section>`;
const form=root.querySelector('.search-form'),input=root.querySelector('.search-input'),results=root.querySelector('.search-results');
function run(q){q=q.trim().toLowerCase();if(!q){results.innerHTML='<p class="search-empty">Start typing or choose a quick search.</p>';return}const hits=searchable.filter(x=>x.join(' ').toLowerCase().includes(q));results.innerHTML=hits.length?hits.map(x=>`<article class="search-result"><h2>${x[0]}</h2><p>${x[1]}</p><a href="${x[2]}">Open →</a></article>`).join(''):`<p class="search-empty">No results found for “${q.replace(/[<>]/g,'')}”.</p>`}
form.addEventListener('submit',e=>{e.preventDefault();run(input.value)});input.addEventListener('input',()=>run(input.value));root.querySelectorAll('.quick-search').forEach(b=>b.addEventListener('click',()=>{input.value=b.textContent;run(input.value);input.focus()}));
