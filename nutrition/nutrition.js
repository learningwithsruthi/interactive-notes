/* Shared shell + practice engines for the Nutrition course pages. */
function toggleAns(id){ const a=document.getElementById(id); a.classList.toggle('show'); }
window.toggleAns=toggleAns;
function toggleLwsTheme(){
  const cur=document.body.dataset.theme||'light', next=cur==='dark'?'light':'dark';
  document.body.dataset.theme=next;
  try{ localStorage.setItem('lws-theme',next); }catch(e){}
  const b=document.getElementById('themeBtn'); if(b) b.innerHTML=next==='dark'?'&#9728;':'&#9790;';
}
window.toggleLwsTheme=toggleLwsTheme;
try{ if(localStorage.getItem('lws-theme')==='dark'){ document.body.dataset.theme='dark'; const b=document.getElementById('themeBtn'); if(b) b.innerHTML='&#9728;'; } }catch(e){}

(function setupSearch(){
  const input=document.querySelector('.search input'); if(!input) return;
  const cards=Array.from(document.querySelectorAll('.main .card'));
  const pgHead=document.querySelector('.main .pg-head'); let em=null;
  input.addEventListener('input',e=>{
    const q=e.target.value.toLowerCase().trim(); let n=0;
    cards.forEach(c=>{ if(!q){c.style.display='';n++;return;} const hit=c.textContent.toLowerCase().includes(q); c.style.display=hit?'':'none'; if(hit)n++; });
    if(pgHead) pgHead.style.display=q?'none':'';
    if(q&&n===0){ if(!em){ em=document.createElement('div'); em.className='card'; em.style.textAlign='center';
      em.innerHTML='<div class="body-text" style="color:var(--slate)">No sections match that search.</div>'; document.querySelector('.main').appendChild(em);} em.style.display=''; }
    else if(em){ em.style.display='none'; }
  });
  input.addEventListener('keydown',e=>{ if(e.key==='Escape'){input.value='';input.dispatchEvent(new Event('input'));} });
})();

/* flip cards: any .flip toggles on click */
document.addEventListener('click',e=>{ const f=e.target.closest('.flip'); if(f) f.classList.toggle('on'); });

const LETTERS='ABCDE';

/* ===== MCQ =====
   qs: [{q, stim?, o:[...], a:index, why, topic?}]
   mode 'practice' grades each click; mode 'test' grades on submit. */
