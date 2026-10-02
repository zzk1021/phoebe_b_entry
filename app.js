const app=document.querySelector('#app'), modal=document.querySelector('#player'), iframe=document.querySelector('#iframe'), ptitle=document.querySelector('#ptitle');
function esc(s=''){return s.replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
fetch('data/videos.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{
 app.innerHTML=''; for(const ch of data.channels){const sec=document.createElement('section');sec.className='channel';sec.innerHTML=`<h2>${esc(ch.icon)} ${esc(ch.name)}</h2><div class="grid"></div>`; const grid=sec.querySelector('.grid');
 for(const v of ch.videos){const b=document.createElement('button');b.className='card';b.innerHTML=`<img loading="lazy" src="${esc(v.pic)}" alt=""><div class="meta"><div class="title">${esc(v.title)}</div><div class="date">${esc(v.date)}</div></div>`;b.onclick=()=>play(v);grid.appendChild(b)} app.appendChild(sec)}
}).catch(()=>app.innerHTML='<div class="empty">视频列表还没生成。请先运行 GitHub Action「更新视频列表」。</div>');
function play(v){ptitle.textContent=v.title;iframe.src=`https://player.bilibili.com/player.html?bvid=${encodeURIComponent(v.bvid)}&page=1&high_quality=1&danmaku=0&autoplay=0`;modal.classList.remove('hidden');document.body.style.overflow='hidden'}
function close(){iframe.src='about:blank';modal.classList.add('hidden');document.body.style.overflow=''}
document.querySelector('#close').onclick=close;window.addEventListener('popstate',close);
