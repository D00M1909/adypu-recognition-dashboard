/* Section registry and the block renderer used by every handbook page. */

const SECTIONS = [
  {id:'accreditation', title:'Accreditation', q:'Do we meet the standard?', items:'NAAC · NBA · International', color:'#1f5fae', groups:[]},
  {id:'ranking', title:'Ranking', q:'How do we compare?', items:'NIRF · QS · THE', color:'#1e7a45', groups:[]},
  {id:'ratings', title:'Ratings', q:'How good are we on a fixed scale?', items:'QS Stars · I-GAUGE · IIC · GreenMetric · ISO · NABL', color:'#c4561b', groups:[]},
  {id:'awards', title:'Awards', q:'What makes us stand out?', items:'National & global honours', color:'#963a14', groups:[]},
  {id:'reputation', title:'Reputation', q:'Who knows our best work?', items:'Visibility · Calendar · Roadmap', color:'#5a3d8a', groups:[]},
];
const sectionById = id => SECTIONS.find(s => s.id === id);

// group(sectionId, groupId, title, blurb, pages)
// page: {id, title, p (handbook page/s), sample (true = illustrative status page),
//        blocks:[...]} or {id, title, p, render: () => html, mount: () => void}
function group(sec, id, title, blurb, pages){
  sectionById(sec).groups.push({id, title, blurb, pages});
}

/* ---------- blocks ---------- */
const B = {
  lead: b => `<p class="lead">${esc(b.x)}</p>`,
  stats: b => `<div class="stats">${b.items.map(([v,l]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>`,
  weights: b => {
    const max = b.max || Math.max(...b.items.map(i => i[1]));
    const unit = b.unit ?? '%';
    return box(b, `<div class="wbars">${b.items.map(([l,w,n]) => `<div class="wrow"><div class="wl">${esc(l)}${n?`<small>${esc(n)}</small>`:''}</div>
      <div class="track"><div class="fill sec" style="width:${Math.max(2, w/max*100)}%"></div></div><div class="wv">${w}${unit}</div></div>`).join('')}</div>`);
  },
  table: b => box(b, `<div class="tbl-wrap"><table class="ht"><thead><tr>${b.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${b.rows.map(r => `<tr>${r.map((c,i) => `<td>${i===0&&b.bold!==false?`<b>${esc(c)}</b>`:esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`),
  steps: b => box(b, `<ol class="vsteps">${b.items.map(([t,d],i) => `<li><span class="n">${i+1}</span><div><b>${esc(t)}</b>${d?`<p>${esc(d)}</p>`:''}</div></li>`).join('')}</ol>`),
  flow: b => box(b, `<div class="flow">${b.items.map(([t,d]) => `<div class="fstep"><b>${esc(t)}</b>${d?`<span>${esc(d)}</span>`:''}</div>`).join('<div class="farr">→</div>')}</div>`),
  cards: b => box(b, `<div class="hcards c${b.cols||3}">${b.items.map(([t,d,tag]) => `<div class="hcard">${tag?`<span class="pill info">${esc(tag)}</span>`:''}<b>${esc(t)}</b>${d?`<p>${esc(d)}</p>`:''}</div>`).join('')}</div>`),
  list: b => box(b, `<ul class="hlist">${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`),
  dodont: b => box(b, `<div class="dodont"><div><h4 class="ok">Do</h4><ul>${b.do.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div>
    <div><h4 class="no">Avoid</h4><ul>${b.dont.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div></div>`),
  note: b => `<div class="hnote ${b.tone||'tip'}">${esc(b.x)}</div>`,
  formula: b => `<div class="formula">${esc(b.x)}</div>`,
  timeline: b => box(b, `<div class="tline">${b.items.map(([w,t]) => `<div class="tl"><div class="tw">${esc(w)}</div><div class="tt">${esc(t)}</div></div>`).join('')}</div>`),
  check: b => box({...b, title: b.title || 'Checklist'}, checklist(b.id, b.items) + (b.score ? `<div class="cscore" data-for="${b.id}"></div>` : '')),
  summary: b => box({title: b.title || 'Things to remember'}, `<ol class="summary">${b.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ol>`),
  row: b => `<div class="hrow c${b.cols.length}">${b.cols.map(renderBlock).join('')}</div>`,
  html: b => box(b, b.html),
};
function box(b, inner){
  return `<section class="card hb">${b.title?`<h3>${esc(b.title)}</h3>`:''}${b.sub?`<p class="hsub">${esc(b.sub)}</p>`:''}${inner}${b.foot?`<p class="hfoot">${esc(b.foot)}</p>`:''}</section>`;
}
function renderBlock(b){ return (B[b.t] || (() => ''))(b); }

/* ---------- interactive checklists (saved in this browser) ---------- */
function loadChecks(id){ try { return JSON.parse(localStorage.getItem('chk-'+id) || '[]'); } catch(e){ return []; } }
function checklist(id, items){
  const on = loadChecks(id);
  return `<div class="chk" data-id="${id}">${items.map((t,i) => `<label><input type="checkbox" data-i="${i}" ${on.includes(i)?'checked':''}><span>${esc(t)}</span></label>`).join('')}
    <div class="chk-count"></div></div>`;
}
function wireChecks(root){
  root.querySelectorAll('.chk').forEach(el => {
    const id = el.dataset.id, boxes = [...el.querySelectorAll('input')];
    const update = () => {
      const on = boxes.filter(b => b.checked).map(b => +b.dataset.i);
      try { localStorage.setItem('chk-'+id, JSON.stringify(on)); } catch(e){}
      el.querySelector('.chk-count').innerHTML = `<b>${on.length} / ${boxes.length}</b> done`;
      const sc = root.querySelector(`.cscore[data-for="${id}"]`);
      if (sc) { const n = on.length, tone = n >= 10 ? 'good' : n >= 7 ? 'warn' : 'bad';
        sc.innerHTML = `${pill(n >= 10 ? 'Ready to submit' : n >= 7 ? 'Close gaps in 3 months' : 'Restart the 12-month plan', tone)}`; }
    };
    boxes.forEach(b => b.onchange = update); update();
  });
}

const hbRef = p => p ? `<span class="hbref" title="Page in the Quality Recognition Handbook">Handbook p. ${esc(p)}</span>` : '';