function renderMCQ(el, qs, opts){
  opts=opts||{}; const test=opts.mode==='test';
  // shuffle answer choices on each load so the correct letter is not predictable
  qs=qs.map(x=>{ const idx=x.o.map((_,j)=>j); for(let j=idx.length-1;j>0;j--){ const k=Math.floor(Math.random()*(j+1)); [idx[j],idx[k]]=[idx[k],idx[j]]; }
    return Object.assign({},x,{o:idx.map(j=>x.o[j]),a:idx.indexOf(x.a)}); });
  let picked=new Array(qs.length).fill(-1), submitted=false;
  function draw(){
    let h='<div class="quiz-head"><span class="score" data-score></span><button class="site-btn secondary" data-reset>Start over</button></div>';
    qs.forEach((x,i)=>{
      h+='<div class="mcq" data-i="'+i+'"><div class="qn">Question '+(i+1)+(x.topic?' &middot; '+x.topic:'')+'</div>';
      if(x.stim) h+='<div class="stim">'+x.stim+'</div>';
      h+='<div class="qt">'+x.q+'</div>';
      x.o.forEach((t,j)=>{ h+='<button class="opt" data-j="'+j+'"><span class="L">'+LETTERS[j]+'</span><span>'+t+'</span></button>'; });
      h+='<div class="fb" data-fb></div></div>';
    });
    if(test) h+='<div class="btn-row"><button class="site-btn" data-submit>Submit test</button></div><div class="readout" data-result style="display:none"></div>';
    el.innerHTML=h;
    el.querySelector('[data-reset]').onclick=()=>{ picked.fill(-1); submitted=false; draw(); el.scrollIntoView({behavior:'smooth'}); };
    el.querySelectorAll('.mcq').forEach(card=>{
      const i=+card.dataset.i;
      card.querySelectorAll('.opt').forEach(b=>{ b.onclick=()=>{
        if(submitted) return;
        if(!test && picked[i]>=0) return;
        picked[i]=+b.dataset.j;
        if(test) card.querySelectorAll('.opt').forEach(o=>o.style.outline=o===b?'3px solid var(--sage)':'');
        else grade(card,i);
        score();
      }; });
    });
    if(test) el.querySelector('[data-submit]').onclick=submit;
    score();
  }
  function grade(card,i){
    const x=qs[i], p=picked[i];
    card.querySelectorAll('.opt').forEach(o=>{ const j=+o.dataset.j; o.disabled=true; o.style.outline='';
      if(j===x.a) o.classList.add('right'); else if(j===p) o.classList.add('wrong'); });
    const fb=card.querySelector('[data-fb]');
    fb.className='fb show '+(p===x.a?'ok':'no');
    fb.innerHTML=(p===x.a?'<strong>Correct.</strong> ':(p<0?'<strong>Not answered.</strong> The answer is '+LETTERS[x.a]+'. ':'<strong>Not quite.</strong> The answer is '+LETTERS[x.a]+'. '))+x.why;
  }
  function score(){
    const s=el.querySelector('[data-score]'); const done=picked.filter(p=>p>=0).length;
    const right=qs.filter((x,i)=>picked[i]===x.a).length;
    s.textContent=test&&!submitted ? done+' of '+qs.length+' answered' : right+' correct out of '+done+' answered ('+qs.length+' total)';
  }
  function submit(){
    const left=picked.filter(p=>p<0).length;
    const res=el.querySelector('[data-result]');
    if(left && !el.dataset.warned){ el.dataset.warned='1'; res.style.display='block'; res.innerHTML='<strong>'+left+' question'+(left>1?'s are':' is')+' still blank.</strong> On the real exam there is no penalty for guessing, so fill every one in. Click Submit again to grade anyway.'; return; }
    submitted=true; delete el.dataset.warned;
    el.querySelectorAll('.mcq').forEach(card=>grade(card,+card.dataset.i));
    const right=qs.filter((x,i)=>picked[i]===x.a).length, pct=Math.round(100*right/qs.length);
    const by={}; qs.forEach((x,i)=>{ const t=x.topic||'All'; by[t]=by[t]||[0,0]; by[t][1]++; if(picked[i]===x.a) by[t][0]++; });
    let h='<strong>Score: '+right+' / '+qs.length+' ('+pct+'%)</strong><br><br><strong>By topic</strong> (review any topic under 80%):<br>';
    Object.keys(by).forEach(t=>{ const [r,n]=by[t]; h+=t+': '+r+' / '+n+(r/n<0.8?' &nbsp;<span class="tag" style="color:var(--bad)">review</span>':'')+'<br>'; });
    h+='<br>Every question above now shows its explanation. Scroll up to see what you missed.';
    res.style.display='block'; res.innerHTML=h; el.querySelector('[data-submit]').disabled=true;
    if(opts.onSubmit) opts.onSubmit(right,qs.length,by);
    score(); res.scrollIntoView({behavior:'smooth',block:'center'});
  }
  draw();
}
window.renderMCQ=renderMCQ;

/* ===== FRQ =====
   frqs: [{type, stem, parts:[{p, guide}]}]; answers saved per browser. */
function renderFRQ(el, frqs, key){
  let h='';
  frqs.forEach((f,i)=>{
    h+='<div class="frq"><span class="ftype">'+f.type+'</span><div class="fstem">'+f.stem+'</div>';
    f.parts.forEach((p,j)=>{
      const id=key+'-'+i+'-'+j;
      h+='<div class="fpart"><div class="pq"><b>'+LETTERS[j]+'.</b> '+p.p+'</div>'
        +'<textarea data-k="'+id+'" placeholder="Write your answer here, then check it against the scoring guide."></textarea>'
        +'<button class="show-ans-btn" data-g="'+id+'">Show scoring guide</button>'
        +'<div class="guide" id="g-'+id+'">'+p.guide+'</div></div>';
    });
    h+='</div>';
  });
  el.innerHTML=h;
  el.querySelectorAll('textarea').forEach(t=>{
    try{ t.value=localStorage.getItem('nutri-frq-'+t.dataset.k)||''; }catch(e){}
    t.addEventListener('input',()=>{ try{ localStorage.setItem('nutri-frq-'+t.dataset.k,t.value); }catch(e){} });
  });
  el.querySelectorAll('[data-g]').forEach(b=>{ b.onclick=()=>{ const g=document.getElementById('g-'+b.dataset.g); g.classList.toggle('show'); b.textContent=g.classList.contains('show')?'Hide scoring guide':'Show scoring guide'; }; });
}
window.renderFRQ=renderFRQ;

