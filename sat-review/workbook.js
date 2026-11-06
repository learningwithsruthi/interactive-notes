(function(){
'use strict';
const L=window.LWS||{};
['twins','lessons','challenge','practice','mastery','grammarGuide','grammarWalk','grammarQs','vocab'].forEach(k=>{L[k]=L[k]||[]});
const KEY='lws-sat-workbook-v1';
let S={done:{},quiz:{},mastery:null,srs:{},srsDay:{},theme:'light',cur:{}};
try{const raw=localStorage.getItem(KEY);if(raw)S=Object.assign(S,JSON.parse(raw))}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function fmt(s){if(s==null)return'';
  return String(s).split(/(\$[^$]+\$)/g).map(p=>{
    if(p.length>2&&p[0]==='$'&&p[p.length-1]==='$'){
      try{return katex.renderToString(p.slice(1,-1),{throwOnError:false})}catch(e){return esc(p)}
    }
    return p.replace(/¤/g,'$');
  }).join('');}
function hash(s){let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h}
function shuffle(arr,seed){const a=arr.map((v,i)=>({v,i}));let x=hash(seed)||1;
  for(let i=a.length-1;i>0;i--){x=(x*1664525+1013904223)>>>0;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function parseNum(v){let s=String(v).trim().replace(/[−–]/g,'-').replace(/[,\s$%°]/g,'');
  if(!s)return NaN;
  let m=s.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/);if(m)return parseFloat(m[1])/parseFloat(m[2]);
  return /^-?\d*\.?\d+$/.test(s)?parseFloat(s):NaN}
function numOk(val,step){const a=parseNum(val),b=parseNum(step.answer);if(isNaN(a))return false;
  const tol=step.tol!=null?step.tol:(String(step.answer).includes('/')?0.002:1e-9);return Math.abs(a-b)<=tol}
function norm(s){return String(s).toLowerCase().replace(/[^a-z0-9/.\-]/g,'')}
function textOk(val,step){const v=norm(val);return v!==''&&(step.answers||[]).some(a=>norm(a)===v)}
let streak=0;function bump(ok){streak=ok?streak+1:0;const el=$('#streak');if(el)el.textContent='Streak '+streak}
let ticker=null;function stopTimer(){if(ticker){clearInterval(ticker);ticker=null}}
function startTimer(el){stopTimer();const t0=Date.now();const tick=()=>{if(!el.isConnected){stopTimer();return}const s=Math.floor((Date.now()-t0)/1000);el.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+(s>=90?' Flag it and move on':'');el.classList.toggle('over',s>=90)};tick();ticker=setInterval(tick,1000)}

/* ---------- Step-by-step problem ---------- */
const run={};
function stepper(host,p,opts){opts=opts||{};
  const st=run[p.id]||(run[p.id]={i:0,steps:p.steps.map(()=>({tries:0,solved:false,shown:false,val:'',wrong:[],pts:[]})),finished:false});
  function draw(focus){
    const n=p.steps.length;
    let h=`<div class="head-row"><div><h2>${fmt(p.title)}</h2></div><div>${p.skill?`<span class="chip">${esc(p.skill)}</span> `:''}${p.level?`<span class="chip ${p.level}">${cap(p.level)}</span>`:''}</div></div>`;
    h+=`<div class="stem">${fmt(p.stem)}</div>`;
    if(p.diagram)h+=`<div class="dia">${p.diagram}</div>`;
    h+=`<div class="dots">${p.steps.map((_,k)=>`<i class="${st.steps[k].solved&&(k<st.i||st.finished)?'done':k===st.i&&!st.finished?'cur':''}"></i>`).join('')}</div>`;
    for(let k=0;k<=Math.min(st.i,n-1);k++)h+=stepHtml(k);
    if(st.finished){
      const first=st.steps.filter(s=>s.solved&&s.tries===0&&!s.shown).length;
      h+=`<div class="take"><h3>Remember This</h3>${fmt(p.takeaway||'')}${p.trap?`<p style="margin:8px 0 0"><strong>The trap:</strong> ${fmt(p.trap)}</p>`:''}<p class="small muted" style="margin:8px 0 0">${first} of ${n} steps right on the first try.</p></div>
      <div class="actions"><button class="btn" data-a="nextp" type="button">${opts.nextLabel||'Next Problem'}</button><button class="btn alt" data-a="again" type="button">Do It Again</button></div>`;
    }
    host.innerHTML=h;
    if(focus){const inp=$('.step.cur input',host);if(inp)inp.focus({preventScroll:true});
      const cur=$('.step.cur',host)||$('.take',host);if(cur&&focus==='scroll')cur.scrollIntoView({block:'nearest',behavior:'smooth'})}
    wire();
  }
  function stepHtml(k){const s=p.steps[k],t=st.steps[k],cur=k===st.i&&!t.solved&&!st.finished,lastDone=k===st.i&&t.solved&&!st.finished;
    let h=`<div class="step ${t.solved?'done':'cur'}" data-k="${k}"><div class="step-n">Step ${k+1} of ${p.steps.length}</div><div class="say">${fmt(s.say)}</div>`;
    if(s.type==='mc'){const ch=shuffle(s.choices,p.id+k);
      h+=`<div class="choices">`+ch.map((c,idx)=>{const isOk=c.i===0,cl=t.solved&&isOk?'ok':t.wrong.includes(c.i)?'no':'';
        return `<button class="ch ${cl}" data-c="${c.i}" type="button" ${t.solved||t.wrong.includes(c.i)?'disabled':''}><b>${'ABCD'[idx]}</b><span>${fmt(c.v)}</span></button>`}).join('')+`</div>`;
    }else if(s.type==='plot'){h+=plotSvg(s,t);
    }else{
      if(t.solved){const shownAns=s.type==='num'?s.answer:(s.answers||[''])[0];h+=`<div class="fill">${s.prefix?fmt(s.prefix):''} <strong>${esc(t.shown?shownAns:t.val)}</strong></div>`}
      else h+=`<div class="fill">${s.prefix?`<span>${fmt(s.prefix)}</span>`:''}<input data-in type="text" inputmode="${s.type==='num'?'text':'text'}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer" value="${esc(t.val)}"><button class="btn" data-a="check" type="button">Check</button></div>`;
    }
    if(cur&&t.tries>0&&s.hint)h+=`<div class="fb no"><strong>Not yet.</strong> ${fmt(s.hint)}</div>`;
    else if(cur&&t.tries>0)h+=`<div class="fb no"><strong>Not yet.</strong> Try again.</div>`;
    if(t.solved)h+=`<div class="fb ${t.shown?'info':'ok'}">${t.shown?'<strong>Answer shown.</strong> ':t.tries===0?'<strong>Yes.</strong> ':'<strong>There it is.</strong> '}${fmt(s.after||'')}</div>`;
    if(cur)h+=`<div class="actions">${t.tries>=1?`<button class="link" data-a="show" type="button">Show the Answer</button>`:''}</div>`;
    if(lastDone)h+=`<div class="actions"><button class="btn" data-a="next" type="button">${k===p.steps.length-1?'Finish':'Next'}</button></div>`;
    return h+'</div>';
  }
  function wire(){
    const curEl=$('.step.cur',host);
    $$('[data-a]',host).forEach(b=>b.addEventListener('click',()=>act(b.dataset.a)));
    if(curEl){$$('.ch',curEl).forEach(b=>b.addEventListener('click',()=>{const t=st.steps[st.i];const c=+b.dataset.c;
        if(c===0){solve(t)}else{t.wrong.push(c);t.tries++;bump(false);draw()}}));
      const inp=$('input[data-in]',curEl);
      if(inp){inp.addEventListener('input',()=>{st.steps[st.i].val=inp.value});inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();act('check')}})}
      const svg=$('svg.plot',curEl);if(svg)wirePlot(svg)}
    const nx=$('[data-a=next]',host);if(nx)nx.focus({preventScroll:true});
  }
  function solve(t){t.solved=true;bump(t.tries===0&&!t.shown);draw();const n=$('[data-a=next]',host);if(n)n.scrollIntoView({block:'nearest',behavior:'smooth'})}
  function act(a){const s=p.steps[st.i],t=st.steps[st.i];
    if(a==='check'){const v=t.val;if(!String(v).trim())return;
      const ok=s.type==='num'?numOk(v,s):textOk(v,s);
      if(ok)solve(t);else{t.tries++;bump(false);draw(true)}}
    else if(a==='show'){t.shown=true;t.solved=true;bump(false);draw()}
    else if(a==='next'){if(st.i===p.steps.length-1){st.finished=true;const first=st.steps.filter(x=>x.tries===0&&!x.shown).length;S.done[p.id]={first,total:p.steps.length};save();draw('scroll');if(opts.onDone)opts.onDone()}
      else{st.i++;draw('scroll')}}
    else if(a==='again'){delete run[p.id];stepper(host,p,opts)}
    else if(a==='nextp'){if(opts.onNext)opts.onNext()}
  }
  function plotSvg(s,t){const X=s.xmax||10,Y=s.ymax||10,W=420,c=W/(2*X+2),sx=x=>W/2+x*c,sy=y=>W/2-y*(W/(2*Y+2));
    const cy=W/(2*Y+2);let g='';
    for(let i=-X;i<=X;i++)g+=`<line x1="${sx(i)}" y1="${sy(-Y)}" x2="${sx(i)}" y2="${sy(Y)}" stroke="currentColor" opacity="${i?0.16:0.9}" stroke-width="${i?1:1.6}"/>`;
    for(let i=-Y;i<=Y;i++)g+=`<line x1="${sx(-X)}" y1="${sy(i)}" x2="${sx(X)}" y2="${sy(i)}" stroke="currentColor" opacity="${i?0.16:0.9}" stroke-width="${i?1:1.6}"/>`;
    const step=X>12?5:X>6?2:1;
    for(let i=-X;i<=X;i++)if(i&&i%step===0)g+=`<text x="${sx(i)}" y="${sy(0)+15}" font-size="11" text-anchor="middle" fill="currentColor">${i}</text>`;
    for(let i=-Y;i<=Y;i++)if(i&&i%(Y>12?5:Y>6?2:1)===0)g+=`<text x="${sx(0)-6}" y="${sy(i)+4}" font-size="11" text-anchor="end" fill="currentColor">${i}</text>`;
    let line='';
    if(t.solved){const xi=s.c/s.a,yi=s.c/s.b,m=-s.a/s.b;
      const pts=[[-X,yi+m*-X],[X,yi+m*X]];line=`<line x1="${sx(pts[0][0])}" y1="${sy(pts[0][1])}" x2="${sx(pts[1][0])}" y2="${sy(pts[1][1])}" style="stroke:var(--accent)" stroke-width="2.5"/><circle cx="${sx(xi)}" cy="${sy(0)}" r="6" style="fill:var(--good)"/><circle cx="${sx(0)}" cy="${sy(yi)}" r="6" style="fill:var(--good)"/>`}
    const dots=t.solved?'':t.pts.map(p=>`<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="6" style="fill:var(--accent2)"/>`).join('');
    return `<svg class="plot" viewBox="0 0 ${W} ${W}" style="display:block;max-width:420px;width:100%;margin:6px auto;touch-action:manipulation;cursor:crosshair;color:inherit" data-x="${X}" data-y="${Y}" role="img" aria-label="Coordinate grid. Click both intercepts."><clipPath id="pc"><rect width="${W}" height="${W}"/></clipPath><g clip-path="url(#pc)">${g}${line}${dots}</g></svg>`}
  function wirePlot(svg){svg.addEventListener('click',e=>{const s=p.steps[st.i],t=st.steps[st.i];const r=svg.getBoundingClientRect();const X=+svg.dataset.x,Y=+svg.dataset.y;
      const px=(e.clientX-r.left)/r.width*420,py=(e.clientY-r.top)/r.height*420;
      const x=Math.round((px-210)/(420/(2*X+2))),y=Math.round((210-py)/(420/(2*Y+2)));
      if(Math.abs(x)>X||Math.abs(y)>Y)return;
      const ix=t.pts.findIndex(q=>q[0]===x&&q[1]===y);if(ix>=0)t.pts.splice(ix,1);else t.pts.push([x,y]);
      if(t.pts.length>=2){const xi=s.c/s.a,yi=s.c/s.b;
        const ok=t.pts.some(q=>q[0]===xi&&q[1]===0)&&t.pts.some(q=>q[0]===0&&q[1]===yi);
        if(ok){solve(t);return}t.tries++;t.pts=[];bump(false)}
      draw()})}
  draw();
}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}

