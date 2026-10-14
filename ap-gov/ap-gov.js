/* Shared shell + practice engines for the AP Gov course pages. */
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
    try{ t.value=localStorage.getItem('apgov-frq-'+t.dataset.k)||''; }catch(e){}
    t.addEventListener('input',()=>{ try{ localStorage.setItem('apgov-frq-'+t.dataset.k,t.value); }catch(e){} });
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