/* ===== Sorter =====
   items: [{t, bin}]; bins: [names]. Click a chip, then click a bin. */
function makeSorter(el, items, bins){
  const order=items.map((x,i)=>i).sort(()=>Math.random()-0.5);
  let sel=-1, right=0, placed=0;
  let h='<div class="sort-pool" data-pool>';
  order.forEach(i=>{ h+='<button class="chip" data-i="'+i+'">'+items[i].t+'</button>'; });
  h+='</div><div class="bins">';
  bins.forEach((b,k)=>{ h+='<div class="bin" data-b="'+k+'"><h5>'+b+'</h5></div>'; });
  h+='</div><div class="readout" data-out>Click a card, then click the box it belongs in.</div>';
  el.innerHTML=h;
  const out=el.querySelector('[data-out]');
  el.querySelectorAll('[data-pool] .chip').forEach(c=>{ c.onclick=()=>{
    el.querySelectorAll('[data-pool] .chip').forEach(x=>x.classList.remove('sel'));
    c.classList.add('sel'); sel=+c.dataset.i;
  }; });
  el.querySelectorAll('.bin').forEach(b=>{ b.onclick=()=>{
    if(sel<0) return;
    const chip=el.querySelector('[data-pool] .chip[data-i="'+sel+'"]'); if(!chip) return;
    const ok=items[sel].bin===+b.dataset.b;
    chip.classList.remove('sel'); chip.classList.add(ok?'ok':'no'); chip.onclick=null;
    b.appendChild(chip); placed++; if(ok) right++;
    out.innerHTML=(ok?'<strong>Yes.</strong> ':'<strong>Not that one.</strong> It belongs in <em>'+bins[items[sel].bin]+'</em>. ')+(items[sel].why||'')
      +'<br><span style="color:var(--slate)">'+right+' of '+placed+' correct so far, '+(items.length-placed)+' left.</span>';
    sel=-1;
  }; });
}
window.makeSorter=makeSorter;

/* ===== Recall (fill in the blank) =====
   items: ['Text with [[answer|alt answer]] blanks', ...]. Typing is checked loosely
   (case, spaces, punctuation ignored). Reveal shows the answer key. */
function normAns(s){ return String(s).toLowerCase().replace(/[^a-z0-9.\/%-]/g,'').replace(/^-+|-+$/g,''); }
function renderCloze(el, items){
  let h='<div class="quiz-head"><span class="score" data-score></span><span class="btn-row" style="margin:0"><button class="site-btn" data-check>Check</button><button class="site-btn secondary" data-reveal>Reveal All</button><button class="site-btn secondary" data-clear>Clear</button></span></div><ol class="cloze-list">';
  items.forEach(t=>{
    h+='<li>'+t.replace(/\[\[(.+?)\]\]/g,(m,a)=>{ const alts=a.split('|'); const w=Math.max(4,Math.min(16,alts[0].length+1));
      return '<input class="blank" data-a="'+alts.map(x=>x.replace(/"/g,'&quot;')).join('|')+'" style="width:'+w+'ch" autocomplete="off" spellcheck="false" aria-label="blank">'; })+'</li>';
  });
  h+='</ol>';
  el.innerHTML=h;
  const inputs=Array.from(el.querySelectorAll('.blank')), sc=el.querySelector('[data-score]');
  function ok(inp){ const v=normAns(inp.value); return v && inp.dataset.a.split('|').some(a=>normAns(a)===v); }
  function upd(){ const right=inputs.filter(i=>i.classList.contains('ok')).length; sc.textContent=right+' of '+inputs.length+' blanks correct'; }
  function check(){ inputs.forEach(i=>{ i.classList.remove('ok','no'); if(i.value.trim()) i.classList.add(ok(i)?'ok':'no'); }); upd(); }
  inputs.forEach((i,k)=>{
    i.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); i.classList.remove('ok','no'); if(i.value.trim()) i.classList.add(ok(i)?'ok':'no'); upd(); const n=inputs[k+1]; if(n) n.focus(); } });
    i.addEventListener('input',()=>i.classList.remove('ok','no','shown'));
  });
  el.querySelector('[data-check]').onclick=check;
  el.querySelector('[data-reveal]').onclick=()=>{ inputs.forEach(i=>{ if(!ok(i)){ i.value=i.dataset.a.split('|')[0]; i.classList.remove('ok','no'); i.classList.add('shown'); } }); upd(); };
  el.querySelector('[data-clear]').onclick=()=>{ inputs.forEach(i=>{ i.value=''; i.classList.remove('ok','no','shown'); }); upd(); };
  upd();
}
window.renderCloze=renderCloze;