/* ---------- Generic list + detail ---------- */
function isDone(id){return !!S.done[id]}
function listView(root,items,key,detail,opt){opt=opt||{};
  let idx=Math.max(0,items.findIndex(x=>x.id===(S.cur[key])));
  root.innerHTML=(opt.intro||'')+`<select class="pick" aria-label="Choose an item"></select><div class="split"><div class="side"></div><div id="dt" style="min-width:0"></div></div>`;
  const side=$('.side',root),pick=$('.pick',root),dt=$('#dt',root);
  function mark(it){const ok=opt.isDone?opt.isDone(it):isDone(it.id);return ok}
  function nav(){side.innerHTML=items.map((it,i)=>`<button type="button" data-i="${i}" class="${i===idx?'cur':''}"><span class="mark ${mark(it)?'ok':''}">${mark(it)?'&#10003;':''}</span><span>${i+1}. ${esc(plain(it.title))}</span></button>`).join('');
    pick.innerHTML=items.map((it,i)=>`<option value="${i}" ${i===idx?'selected':''}>${mark(it)?'[done] ':''}${i+1}. ${esc(plain(it.title))}</option>`).join('');
    $$('button',side).forEach(b=>b.addEventListener('click',()=>go(+b.dataset.i)))}
  function go(i){idx=(i+items.length)%items.length;S.cur[key]=items[idx].id;save();nav();detail(dt,items[idx],{refresh:nav,next:()=>{go(idx+1);window.scrollTo({top:0,behavior:'smooth'})},i:idx,n:items.length});}
  pick.addEventListener('change',()=>go(+pick.value));
  if(!items.length){dt.innerHTML='<div class="card">Content is loading.</div>';return}
  go(idx);
}
function plain(s){return String(s).replace(/\$/g,'')}
function problemDetail(dt,p,c){dt.innerHTML='<div class="card" id="pc"></div>';stepper($('#pc',dt),p,{onDone:c.refresh,onNext:c.next})}

