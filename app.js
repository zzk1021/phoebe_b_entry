'use strict';
const CHANNELS = [{name:'历史调研室',mid:'519872016',symbol:'🏛️'},{name:'思维实验室',mid:'14583962',symbol:'💡'}];
function parseVideos(text) {
  const channels = []; const errors=[]; let current=null; const seen=new Set();
  text.replace(/^\uFEFF/,'').split(/\r?\n/).forEach((raw,i)=>{
    const line=raw.trim(); if(!line || line.startsWith('#')) return;
    if(line.startsWith('[') && line.endsWith(']')) {const name=line.slice(1,-1).trim(); if(!name){current=null;errors.push('第 '+(i+1)+' 行：频道名不能为空');return;} current=channels.find(c=>c.name===name);if(!current){current={name,symbol:CHANNELS.find(c=>c.name===name)?.symbol || '🎬',videos:[]};channels.push(current);}return;}
    if(!current){errors.push('第 '+(i+1)+' 行：请先填写频道标题');return;}
    const [input,...labels]=line.split('|'); const source=input.trim();let bvid,p=1;
    if(/^BV[0-9A-Za-z]{10}$/.test(source)) bvid=source;
    else {try {const url=new URL(source);if(url.protocol!=='https:' || !['www.bilibili.com','bilibili.com','m.bilibili.com'].includes(url.hostname)) throw Error(); const match=url.pathname.match(/^\/video\/(BV[0-9A-Za-z]{10})\/?$/);if(!match)throw Error();bvid=match[1];if(url.searchParams.has('p')){const value=url.searchParams.get('p');if(!/^[1-9][0-9]*$/.test(value))throw Error();p=Number(value);if(!Number.isSafeInteger(p))throw Error();}}catch{errors.push('第 '+(i+1)+' 行：请使用 BV 号或完整 B站视频链接');return;}}
    const key=bvid+':'+p;if(seen.has(key))return;seen.add(key);current.videos.push({bvid,p,title:labels.join('|').trim() || bvid+(p>1?' · 第 '+p+' 集':'')});
  });return {channels,errors};
}
if(typeof module!=='undefined') module.exports={parseVideos};
if(typeof document!=='undefined'){
let lastButton=null;
const status=document.getElementById('status'),watch=document.getElementById('watch'),player=document.getElementById('player');
function play(video,button){lastButton=button;player.replaceChildren();document.getElementById('watch-title').textContent=video.title;const frame=document.createElement('iframe');const url=new URL('https://player.bilibili.com/player.html');url.search=new URLSearchParams({bvid:video.bvid,p:String(video.p),autoplay:'0',danmaku:'0'});frame.src=url.href;frame.title=video.title;frame.allow='fullscreen';frame.allowFullscreen=true;frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-presentation');player.append(frame);watch.hidden=false;document.getElementById('close').focus({preventScroll:true});watch.scrollIntoView({behavior:'smooth',block:'start'});}
document.getElementById('close').addEventListener('click',()=>{player.replaceChildren();watch.hidden=true;lastButton?.focus();});
fetch('videos.txt',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.text();}).then(text=>{const {channels,errors}=parseVideos(text);status.textContent=errors.length?'有 '+errors.length+' 条配置需要家长检查：'+errors.join('；'):'';for(const channel of channels){const section=document.createElement('section');section.className='channel';const heading=document.createElement('div');heading.className='channel-heading';const symbol=document.createElement('span');symbol.className='symbol';symbol.textContent=channel.symbol;symbol.setAttribute('aria-hidden','true');const info=document.createElement('div');const h=document.createElement('h2');h.textContent=channel.name;const count=document.createElement('p');count.className='count';count.textContent=channel.videos.length+' 个精选视频';info.append(h,count);heading.append(symbol,info);section.append(heading);const grid=document.createElement('div');grid.className='videos';channel.videos.forEach(video=>{const button=document.createElement('button');button.type='button';button.className='video';const icon=document.createElement('span');icon.className='play';icon.textContent='▶';icon.setAttribute('aria-hidden','true');const label=document.createElement('span');label.className='label';label.textContent=video.title;const small=document.createElement('small');small.textContent='点击播放';label.append(small);button.append(icon,label);button.addEventListener('click',()=>play(video,button));grid.append(button);});if(!channel.videos.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='家人还在挑选，稍后再来看看。';section.append(empty);}section.append(grid);document.getElementById('channels').append(section);}}).catch(()=>{status.textContent='视频列表暂时无法读取，请刷新页面。家长请确认 videos.txt 已上传到网站根目录。';});
}