/* ===== Spaced repetition (SRS) =====
   cards: [{id, ch, sec, kind:'Term'|'Fact'|'Number', f, b, m?}]  (m = memory hook)
   One shared store across every page, so cards studied on a chapter page count on the review page. */
const SRS_KEY='nutri-srs-v1', DAY=86400000;
function srsLoad(){ try{ return JSON.parse(localStorage.getItem(SRS_KEY))||{}; }catch(e){ return {}; } }
function srsSave(s){ try{ localStorage.setItem(SRS_KEY,JSON.stringify(s)); }catch(e){} }
function srsToday(){ const d=new Date(); d.setHours(0,0,0,0); return d.getTime(); }
function srsNext(c,g){ let ease=c?c.ease:2.5, iv=c?c.iv:0;
  if(g===0) return {iv:0,ease:Math.max(1.3,ease-.2)};
  if(g===1) return {iv:iv?Math.max(1,Math.round(iv*1.2)):1,ease:Math.max(1.3,ease-.15)};
  if(g===2) return {iv:iv?Math.max(iv+1,Math.round(iv*ease)):1,ease};
  return {iv:iv?Math.max(iv+2,Math.round(iv*ease*1.3)):4,ease:ease+.15}; }
function ivLabel(n){ return n===0?'10 min':n===1?'1 day':n<30?n+' days':Math.round(n/30)+' mo'; }
function srsStats(cards){ const s=srsLoad(), now=Date.now(); let due=0,fresh=0,learned=0,seen=0;
  cards.forEach(c=>{ const r=s[c.id]; if(!r){fresh++;return;} seen++; if(r.due<=now) due++; if(r.iv>=4) learned++; });
  return {due,fresh,learned,seen,total:cards.length}; }
window.srsStats=srsStats;

