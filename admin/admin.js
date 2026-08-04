/* ============================================================================
   ALLSTAR GALAXY V2.5 ADMIN PAGE CONFIGURATION EDITOR
   ----------------------------------------------------------------------------
   GitHub Pages cannot safely write directly to the repository. This editor
   therefore downloads a replacement JSON file that the administrator commits
   through GitHub Desktop. Each page remains isolated in data/pages/<page>.json.
============================================================================ */
const pages=['home','team','updates','media','explore','shuffle','live','search','follow','about','404'];
const select=document.querySelector('#page');
const editor=document.querySelector('#editor');
const heroList=document.querySelector('#heroList');

pages.forEach(page=>select.add(new Option(page,page)));

function readEditor(){
  try{return JSON.parse(editor.value)}
  catch(error){alert(`Invalid JSON: ${error.message}`);return null}
}

function createHeroRow(path=''){
  const row=document.createElement('div');
  row.className='hero-row';
  row.innerHTML=`
    <input class="hero-path" value="${String(path).replaceAll('"','&quot;')}" placeholder="assets/images/heroes/pages/example.png">
    <button class="up" type="button">Move Up</button>
    <button class="down" type="button">Move Down</button>
    <button class="remove" type="button">Remove</button>`;
  row.querySelector('.up').onclick=()=>row.previousElementSibling&&heroList.insertBefore(row,row.previousElementSibling);
  row.querySelector('.down').onclick=()=>row.nextElementSibling&&heroList.insertBefore(row.nextElementSibling,row);
  row.querySelector('.remove').onclick=()=>row.remove();
  heroList.append(row);
}

function renderHeroList(){
  const data=readEditor();
  if(!data)return;
  heroList.innerHTML='';
  (Array.isArray(data.hero)?data.hero:[]).forEach(createHeroRow);
}

function applyHeroList(){
  const data=readEditor();
  if(!data)return;
  data.hero=[...document.querySelectorAll('.hero-path')].map(input=>input.value.trim()).filter(Boolean);
  editor.value=JSON.stringify(data,null,2);
  renderHeroList();
}

async function loadPage(){
  try{
    const response=await fetch(`../data/pages/${select.value}.json`,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    editor.value=JSON.stringify(await response.json(),null,2);
    renderHeroList();
  }catch(error){alert(`Page JSON could not be loaded: ${error.message}`)}
}

function downloadPage(){
  applyHeroList();
  const data=readEditor();
  if(!data)return;
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download=`${select.value}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

document.querySelector('#load').onclick=loadPage;
document.querySelector('#addHero').onclick=()=>createHeroRow();
document.querySelector('#applyHeroes').onclick=applyHeroList;
document.querySelector('#download').onclick=downloadPage;
select.onchange=loadPage;
loadPage();