/* ---------- Quiz with timer ---------- */
function quizView(root,bank,key,o){o=o||{};
  S.quiz[key]=S.quiz[key]||{};const res=S.quiz[key];
  const topics=[...new Set(bank.map(q=>q.topic))];
  let f={topic:'All',level:'All',missed:false},list=bank,i=0,sel=null,answered=null;
  function apply(){list=bank.filter(q=>(f.topic==='All'||q.topic===f.topic)&&(f.level==='All'||q.level===f.level)&&(!f.missed||res[q.id]===false));i=0;answered=null;sel=null;draw()}
  function draw(){stopTimer();
    const ok=bank.filter(q=>res[q.id]===true).length,tried=bank.filter(q=>res[q.id]!=null).length;
    const levels=[...new Set(bank.map(q=>q.level))];
    let h=`<div class="card"><div class="head-row"><h2>${esc(o.title||'Practice')}</h2><span class="chip">${ok} right of ${tried} tried, ${bank.length} total</span></div><p class="muted small">${o.note||''}</p>
    <div class="seg" data-g="topic">${['All',...topics].map(t=>`<button type="button" class="ghost ${f.topic===t?'on':''}" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    <div class="seg">${['All',...levels].map(t=>`<button type="button" class="ghost lv ${f.level===t?'on':''}" data-v="${t}">${cap(t)}</button>`).join('')}<button type="button" class="ghost ms ${f.missed?'on':''}">Missed Only</button></div>
    <div class="nums">${list.map((q,k)=>`<button type="button" data-k="${k}" class="${res[q.id]===true?'ok':res[q.id]===false?'no':''} ${k===i?'cur':''}" aria-label="Question ${k+1}">${k+1}</button>`).join('')}</div></div>`;
    if(!list.length){h+=`<div class="card">Nothing here yet. Change the filters above.</div>`;root.innerHTML=h;wireF();return}
    const q=list[i];
    h+=`<div class="card"><div class="head-row"><span class="chip">${esc(q.topic)}</span><span><span class="chip ${q.level}">${cap(q.level)}</span> <span class="chip timer"></span></span></div><div class="stem">${fmt(q.stem)}</div>${q.diagram?`<div class="dia">${q.diagram}</div>`:''}`;
    h+=answerHtml(q,answered,sel);
    if(answered!=null)h+=`<div class="fb ${answered?'ok':'no'}"><strong>${answered?'Correct.':'Not this time.'}</strong> ${fmt(q.explain||'')}</div><div class="actions"><button class="btn" data-q="next" type="button">Next Question</button></div>`;
    h+='</div>';root.innerHTML=h;wireF();
    if(answered==null){const t=$('.timer',root);if(t)startTimer(t)}else{const t=$('.timer',root);if(t)t.style.display='none'}
    $$('.ch',root).forEach(b=>b.addEventListener('click',()=>{sel=+b.dataset.c;grade(q,sel===0)}));
    const inp=$('input[data-in]',root);if(inp){const go=()=>{if(inp.value.trim()){sel=inp.value;grade(q,numOk(inp.value,q))}};inp.addEventListener('keydown',e=>{if(e.key==='Enter')go()});$('[data-q=check]',root).addEventListener('click',go)}
    const nx=$('[data-q=next]',root);if(nx){nx.addEventListener('click',()=>{i=(i+1)%list.length;answered=null;sel=null;draw();window.scrollTo({top:0})});nx.focus({preventScroll:true})}
  }
  function grade(q,ok){res[q.id]=ok;answered=ok;bump(ok);save();draw()}
  function wireF(){$$('[data-g=topic] button',root).forEach(b=>b.addEventListener('click',()=>{f.topic=b.dataset.v;apply()}));
    $$('.lv',root).forEach(b=>b.addEventListener('click',()=>{f.level=b.dataset.v;apply()}));
    const m=$('.ms',root);if(m)m.addEventListener('click',()=>{f.missed=!f.missed;apply()});
    $$('.nums button',root).forEach(b=>b.addEventListener('click',()=>{i=+b.dataset.k;answered=null;sel=null;draw()}))}
  draw();
}
function answerHtml(q,answered,sel){
  if(q.type==='mc'||q.choices){const ch=shuffle(q.choices,q.id);return `<div class="choices">`+ch.map((c,idx)=>{let cl='';if(answered!=null){if(c.i===0)cl='ok';else if(sel===c.i)cl='no'}else if(sel===c.i)cl='sel';
      return `<button class="ch ${cl}" data-c="${c.i}" type="button" ${answered!=null?'disabled':''}><b>${'ABCD'[idx]}</b><span>${fmt(c.v)}</span></button>`}).join('')+`</div>`}
  if(answered!=null)return `<div class="fill" style="margin-top:8px">Your answer: <strong>${esc(sel)}</strong>${answered?'':` &nbsp; Correct answer: <strong>${esc(q.answer)}</strong>`}</div>`;
  return `<div class="fill" style="margin-top:8px"><input data-in type="text" autocomplete="off" aria-label="Your answer"><button class="btn" data-q="check" type="button">Check</button></div>`;
}

/* ---------- Mastery check ---------- */
const FORM={spot:'Spot the Error',trap:'Trap or Truth',translate:'Translate It',solve:'Solve It'};
function masteryView(root){
  const bank=L.mastery;let i=0,log=[],conf=null,sel=null,answered=null;
  function intro(){stopTimer();const m=S.mastery;
    root.innerHTML=`<div class="card"><h2>Mastery Check</h2><p>${bank.length} questions across your weak spots. Before each answer you say how sure you are. On your report, 30 of 44 math answers were rated Unsure and only 3 Solid. This check measures the thing that moves your score: knowing that you know.</p>
    <div class="grid2"><div class="idea"><strong>Spot the Error</strong><br>Find the line where a solution goes wrong.</div><div class="idea"><strong>Trap or Truth</strong><br>Decide whether the tempting answer holds up.</div><div class="idea"><strong>Translate It</strong><br>Match the sentence to the equation.</div><div class="idea"><strong>Solve It</strong><br>Just the math, with the 90-second clock.</div></div>
    <div class="actions"><button class="btn" id="go" type="button">${m?'Take It Again':'Start the Check'}</button></div></div>${m?resultHtml(m):''}`;
    $('#go',root).addEventListener('click',()=>{i=0;log=[];next()})}
  function next(){conf=null;sel=null;answered=null;draw()}
  function draw(){stopTimer();const q=bank[i];
    let h=`<div class="card"><div class="head-row"><span class="chip">${FORM[q.form]||'Solve It'}: ${esc(q.topic)}</span><span><span class="chip">${i+1} of ${bank.length}</span> <span class="chip timer"></span></span></div>
    <div class="dots">${bank.map((_,k)=>`<i class="${k<i?'done':k===i?'cur':''}"></i>`).join('')}</div>
    <div class="stem" style="margin-top:10px">${fmt(q.stem)}</div>${q.diagram?`<div class="dia">${q.diagram}</div>`:''}`;
    h+=answerHtml(q,answered,sel);
    if(answered==null){h+=`<div class="conf"><strong>How sure are you?</strong>${[['guess','Guessing'],['unsure','Unsure'],['sure','Sure']].map(c=>`<button type="button" class="ghost cf ${conf===c[0]?'on':''}" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
      ${(q.type==='mc'||q.choices)?`<div class="actions"><button class="btn" id="lock" type="button" ${conf&&sel!=null?'':'disabled'}>Lock It In</button></div>`:''}`}
    else{h+=`<div class="fb ${answered?'ok':'no'}"><strong>${answered?'Correct.':'Not this time.'}</strong> ${fmt(q.explain||'')}</div><div class="actions"><button class="btn" id="nx" type="button">${i===bank.length-1?'See My Results':'Next'}</button></div>`}
    h+='</div>';root.innerHTML=h;
    if(answered==null&&!run['_t'+i]){}
    const t=$('.timer',root);if(answered==null)startTimer(t);else t.style.display='none';
    $$('.cf',root).forEach(b=>b.addEventListener('click',()=>{const inp=$('input[data-in]',root);if(inp)sel=inp.value;conf=b.dataset.v;$$('.cf',root).forEach(x=>x.classList.toggle('on',x===b));const l=$('#lock',root);if(l)l.disabled=!(conf&&sel!=null)}));
    $$('.ch',root).forEach(b=>b.addEventListener('click',()=>{sel=+b.dataset.c;$$('.ch',root).forEach(x=>x.classList.toggle('sel',x===b));const l=$('#lock',root);if(l)l.disabled=!(conf&&sel!=null)}));
    const lock=$('#lock',root);if(lock)lock.addEventListener('click',()=>grade(q,sel===0));
    const inp=$('input[data-in]',root);if(inp){if(typeof sel==='string')inp.value=sel;const b=$('[data-q=check]',root);const go=()=>{if(!inp.value.trim())return;sel=inp.value;if(!conf){b.textContent='Pick How Sure First';return}grade(q,numOk(inp.value,q))};b.addEventListener('click',go);inp.addEventListener('keydown',e=>{if(e.key==='Enter')go()})}
    const nx=$('#nx',root);if(nx){nx.focus({preventScroll:true});nx.addEventListener('click',()=>{i++;if(i>=bank.length)finish();else{next();window.scrollTo({top:0})}})}
  }
  function grade(q,ok){answered=ok;bump(ok);log.push({id:q.id,topic:q.topic,ok,conf});stopTimer();draw()}
  function finish(){S.mastery={log,at:Date.now()};save();intro();window.scrollTo({top:0})}
  function resultHtml(m){const c={solid:0,unsure:0,gap:0,blind:0},tp={};
    m.log.forEach(r=>{const sure=r.conf==='sure';c[r.ok?(sure?'solid':'unsure'):(sure?'blind':'gap')]++;tp[r.topic]=tp[r.topic]||{ok:0,n:0,solid:0};tp[r.topic].n++;if(r.ok)tp[r.topic].ok++;if(r.ok&&sure)tp[r.topic].solid++});
    const n=m.log.length,right=m.log.filter(r=>r.ok).length;
    const rows=Object.keys(tp).sort((a,b)=>tp[a].ok/tp[a].n-tp[b].ok/tp[b].n).map(k=>{const t=tp[k],p=t.ok/t.n;const verdict=p===1&&t.solid===t.n?'Mastered':p===1?'Right, not yet sure':p>=.5?'Almost':'Rebuild';
      return `<div class="prio" style="grid-template-columns:minmax(0,1fr) 110px auto"><div>${esc(k)}</div><div class="bar"><i class="${p<.7?'low':''}" style="width:${Math.round(p*100)}%"></i></div><span class="chip">${verdict}</span></div>`}).join('');
    return `<div class="card"><h2>Your Last Result: ${right} of ${n}</h2>
    <div class="grid2"><div><h3>How Sure vs How Right</h3><div class="quad">
      <div class="q-unsure"><strong>Unsure: ${c.unsure}</strong><br><span class="small">Right but not confident. Convert these.</span></div>
      <div class="q-solid"><strong>Solid: ${c.solid}</strong><br><span class="small">Right and sure. Real strengths.</span></div>
      <div class="q-gap"><strong>Knowledge Gaps: ${c.gap}</strong><br><span class="small">Wrong and you knew it. Go back to the lesson.</span></div>
      <div class="q-blind"><strong>Blind Spots: ${c.blind}</strong><br><span class="small">Wrong but sure. Fix these first.</span></div></div>
      <p class="small muted" style="margin-top:8px">Report baseline: Solid 3 of 44 (7%). This check: Solid ${c.solid} of ${n} (${Math.round(c.solid/n*100)}%).</p></div>
    <div><h3>By Skill</h3>${rows}</div></div></div>`}
  if(!bank.length){root.innerHTML='<div class="card">Content is loading.</div>';return}
  intro();
}

/* ---------- Widgets ---------- */
function sign(n){return n<0?`- ${-n}`:`+ ${n}`}
function term(c,v,first){if(c===0)return'';const abs=Math.abs(c),body=(abs===1&&v?'':abs)+v;return first?(c<0?'-':'')+body:(c<0?' - ':' + ')+body}
function frac(p,q){if(q<0){p=-p;q=-q}const g=(a,b)=>b?g(b,a%b):Math.abs(a);const d=g(p,q)||1;p/=d;q/=d;return q===1?String(p):`\\frac{${p}}{${q}}`}
function ctl(id,label,min,max,val,step){return `<label>${label} <input type="range" id="${id}" min="${min}" max="${max}" value="${val}" step="${step||1}"> <output id="${id}o"></output></label>`}
const WIDGETS={
numberline(el){el.innerHTML=`<h3>Try It: Why the Sign Flips</h3><div class="ctrls">${ctl('a','$a$'.replace(/\$/g,''),-6,6,-2)}${ctl('b','b',-10,10,3)}<label>sign <select id="op"><option>&lt;</option><option>&le;</option><option>&gt;</option><option>&ge;</option></select></label>${ctl('c','c',-10,10,9)}${ctl('t','test x',-10,10,0)}</div><div class="stage" id="s"></div><div class="out" id="o"></div>`;
  const R=()=>{let a=+$('#a',el).value;if(a===0){a=1;$('#a',el).value=1}const b=+$('#b',el).value,c=+$('#c',el).value,t=+$('#t',el).value,op=$('#op',el).value;
    ['a','b','c','t'].forEach(k=>$('#'+k+'o',el).textContent=$('#'+k,el).value);
    const tex={'<':'<','≤':'\\le','>':'>','≥':'\\ge'},flip={'<':'>','≤':'≥','>':'<','≥':'≤'};const nop=a<0?flip[op]:op,bd=(c-b)/a;
    const f=x=>op==='<'?x<c:op==='≤'?x<=c:op==='>'?x>c:x>=c,val=a*t+b,tv=f(val);
    const W=640,sx=x=>W/2+x*29;const right=nop==='>'||nop==='≥',closed=nop==='≤'||nop==='≥';const bx=Math.max(-10.5,Math.min(10.5,bd));
    let g=`<line x1="${sx(-10.7)}" y1="40" x2="${sx(10.7)}" y2="40" stroke="currentColor" stroke-width="2"/>`;for(let i=-10;i<=10;i++)g+=`<line x1="${sx(i)}" y1="34" x2="${sx(i)}" y2="46" stroke="currentColor"/><text x="${sx(i)}" y="64" font-size="13" text-anchor="middle" fill="currentColor">${i}</text>`;
    g+=`<line x1="${sx(bx)}" y1="40" x2="${sx(right?10.7:-10.7)}" y2="40" style="stroke:var(--accent)" stroke-width="6" opacity=".8"/><circle cx="${sx(bx)}" cy="40" r="8" stroke-width="3" style="stroke:var(--accent);fill:${closed?'var(--accent)':'var(--white)'}"/>`;
    g+=`<path d="M${sx(t)-7} 12 L${sx(t)+7} 12 L${sx(t)} 26 Z" style="fill:${tv?'var(--good)':'var(--accent2)'}"/>`;
    $('#s',el).innerHTML=`<svg viewBox="0 0 640 74" role="img" aria-label="Number line of the solution">${g}</svg>`;
    $('#o',el).innerHTML=fmt(`$${term(a,'x',true)}${b?(b<0?' - '+(-b):' + '+b):''} ${tex[op]} ${c}$ &nbsp; becomes &nbsp; $${term(a,'x',true)} ${tex[op]} ${c-b}$ &nbsp; becomes &nbsp; $x ${tex[nop]} ${frac(c-b,a)}$<br>`)+(a<0?`<strong>You divided by ${a}, a negative, so the sign flipped.</strong><br>`:'You divided by a positive, so the sign stays.<br>')+fmt(`Test $x=${t}$: $${a}(${t})${b<0?'-'+(-b):'+'+b}=${val}$, and $${val} ${tex[op]} ${c}$ is `)+`<strong>${tv?'true':'false'}</strong>. The test point is ${tv?'in':'outside'} the shaded part${tv===((nop==='<'&&t<bd)||(nop==='≤'&&t<=bd)||(nop==='>'&&t>bd)||(nop==='≥'&&t>=bd))?', so the solution checks out':''}.`};
  $$('input,select',el).forEach(x=>x.addEventListener('input',R));R()},
growth(el){el.innerHTML=`<h3>Try It: Build the Multiplier</h3><div class="ctrls">${ctl('p','start',50,1000,200,50)}${ctl('r','percent change',-50,50,8,1)}<label>every <select id="k"><option value="0.25">3 months</option><option value="0.5">6 months</option><option value="1" selected>1 year</option><option value="2">2 years</option><option value="5">5 years</option></select></label>${ctl('t','t (years)',0,12,6)}</div><div class="stage" id="s"></div><div class="out" id="o"></div>`;
  const R=()=>{const P=+$('#p',el).value,r=+$('#r',el).value,k=+$('#k',el).value,t=+$('#t',el).value;['p','r','t'].forEach(x=>$('#'+x+'o',el).textContent=$('#'+x,el).value+(x==='r'?'%':''));
    const m=1+r/100,f=x=>P*Math.pow(m,x/k),maxY=Math.max(f(0),f(12))*1.1||1;const sx=x=>50+x*48,sy=y=>230-y/maxY*210;
    let d='';for(let x=0;x<=12;x+=.1)d+=(x?'L':'M')+sx(x).toFixed(1)+' '+Math.max(4,sy(f(x))).toFixed(1);
    let g=`<line x1="50" y1="230" x2="626" y2="230" stroke="currentColor"/><line x1="50" y1="10" x2="50" y2="230" stroke="currentColor"/>`;for(let i=0;i<=12;i+=2)g+=`<text x="${sx(i)}" y="248" font-size="13" text-anchor="middle" fill="currentColor">${i}</text><line x1="${sx(i)}" y1="230" x2="${sx(i)}" y2="235" stroke="currentColor"/>`;
    g+=`<text x="44" y="${sy(P)+4}" font-size="12" text-anchor="end" fill="currentColor">${P}</text><text x="44" y="18" font-size="12" text-anchor="end" fill="currentColor">${Math.round(maxY)}</text>`;
    const v=f(t);g+=`<path d="${d}" fill="none" style="stroke:var(--accent)" stroke-width="3"/><circle cx="${sx(t)}" cy="${Math.max(4,sy(v))}" r="6" style="fill:var(--accent2)"/>`;
    $('#s',el).innerHTML=`<svg viewBox="0 0 640 256" role="img" aria-label="Growth curve">${g}</svg>`;
    const kl=k===1?'t':k===2?'t/2':k===5?'t/5':k===.5?'2t':'4t';
    $('#o',el).innerHTML=fmt(`${r>=0?'A':'A'} ${Math.abs(r)}% ${r>=0?'increase':'decrease'} means multiply by $1 ${r<0?'-':'+'} ${(Math.abs(r)/100).toFixed(2)} = ${m.toFixed(2)}$.<br>The change happens every ${k===1?'year':k===2?'2 years':k===5?'5 years':k===.5?'6 months':'3 months'}, so the exponent is $${kl}$: &nbsp; $A=${P}(${m.toFixed(2)})^{${kl}}$<br>At $t=${t}$: $A\\approx ${v.toFixed(1)}$`)};
  $$('input,select',el).forEach(x=>x.addEventListener('input',R));R()},
percent(el){el.innerHTML=`<h3>Try It: Percent Changes Do Not Add</h3><div class="ctrls">${ctl('s','start',50,400,200,10)}${ctl('c','first change',-60,60,25)}${ctl('e','second change',-60,60,-20)}</div><div class="stage" id="v"></div><div class="out" id="o"></div>`;
  const R=()=>{const s=+$('#s',el).value,a=+$('#c',el).value,b=+$('#e',el).value;$('#so',el).textContent=s;$('#co',el).textContent=a+'%';$('#eo',el).textContent=b+'%';
    const m1=1+a/100,m2=1+b/100,v1=s*m1,v2=v1*m2,mx=Math.max(s,v1,v2),sc=v=>v/mx*470;
    const bar=(y,v,l,st)=>`<text x="0" y="${y+18}" font-size="14" fill="currentColor">${l}</text><rect x="120" y="${y}" width="${sc(v)}" height="26" rx="5" style="fill:${st}"/><text x="${124+sc(v)}" y="${y+18}" font-size="14" fill="currentColor">${+v.toFixed(2)}</text>`;
    $('#v',el).innerHTML=`<svg viewBox="0 0 640 118" role="img" aria-label="Value after each change">${bar(4,s,'Start','var(--sage)')}${bar(44,v1,'After first','var(--accent2)')}${bar(84,v2,'After second','var(--accent)')}</svg>`;
    const net=(m1*m2-1)*100;
    $('#o',el).innerHTML=fmt(`Multipliers: $${s}\\times ${m1.toFixed(2)}\\times ${m2.toFixed(2)}=${+v2.toFixed(2)}$.<br>Adding the percents says ${a+b>=0?'+':''}${a+b}%. The real net change is `)+`<strong>${net>=0?'+':''}${net.toFixed(2)}%</strong>, because the second percent is taken of the new value.<br>`+fmt(`Working backward from the end: $${+v2.toFixed(2)}\\div(${m1.toFixed(2)}\\times ${m2.toFixed(2)})=${s}$. Divide by the multiplier. Never subtract the percent.`)};
  $$('input',el).forEach(x=>x.addEventListener('input',R));R()},
circle(el){el.innerHTML=`<h3>Try It: From General Form to Center and Radius</h3><div class="ctrls">${ctl('h','center x',-6,6,3)}${ctl('k','center y',-6,6,-2)}${ctl('r','radius',1,6,4)}</div><div class="stage" id="v"></div><div class="out" id="o"></div>`;
  const R=()=>{const h=+$('#h',el).value,k=+$('#k',el).value,r=+$('#r',el).value;['h','k','r'].forEach(x=>$('#'+x+'o',el).textContent=$('#'+x,el).value);
    const D=-2*h,E=-2*k,F=h*h+k*k-r*r,W=320,u=W/26,sx=x=>W/2+x*u,sy=y=>W/2-y*u;let g='';
    for(let i=-12;i<=12;i++){g+=`<line x1="${sx(i)}" y1="${sy(-12)}" x2="${sx(i)}" y2="${sy(12)}" stroke="currentColor" opacity="${i?.14:.85}"/><line x1="${sx(-12)}" y1="${sy(i)}" x2="${sx(12)}" y2="${sy(i)}" stroke="currentColor" opacity="${i?.14:.85}"/>`}
    g+=`<circle cx="${sx(h)}" cy="${sy(k)}" r="${r*u}" fill="none" style="stroke:var(--accent)" stroke-width="2.5"/><line x1="${sx(h)}" y1="${sy(k)}" x2="${sx(h+r)}" y2="${sy(k)}" style="stroke:var(--accent2)" stroke-width="2.5"/><circle cx="${sx(h)}" cy="${sy(k)}" r="4" style="fill:var(--accent2)"/>`;
    $('#v',el).innerHTML=`<svg viewBox="0 0 320 320" style="max-width:320px" role="img" aria-label="Circle on a grid">${g}</svg>`;
    const gen=`x^2 + y^2${term(D,'x')}${term(E,'y')}${F?(F<0?' - '+(-F):' + '+F):''} = 0`;
    const xp=h===0?'x^2':`(x ${h>0?'-':'+'} ${Math.abs(h)})^2`,yp=k===0?'y^2':`(y ${k>0?'-':'+'} ${Math.abs(k)})^2`;
    $('#o',el).innerHTML=fmt(`<strong>The test gives you:</strong> $${gen}$<br>1. Group and move the constant: $(x^2${term(D,'x')}) + (y^2${term(E,'y')}) = ${-F}$<br>2. Take half of each linear coefficient and square it: $(${D/2})^2=${h*h}$ and $(${E/2})^2=${k*k}$. Add both to each side.<br>3. Factor: $${xp} + ${yp} = ${-F} + ${h*h} + ${k*k} = ${r*r}$<br>4. Read it: center $(${h}, ${k})$, radius $\\sqrt{${r*r}}=${r}$.`)};
  $$('input',el).forEach(x=>x.addEventListener('input',R));R()},
trig(el){el.innerHTML=`<h3>Try It: Which Ratio?</h3><div class="ctrls">${ctl('a','angle A',10,80,37)}${ctl('h','hypotenuse',5,25,20)}</div><div class="stage" id="v"></div><div class="out" id="o"></div>`;
  const R=()=>{const a=+$('#a',el).value,H=+$('#h',el).value,t=a*Math.PI/180,O=H*Math.sin(t),A=H*Math.cos(t);$('#ao',el).textContent=a+'°';$('#ho',el).textContent=H;
    const sc=250/Math.max(A,O,1)*.9,x0=80,y0=250,xB=x0+A*sc,yC=y0-O*sc;
    $('#v',el).innerHTML=`<svg viewBox="0 0 560 280" role="img" aria-label="Right triangle"><path d="M${x0} ${y0} L${xB} ${y0} L${xB} ${yC} Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M${xB-13} ${y0} v-13 h13" fill="none" stroke="currentColor"/><text x="${x0-22}" y="${y0+6}" font-size="15" font-weight="700" fill="currentColor">A</text><text x="${xB+8}" y="${y0+6}" font-size="15" font-weight="700" fill="currentColor">C</text><text x="${xB+8}" y="${yC+6}" font-size="15" font-weight="700" fill="currentColor">B</text><text x="${(x0+xB)/2}" y="${y0+22}" font-size="14" text-anchor="middle" style="fill:var(--accent2)">adjacent ${A.toFixed(2)}</text><text x="${xB+8}" y="${(y0+yC)/2+5}" font-size="14" style="fill:var(--accent)">opposite ${O.toFixed(2)}</text><text x="${(x0+xB)/2-14}" y="${(y0+yC)/2-8}" font-size="14" text-anchor="end" fill="currentColor">hypotenuse ${H}</text></svg>`;
    $('#o',el).innerHTML=fmt(`$\\sin A=\\frac{\\text{opp}}{\\text{hyp}}=${Math.sin(t).toFixed(3)}$ &nbsp; $\\cos A=\\frac{\\text{adj}}{\\text{hyp}}=${Math.cos(t).toFixed(3)}$ &nbsp; $\\tan A=\\frac{\\text{opp}}{\\text{adj}}=${Math.tan(t).toFixed(3)}$<br>Angle $B=${90-a}^\\circ$, and $\\sin ${a}^\\circ=\\cos ${90-a}^\\circ$. The side opposite A is the side adjacent to B.<br>Scale the triangle with the hypotenuse slider and watch the ratios stay the same. That is why similar right triangles share trig values.`)};
  $$('input',el).forEach(x=>x.addEventListener('input',R));R()},
boxplot(el){el.innerHTML=`<h3>Try It: Whiskers vs Box</h3><div class="ctrls">${ctl('a','min',0,20,1)}${ctl('b','Q1',0,20,4)}${ctl('c','median',0,20,7)}${ctl('d','Q3',0,20,10)}${ctl('e','max',0,20,16)}</div><div class="stage" id="v"></div><div class="out" id="o"></div>`;
  const R=e=>{const ids=['a','b','c','d','e'];const vals=ids.map(k=>+$('#'+k,el).value);const ch=e&&e.target?ids.indexOf(e.target.id):-1;
    for(let i=ch+1;i<5&&ch>=0;i++)if(vals[i]<vals[i-1])vals[i]=vals[i-1];for(let i=ch-1;i>=0&&ch>=0;i--)if(vals[i]>vals[i+1])vals[i]=vals[i+1];
    ids.forEach((k,i)=>{$('#'+k,el).value=vals[i];$('#'+k+'o',el).textContent=vals[i]});const [a,b,c,d,f]=vals,sx=x=>30+x*29;
    let g=`<line x1="${sx(0)}" y1="84" x2="${sx(20)}" y2="84" stroke="currentColor"/>`;for(let i=0;i<=20;i+=2)g+=`<line x1="${sx(i)}" y1="84" x2="${sx(i)}" y2="90" stroke="currentColor"/><text x="${sx(i)}" y="105" font-size="13" text-anchor="middle" fill="currentColor">${i}</text>`;
    g+=`<line x1="${sx(a)}" y1="45" x2="${sx(f)}" y2="45" style="stroke:var(--accent)" stroke-width="3"/><line x1="${sx(a)}" y1="33" x2="${sx(a)}" y2="57" style="stroke:var(--accent)" stroke-width="3"/><line x1="${sx(f)}" y1="33" x2="${sx(f)}" y2="57" style="stroke:var(--accent)" stroke-width="3"/><rect x="${sx(b)}" y="24" width="${sx(d)-sx(b)}" height="42" stroke-width="3" style="stroke:var(--accent2);fill:var(--white)"/><line x1="${sx(c)}" y1="24" x2="${sx(c)}" y2="66" stroke="currentColor" stroke-width="3"/>`;
    $('#v',el).innerHTML=`<svg viewBox="0 0 640 112" role="img" aria-label="Box plot">${g}</svg>`;
    $('#o',el).innerHTML=`<span style="color:var(--accent)"><strong>Range</strong> = whisker tip to whisker tip = ${f} - ${a} = ${f-a}</span><br><span style="color:var(--accent2)"><strong>IQR</strong> = box edge to box edge = ${d} - ${b} = ${d-b}</span><br><strong>Median</strong> = the line in the box = ${c}. Half the data sits in the box, and each whisker holds a quarter.`};
  $$('input',el).forEach(x=>x.addEventListener('input',R));R()},
zeros(el){el.innerHTML=`<h3>Try It: Zeros Build the Parabola</h3><div class="ctrls">${ctl('r','zero r',-6,6,-3)}${ctl('s','zero s',-6,6,5)}${ctl('a','a',-3,3,2)}${ctl('c','shift c',0,9,7)}</div><div class="stage" id="v"></div><div class="out" id="o"></div>`;
  const R=()=>{const r=+$('#r',el).value,s=+$('#s',el).value;let a=+$('#a',el).value;if(a===0){a=1;$('#a',el).value=1}const c=+$('#c',el).value;['r','s','a','c'].forEach(x=>$('#'+x+'o',el).textContent=$('#'+x,el).value);
    const f=x=>a*(x-r)*(x-s),b=-a*(r+s),k=a*r*s,vx=(r+s)/2,W=640,H=280,sx=x=>W/2+x*29,Ym=Math.max(12,Math.abs(f(vx))*1.2),sy=y=>H/2-y/Ym*(H/2-8);
    let d='',pen=false;for(let x=-10.5;x<=10.5;x+=.05){const y=f(x);if(Math.abs(y)>Ym){pen=false;continue}d+=(pen?'L':'M')+sx(x).toFixed(1)+' '+sy(y).toFixed(1);pen=true}
    let g=`<line x1="${sx(-10.5)}" y1="${sy(0)}" x2="${sx(10.5)}" y2="${sy(0)}" stroke="currentColor"/><line x1="${sx(0)}" y1="4" x2="${sx(0)}" y2="${H-4}" stroke="currentColor"/>`;for(let i=-10;i<=10;i+=2)if(i)g+=`<text x="${sx(i)}" y="${sy(0)+16}" font-size="12" text-anchor="middle" fill="currentColor">${i}</text>`;
    g+=`<path d="${d}" fill="none" style="stroke:var(--accent)" stroke-width="3"/><circle cx="${sx(r)}" cy="${sy(0)}" r="6" style="fill:var(--accent2)"/><circle cx="${sx(s)}" cy="${sy(0)}" r="6" style="fill:var(--accent2)"/>`;if(Math.abs(k)<=Ym)g+=`<circle cx="${sx(0)}" cy="${sy(k)}" r="5" style="fill:var(--good)"/>`;
    $('#v',el).innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Parabola">${g}</svg>`;
    const fac=v=>v===0?'x':`(x ${v>0?'-':'+'} ${Math.abs(v)})`,std=`${term(a,'x^2',true)}${term(b,'x')}${k?(k<0?' - '+(-k):' + '+k):''}`,w=v=>c-v;
    $('#o',el).innerHTML=fmt(`Factored: $f(x)=${a===1?'':a===-1?'-':a}${fac(r)}${fac(s)}$ &nbsp; Standard: $f(x)=${std}$<br>$a+b=${a+b}$ &nbsp; y-intercept (green) $=f(0)=${k}$ &nbsp; vertex at $x=${vx}$, the midpoint of the zeros<br>Shifted input: $f(${c}-w)=0$ means $${c}-w=${r}$ or $${c}-w=${s}$, so $w=${w(r)}$ or $w=${w(s)}$. Their sum is $${w(r)+w(s)}$.`)};
  $$('input',el).forEach(x=>x.addEventListener('input',R));R()}
};

/* ---------- Lessons ---------- */
const FORMULA={id:'formula',title:'Formula Card',isCard:true};
function lessonDetail(dt,l,c){
  if(l.isCard){dt.innerHTML=`<div class="card guide"><h2>Formula Card for Your Weak Spots</h2><div class="scrollx"><table><tr><th>Skill</th><th>Remember</th></tr>
  <tr><td>Inequality flip</td><td>Multiply or divide by a negative: flip the sign. Nothing else flips it.</td></tr>
  <tr><td>Percent to multiplier</td><td>${fmt('Up $r\\%$: $\\times(1+r)$. Down $r\\%$: $\\times(1-r)$. Original $=$ final $\\div$ multiplier.')}</td></tr>
  <tr><td>Growth and decay</td><td>${fmt('$A=P\\cdot m^{t/k}$, where $k$ is how long one change takes. Monthly with $t$ in years: exponent $12t$.')}</td></tr>
  <tr><td>Excluded values</td><td>Set every original denominator equal to 0, before you cancel anything.</td></tr>
  <tr><td>Circle</td><td>${fmt('$(x-h)^2+(y-k)^2=r^2$. Complete the square: add $(\\frac{b}{2})^2$ to both sides for each variable.')}</td></tr>
  <tr><td>Trig</td><td>${fmt('$\\sin=\\frac{opp}{hyp}$, $\\cos=\\frac{adj}{hyp}$, $\\tan=\\frac{opp}{adj}$. $\\sin x^\\circ=\\cos(90-x)^\\circ$.')}</td></tr>
  <tr><td>Special triangles</td><td>${fmt('$30\\text{-}60\\text{-}90$: $s,\\ s\\sqrt3,\\ 2s$. $45\\text{-}45\\text{-}90$: $s,\\ s,\\ s\\sqrt2$.')}</td></tr>
  <tr><td>Circle facts</td><td>Tangent is perpendicular to the radius. Two tangents from one point are equal. An inscribed rectangle has its diagonal as a diameter.</td></tr>
  <tr><td>Similar triangles</td><td>Match sides through equal angles, never by position on the page.</td></tr>
  <tr><td>Quadratic from zeros</td><td>${fmt('$f(x)=a(x-r)(x-s)$. Vertex $x$ is the midpoint of the zeros. Also $x=-\\frac{b}{2a}$.')}</td></tr>
  <tr><td>Shifted input</td><td>${fmt('$g(\\text{stuff})=0$ means stuff equals a zero of $g$.')}</td></tr>
  <tr><td>Box plot</td><td>Range uses whisker tips. IQR uses box edges. The middle line is the median.</td></tr>
  <tr><td>Given that</td><td>The denominator shrinks to only that group.</td></tr>
  <tr><td>Intercepts</td><td>${fmt('x-intercept: set $y=0$. y-intercept: set $x=0$.')}</td></tr>
  </table></div></div>`;return}
  const guided=l.guided||[];let g=0;
  dt.innerHTML=`<div class="card"><h2>${fmt(l.title)}</h2>${l.report?`<div class="report"><strong>Your report:</strong> ${fmt(l.report)}</div>`:''}${l.why?`<p>${fmt(l.why)}</p>`:''}
    ${(l.idea||[]).map(x=>`<div class="idea">${fmt(x)}</div>`).join('')}<div class="widget" id="w" ${l.widget&&WIDGETS[l.widget]?'':'hidden'}></div></div>
    <div class="card"><div class="head-row"><h3 style="margin:0">Work It Together</h3><div class="seg" id="gs" style="margin:0"></div></div><div id="gp"></div></div>`;
  if(l.widget&&WIDGETS[l.widget])WIDGETS[l.widget]($('#w',dt));
  const sh=()=>{$('#gs',dt).innerHTML=guided.map((p,i)=>`<button type="button" class="ghost ${i===g?'on':''}" data-i="${i}">${isDone(p.id)?'&#10003; ':''}${i+1}</button>`).join('');$$('#gs button',dt).forEach(b=>b.addEventListener('click',()=>{g=+b.dataset.i;sh()}));
    stepper($('#gp',dt),guided[g],{nextLabel:g<guided.length-1?'Next Problem':'Next Lesson',onDone:()=>{c.refresh();$$('#gs button',dt).forEach((b,i)=>{if(isDone(guided[i].id)&&!b.textContent.includes('✓'))b.innerHTML='&#10003; '+(i+1)})},onNext:()=>{if(g<guided.length-1){g++;sh();$('#gp',dt).scrollIntoView({behavior:'smooth'})}else c.next()}})};
  if(guided.length)sh();
}

/* ---------- Vocab SRS ---------- */
const DAY=864e5;
function today(){const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()}
function card(w){return S.srs[w]||null}
function nextIv(c,g){let ease=c?c.ease:2.5,iv=c?c.iv:0;
  if(g==='again')return{iv:0,ease:Math.max(1.3,ease-.2)};
  if(g==='hard')return{iv:iv?Math.max(1,Math.round(iv*1.2)):1,ease:Math.max(1.3,ease-.15)};
  if(g==='good')return{iv:iv?Math.round(iv*ease):1,ease};
  return{iv:iv?Math.round(iv*ease*1.3):4,ease:ease+.15}}
function ivLabel(n){return n===0?'in 10 min':n===1?'1 day':n<30?n+' days':Math.round(n/30)+' mo'}
function clozeOf(v,seed){const stem=v.w.slice(0,Math.max(4,v.w.length-2));
  const re=new RegExp('\\b'+stem+'[a-z]*','i');
  const opts=v.ex.filter(e=>re.test(e));if(!opts.length)return null;
  const e=opts[hash(seed)%opts.length];return e.replace(re,'______')}
function vocabView(root){
  const V=L.vocab,dayKey=String(today());S.srsDay[dayKey]=S.srsDay[dayKey]||0;
  let newCap=S.newCap||10,sess=[],cur=null,showBack=false,sel=null,search='';
  function stats(){let nw=0,lr=0,rv=0,due=0;const now=Date.now();V.forEach(v=>{const c=card(v.w);if(!c){nw++;return}if(c.iv<7)lr++;else rv++;if(c.due<=now)due++});return{nw,lr,rv,due}}
  function pickNext(){const now=Date.now();
    const due=V.filter(v=>{const c=card(v.w);return c&&c.due<=now&&(!cur||v.w!==cur.w||V.length===1)}).sort((a,b)=>card(a.w).due-card(b.w).due);
    if(due.length)return due[0];
    if(S.srsDay[dayKey]<newCap){const nw=V.find(v=>!card(v.w));if(nw)return nw}
    return null}
  function draw(){const s=stats();cur=pickNext();showBack=false;sel=null;
    let h=`<div class="card"><div class="head-row"><h2>Vocabulary SRS</h2><span><span class="chip">${s.due} due</span> <span class="chip">${Math.max(0,newCap-S.srsDay[dayKey])} new left today</span></span></div>
    <p class="muted small">Words come back right before you would forget them. Say the meaning out loud, then rate yourself honestly. Connotation matters: on the test a praising sentence will not take a negative word.</p>
    <div class="actions" style="margin-top:0"><label class="small" style="font-family:var(--fp);font-weight:600">New words a day <select id="cap" style="font:inherit;background:var(--white);color:var(--forest);border-radius:6px">${[5,10,15,20,30,100].map(n=>`<option ${n===newCap?'selected':''}>${n}</option>`).join('')}</select></label><span class="small muted">${s.nw} new, ${s.lr} learning, ${s.rv} strong</span></div></div><div class="card" id="fc"></div>
    <div class="card"><div class="head-row"><h3 style="margin:0">All 100 Words</h3><input id="vs" type="search" placeholder="Search" aria-label="Search words" style="font:inherit;padding:4px 10px;border-radius:9px;border:1.5px solid var(--sage-l);background:var(--white);color:var(--forest);width:170px" value="${esc(search)}"></div><p class="small muted">Amber is learning, green is strong. Tap a word to see it.</p><div class="wgrid" id="wg"></div><div id="wd" style="margin-top:10px"></div></div>`;
    root.innerHTML=h;$('#cap',root).addEventListener('change',e=>{newCap=+e.target.value;S.newCap=newCap;save();draw()});
    const grid=()=>{$('#wg',root).innerHTML=V.filter(v=>!search||v.w.includes(search)||v.d.toLowerCase().includes(search)).map(v=>{const c=card(v.w);return `<button type="button" data-w="${v.w}" class="${c?(c.iv<7?'learning':'review'):''}">${v.w}</button>`}).join('');
      $$('#wg button',root).forEach(b=>b.addEventListener('click',()=>{const v=V.find(x=>x.w===b.dataset.w);$('#wd',root).innerHTML=`<div class="idea">${backHtml(v)}</div>`}))};
    grid();$('#vs',root).addEventListener('input',e=>{search=e.target.value.trim().toLowerCase();grid()});
    face();
  }
  function backHtml(v){const c=card(v.w);return `<div class="back"><p style="margin-bottom:6px"><strong style="font-family:var(--fh);font-size:1.25rem;font-weight:400">${v.w}</strong> <em>${v.pos}</em> <span class="con ${v.con.split(' ')[0]}">${v.con}</span></p><p style="margin-bottom:6px">${esc(v.d)}</p><ol>${v.ex.map(e=>`<li>${esc(e)}</li>`).join('')}</ol>${c?`<p class="small muted" style="margin:6px 0 0">Next review ${c.due<=Date.now()?'now':new Date(c.due).toLocaleDateString()}.</p>`:''}</div>`}
  function face(){const fc=$('#fc',root);
    if(!cur){fc.innerHTML=`<div class="flash"><div class="word">All Caught Up</div><p style="margin-top:8px">Nothing is due. Come back tomorrow, or raise the new-word limit above.</p></div>`;return}
    const c=card(cur.w),isCloze=c&&c.reps>=1,cl=isCloze?clozeOf(cur,cur.w+c.reps):null;
    if(cl&&!showBack){
      const pool=V.filter(v=>v.w!==cur.w&&v.pos===cur.pos);const pick=shuffle(pool,cur.w+c.reps).slice(0,3).map(x=>x.v.w);const opts=shuffle([cur.w,...pick],cur.w+'o'+c.reps);
      fc.innerHTML=`<div class="flash"><span class="chip">Fill the Blank</span><div class="cloze">${esc(cl)}</div><div class="choices">${opts.map((o,i)=>`<button class="ch" data-w="${o.v}" type="button"><b>${'ABCD'[i]}</b><span>${o.v}</span></button>`).join('')}</div></div>`;
      $$('.ch',fc).forEach(b=>b.addEventListener('click',()=>{sel=b.dataset.w;showBack=true;bump(sel===cur.w);back(sel===cur.w)}));return}
    fc.innerHTML=`<div class="flash"><span class="chip">${c?'Review':'New Word'}</span><div class="word" style="margin-top:10px">${cur.w}</div><p class="muted"><em>${cur.pos}</em></p><p>What does it mean? Is it positive, negative or neutral?</p><button class="btn" id="rv" type="button">Show Answer</button></div>`;
    const rv=$('#rv',fc);rv.addEventListener('click',()=>{showBack=true;back(null)});rv.focus({preventScroll:true});
  }
  function back(res){const fc=$('#fc',root),c=card(cur.w);const gr=[['again','Again'],['hard','Hard'],['good','Good'],['easy','Easy']];
    fc.innerHTML=`<div class="flash">${res===false?`<div class="fb no" style="text-align:left">You chose <strong>${esc(sel)}</strong>. The word that fits is <strong>${cur.w}</strong>.</div>`:res===true?`<div class="fb ok" style="text-align:left"><strong>Right.</strong> Rate how easily it came.</div>`:''}${backHtml(cur)}
    <div class="grades">${gr.map(g=>`<button type="button" data-g="${g[0]}" ${res===false&&g[0]!=='again'?'disabled style="opacity:.35"':''}>${g[1]}<small>${ivLabel(nextIv(c,g[0]).iv)}</small></button>`).join('')}</div></div>`;
    $$('.grades button',fc).forEach(b=>b.addEventListener('click',()=>rate(b.dataset.g)));}
  function rate(g){const c=card(cur.w),n=nextIv(c,g);if(!c)S.srsDay[dayKey]++;
    S.srs[cur.w]={iv:n.iv,ease:n.ease,reps:(c?c.reps:0)+1,lapses:(c?c.lapses:0)+(g==='again'?1:0),due:n.iv===0?Date.now()+6e5:today()+n.iv*DAY};save();draw()}
  if(!V.length){root.innerHTML='<div class="card">Content is loading.</div>';return}
  draw();
}

/* ---------- Plan ---------- */
function planView(root){
  const prios=[['Linear Inequalities','2 of 4 right. You missed an easy one and a hard one, and the leak is the sign flip.',50,'ineq'],
   ['Growth and Decay Word Problems','4 of 8 right. All four misses were medium or hard, mostly from translating the sentence.',50,'growth'],
   ['Percent Change and Working Backward','1 of 2 right. Choosing the base is the issue, not the arithmetic.',50,'percent'],
   ['Circle Equations','1 of 3 right, both misses hard. Completing the square is the missing move.',33,'circle'],
   ['Equivalent Expressions','3 of 4 right. Excluded values and factoring before you cancel.',75,'equiv'],
   ['Right Triangles and Trig','1 of 2 right. Choosing the ratio and chaining with Pythagoras.',50,'trig']];
  const count=a=>a.filter(p=>isDone(p.id)).length;const all=[].concat(...L.lessons.map(l=>l.guided||[]));
  const vs=Object.keys(S.srs).length;
  root.innerHTML=`<div class="card"><h1>Your Road to 1500</h1><p style="margin-top:6px">This workbook is built from your practice exam report and the questions you missed. You and Sruthi work through it step by step: you fill the blank, hit Next, and the next part opens.</p>
  <div class="grid2" style="margin-top:12px"><div class="idea"><div class="stat">1210 to 1420</div>Current range. Target 1500.</div><div class="idea"><div class="stat">19 then 14</div>Math right in Module 1, then Module 2, out of 22. Most of your lost points came in the second module.</div><div class="idea"><div class="stat">3 of 44</div>Math answers rated Solid. 30 were right but Unsure, so confidence is a big part of the gap.</div><div class="idea"><div class="stat">63s and 71s</div>Your average per question in each module, against the recommended 95s. You have about 24 to 32 extra seconds a question to re-read what is being asked. Cap any one question at 90 seconds on a first pass, flag it, and come back.</div></div></div>
  <div class="grid2"><div class="card"><h2>Priorities, in Order</h2>${prios.map((p,i)=>`<div class="prio"><span class="n">${i+1}</span><div><strong>${p[0]}</strong><div class="small muted">${p[1]}</div><div class="bar" style="margin-top:5px"><i class="${p[2]<70?'low':''}" style="width:${p[2]}%"></i></div></div><button class="ghost" type="button" data-go="lessons/${p[3]}">Open</button></div>`).join('')}</div>
  <div><div class="card"><h2>Today in Class</h2><ol style="padding-left:22px"><li><strong>Missed Questions:</strong> redo each skill you missed on a new version of the problem.</li><li><strong>Lessons:</strong> start with the top priority, play with the diagram, then work it together.</li><li><strong>Challenge:</strong> harder problems, one step at a time.</li><li><strong>Grammar:</strong> one rule from the guide, then questions.</li><li><strong>Vocab:</strong> clear what is due.</li><li><strong>Mastery Check:</strong> end here to see what is truly solid.</li></ol></div>
  <div class="card"><h2>Your Progress</h2>
   ${[['Missed Questions',count(L.twins),L.twins.length],['Lesson Problems',count(all),all.length],['Challenge',count(L.challenge),L.challenge.length],['Grammar Walkthroughs',count(L.grammarWalk),L.grammarWalk.length],['Vocab Started',vs,L.vocab.length]].map(r=>`<div style="margin-bottom:8px"><div class="small" style="display:flex;justify-content:space-between"><span>${r[0]}</span><span>${r[1]} of ${r[2]}</span></div><div class="bar"><i style="width:${r[2]?r[1]/r[2]*100:0}%"></i></div></div>`).join('')}
   <p class="small muted" style="margin-top:10px">Progress saves in this browser on this device. To move it, copy the code here and load it on the other device.</p>
   <div class="actions"><button class="ghost" id="ex" type="button">Copy Progress Code</button><button class="ghost" id="im" type="button">Load a Code</button><button class="ghost" id="rs" type="button">Reset</button></div><div id="pio"></div></div></div></div>
  <div class="card soft"><h2>What Is Already Working</h2><p>Linear equations, systems, linear functions, one-variable nonlinear equations, probability and inference: no misses on your exam. Those stay warm through the mixed practice set, and you can leave them out of class time for now.</p></div>`;
  $$('[data-go]',root).forEach(b=>b.addEventListener('click',()=>{const [t,id]=b.dataset.go.split('/');S.cur[t]=id;save();location.hash=t}));
  $('#ex',root).addEventListener('click',()=>{const code=btoa(unescape(encodeURIComponent(JSON.stringify(S))));const o=$('#pio',root);o.innerHTML=`<textarea readonly style="width:100%;height:70px;margin-top:8px;background:var(--white);color:var(--forest)" aria-label="Progress code"></textarea>`;const ta=$('textarea',o);ta.value=code;ta.select();try{navigator.clipboard.writeText(code)}catch(e){}});
  $('#im',root).addEventListener('click',()=>{const o=$('#pio',root);o.innerHTML=`<textarea style="width:100%;height:70px;margin-top:8px;background:var(--white);color:var(--forest)" aria-label="Paste progress code"></textarea><button class="btn" type="button" style="margin-top:6px">Load</button>`;$('button',o).addEventListener('click',()=>{try{S=Object.assign(S,JSON.parse(decodeURIComponent(escape(atob($('textarea',o).value.trim())))));save();route()}catch(e){o.insertAdjacentHTML('beforeend','<div class="fb no">That code did not load.</div>')}})});
  let arm=false;$('#rs',root).addEventListener('click',e=>{if(!arm){arm=true;e.target.textContent='Click Again to Erase Everything';return}S={done:{},quiz:{},mastery:null,srs:{},srsDay:{},theme:S.theme,cur:{}};save();Object.keys(run).forEach(k=>delete run[k]);route()});
}

/* ---------- Grammar ---------- */
function grammarView(root){
  const mode=S.gMode||'guide';
  const seg=[['guide','Guide'],['walk','Walk Through'],['qs','Questions']];
  root.innerHTML=`<div class="seg">${seg.map(s=>`<button type="button" class="ghost ${mode===s[0]?'on':''}" data-m="${s[0]}">${s[1]}</button>`).join('')}</div><div id="gb"></div>`;
  $$('[data-m]',root).forEach(b=>b.addEventListener('click',()=>{S.gMode=b.dataset.m;save();grammarView(root)}));
  const gb=$('#gb',root);
  if(mode==='guide')listView(gb,L.grammarGuide,'gguide',(dt,g,c)=>{dt.innerHTML=`<div class="card guide"><div class="head-row"><h2>${esc(g.title)}</h2>${g.tested?`<span class="chip ${g.tested==='high'?'hard':g.tested==='medium'?'medium':''}">Tested: ${cap(g.tested)}</span>`:''}</div><div class="scrollx">${fmt(g.html)}</div><div class="actions"><button class="btn" id="n" type="button">Next Rule</button></div></div>`;$('#n',dt).addEventListener('click',c.next);S.done['g-'+g.id]={};save();c.refresh&&0},{isDone:g=>!!S.done['g-'+g.id]});
  else if(mode==='walk')listView(gb,L.grammarWalk,'gwalk',problemDetail);
  else quizView(gb,L.grammarQs,'grammar',{title:'Grammar Questions',note:'First find what changes between the choices, then name the rule. The clock turns red at 90 seconds.'});
}

/* ---------- Router ---------- */
const TABS=[['plan','Start Here'],['twins','Missed Questions'],['lessons','Lessons'],['challenge','Challenge'],['practice','Extra Practice'],['mastery','Mastery Check'],['grammar','Grammar'],['vocab','Vocab SRS']];
function route(){stopTimer();const t=(location.hash||'#plan').slice(1);const cur=TABS.some(x=>x[0]===t)?t:'plan';
  $('#tabs').innerHTML=TABS.map(x=>`<button type="button" data-t="${x[0]}" ${x[0]===cur?'aria-current="page"':''}>${x[1]}</button>`).join('');
  $$('#tabs button').forEach(b=>b.addEventListener('click',()=>{location.hash=b.dataset.t}));
  const a=$('#tabs [aria-current]');if(a)a.scrollIntoView({block:'nearest',inline:'center'});
  const v=$('#view');v.innerHTML='';
  if(cur==='plan')planView(v);
  if(cur==='twins')listView(v,L.twins,'twins',problemDetail,{intro:`<div class="card soft"><h2>The Questions You Missed</h2><p style="margin:0">Each one is a new problem that tests the exact skill and sets the same trap as a question you got wrong. If you can beat the twin, you own the skill.</p></div>`});
  if(cur==='lessons')listView(v,L.lessons.concat([FORMULA]),'lessons',lessonDetail,{isDone:l=>l.guided?l.guided.every(p=>isDone(p.id)):false});
  if(cur==='challenge')listView(v,L.challenge,'challenge',problemDetail,{intro:`<div class="card soft"><h2>Challenge Problems</h2><p style="margin:0">This is the level you need for 1500. Read the problem and say your plan out loud before the first blank.</p></div>`});
  if(cur==='practice')quizView(v,L.practice,'practice',{title:'Extra Practice',note:'Filter by skill or level. The clock turns red at 90 seconds: on the test, that is your signal to flag it and move on.'});
  if(cur==='mastery')masteryView(v);
  if(cur==='grammar')grammarView(v);
  if(cur==='vocab')vocabView(v);
  window.scrollTo({top:0});
}
function setTheme(){document.body.dataset.theme=S.theme;$('#theme').textContent=S.theme==='dark'?'Light Mode':'Dark Mode'}
$('#theme').addEventListener('click',()=>{S.theme=S.theme==='dark'?'light':'dark';save();setTheme()});
setTheme();window.addEventListener('hashchange',route);route();
window.__wb={numOk,fmt,clozeOf};
})();