function renderSRS(el, all, opts){
  opts=opts||{}; const NEW_CAP=opts.newCap||20;
  let chFilter=opts.chapters||null, cram=false, cramQ=[], cur=null, shown=false, sessionNew=0, sessionDone=0;
  function pool(){ return all.filter(c=>!chFilter||chFilter.includes(c.ch)); }
  function pick(){
    const s=srsLoad(), now=Date.now(), P=pool();
    if(cram){ return cramQ.length?cramQ[0]:null; }
    const due=P.filter(c=>s[c.id]&&s[c.id].due<=now).sort((a,b)=>s[a.id].due-s[b.id].due);
    if(due.length) return due[0];
    if(sessionNew<NEW_CAP){ const n=P.find(c=>!s[c.id]); if(n) return n; }
    return null;
  }
  function startCram(){ cramQ=pool().slice().sort(()=>Math.random()-.5); cram=true; cur=null; draw(); }
  function draw(){
    const P=pool(), st=srsStats(P); cur=cur||pick(); const s=srsLoad();
    let h='<div class="srs-top"><span class="chip-s">'+st.due+' due</span><span class="chip-s">'+st.fresh+' new</span><span class="chip-s">'+st.learned+' / '+st.total+' learned</span>'
      +(cram?'<span class="chip-s warn">Cram: '+cramQ.length+' left</span>':'')+'</div>';
    if(opts.filterable){
      h+='<div class="pick-row srs-filter">';
      [[null,'All Chapters'],[[13],'Ch 13 Weight'],[[14],'Ch 14 Eating Disorders'],[[15],'Ch 15 Sports']].forEach(([f,l],k)=>{
        const on=JSON.stringify(f)===JSON.stringify(chFilter); h+='<button class="pick-btn'+(on?' active':'')+'" data-f="'+k+'">'+l+'</button>'; });
      h+='</div>';
    }
    if(!cur){
      h+='<div class="srs-card done"><h4>'+(cram?'Cram round finished.':'Nothing due right now.')+'</h4><p class="body-text">'
        +(cram?'You went through every card in this set once. Ratings in cram mode still update the schedule.':(st.fresh?'You hit today\'s limit of '+NEW_CAP+' new cards. Come back tomorrow, or study more now.':'Every card here is scheduled for a later day. Come back when they are due.'))
        +'</p><div class="btn-row">'+(!cram&&st.fresh?'<button class="site-btn" data-more>Study 10 More New Cards</button>':'')+'<button class="site-btn secondary" data-cram>Cram Every Card (Night Before the Exam)</button></div></div>';
    } else {
      const r=s[cur.id];
      h+='<div class="srs-card"><div class="srs-meta"><span class="tag">'+cur.kind+'</span> <span>Ch '+cur.ch+' &middot; '+cur.sec+'</span>'+(r?'':' <span class="tag" style="color:var(--pb)">new</span>')+'</div>'
        +'<div class="srs-front">'+cur.f+'</div>';
      if(shown){
        h+='<div class="srs-back">'+cur.b+'</div>'+(cur.m?'<div class="srs-hook"><strong>Memory hook:</strong> '+cur.m+'</div>':'');
        h+='<div class="srs-rate">';
        ['Again','Hard','Good','Easy'].forEach((l,g)=>{ h+='<button class="rate r'+g+'" data-g="'+g+'"><b>'+l+'</b><small>'+ivLabel(srsNext(r,g).iv)+'</small></button>'; });
        h+='</div><div class="srs-keys">Keys: 1 Again, 2 Hard, 3 Good, 4 Easy</div>';
      } else {
        h+='<div class="btn-row"><button class="site-btn" data-show>Show Answer</button></div><div class="srs-keys">Say the answer out loud first. Space bar shows it.</div>';
      }
      h+='</div>';
    }
    h+='<div class="btn-row" style="margin-top:12px">'+(cram?'<button class="site-btn secondary" data-endcram>End Cram</button>':'')+'<button class="site-btn secondary" data-reset>Reset Progress</button></div>';
    el.innerHTML=h;
    const q=sel=>el.querySelector(sel);
    if(q('[data-show]')) q('[data-show]').onclick=()=>{ shown=true; draw(); };
    el.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>rate(+b.dataset.g));
    el.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{ chFilter=[null,[13],[14],[15]][+b.dataset.f]; cur=null; shown=false; if(cram) startCram(); else draw(); });
    if(q('[data-more]')) q('[data-more]').onclick=()=>{ sessionNew=Math.max(0,sessionNew-10); cur=null; draw(); };
    if(q('[data-cram]')) q('[data-cram]').onclick=startCram;
    if(q('[data-endcram]')) q('[data-endcram]').onclick=()=>{ cram=false; cur=null; shown=false; draw(); };
    const rs=q('[data-reset]'); let armed=false;
    rs.onclick=()=>{ if(!armed){ armed=true; rs.textContent='Click Again to Erase SRS Progress'; return; }
      const s2=srsLoad(); pool().forEach(c=>delete s2[c.id]); srsSave(s2); cur=null; shown=false; sessionNew=0; draw(); };
    if(opts.onChange) opts.onChange();
  }
  function rate(g){
    const s=srsLoad(), r=s[cur.id], n=srsNext(r,g);
    if(!r) sessionNew++;
    s[cur.id]={iv:n.iv,ease:n.ease,reps:(r?r.reps:0)+1,lapses:(r?r.lapses:0)+(g===0?1:0),due:n.iv===0?Date.now()+6e5:srsToday()+n.iv*DAY};
    srsSave(s); sessionDone++;
    if(cram){ const c=cramQ.shift(); if(g===0) cramQ.splice(Math.min(cramQ.length,4),0,c); }
    cur=null; shown=false; draw();
  }
  el.tabIndex=0;
  document.addEventListener('keydown',e=>{
    if(!el.isConnected||el.offsetParent===null||/INPUT|TEXTAREA/.test((e.target.tagName||''))) return;
    const r=el.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight) return;
    if(e.key===' '&&cur&&!shown){ e.preventDefault(); shown=true; draw(); }
    else if(shown&&cur&&'1234'.includes(e.key)) rate(+e.key-1);
  });
  draw();
}
window.renderSRS=renderSRS;

/* ===== Exam readiness store ===== */
const EXAM_KEY='nutri-exam-v1';
function examLoad(){ try{ return JSON.parse(localStorage.getItem(EXAM_KEY))||[]; }catch(e){ return []; } }
function examSave(rec){ const a=examLoad(); a.push(rec); try{ localStorage.setItem(EXAM_KEY,JSON.stringify(a.slice(-20))); }catch(e){} }
window.examLoad=examLoad; window.examSave=examSave;
