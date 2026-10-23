/* Home page, section pages and the hash router: #/section/group/page */

function renderHome(){
  const naacReady=v('naac-ready',68,15), nbaOk=v('nba-acc',6,2,0,10), intlN=v('intl',1,1,0,3);
  const nirfBand=pick('nirf',['101-150','151-200','Rank 92','Rank 118']), qsB=pick('qs',['Asia 451-500','Not yet ranked','Asia 401-450']), theB=pick('the',['1201-1500','SDG: 401-600','Not yet ranked']);
  const iicS=v('iic',4,1,1,5), gm=pick('gm',['Rank 312','Rank 287','Applied']), isoN=v('iso',2,1,0,4);
  const stats = {
    accreditation:[['NAAC readiness',naacReady+'%'],['NBA programmes accredited',nbaOk],['International accreditations',intlN]],
    ranking:[['NIRF (Overall)',nirfBand],['QS',qsB],['THE',theB]],
    ratings:[['IIC rating',iicS+' ★'],['GreenMetric',gm],['ISO / NABL certificates',isoN]],
    awards:[['Institution awards',v('aw-i',18,8,0,60)],['Faculty awards (AY)',v('aw-f',42,14,0,90)],['Student awards (AY)',v('aw-s',96,30,0,200)]],
  };
  const pages = SECTIONS.reduce((a,s) => a + s.groups.reduce((b,g) => b + g.pages.filter(p => !p.sample).length, 0), 0);
  const P = s => `<a class="pillar" href="#/${s.id}" style="--c:${s.color}">
      <div class="ph"><h2>${s.title}</h2><div>${s.items}</div></div>
      <div class="pb">${stats[s.id].map(([l,val])=>`<div class="pstat"><span>${l}</span><b>${val}</b></div>`).join('')}</div>
      <div class="go">Open ${s.title} →</div></a>`;
  const rep = sectionById('reputation');
  return `
  <section class="hero">
    <div class="eyebrow">Quality Recognition Dashboard · ${esc(instName(INST))}</div>
    <h1>Accreditation, <span>Ranking, Awards</span> &amp; Recognition</h1>
    <span class="tagline">Accredit to assure. Rank to compare. Recognise to inspire.</span>
  </section>
  <div class="pillars">${SECTIONS.filter(s => stats[s.id]).map(P).join('')}</div>
  <a class="repband" href="#/reputation" style="--c:${rep.color}"><div><b>Reputation &amp; planning</b><span>Recognition calendar · ten-year roadmap · rankings office · visibility</span></div><span class="go">Open →</span></a>
  <div class="grid2">
    ${card('All-school snapshot','', table(['School','NAAC evidence','NBA','NIRF','IIC','Awards (AY)','Overall readiness'],snapshotRows()))}
    ${card('Due in the next 90 days','',
      DEADLINES.map(([d,m,t,s,c])=>`<div class="dl"><div class="date"><b>${d}</b><span>${m}</span></div><div><div class="t">${t}</div><div class="m"><span class="tag" style="background:${c}"></span>${s}</div></div></div>`).join('')
      + `<a class="more" href="#/reputation/plan/calendar">Full recognition calendar →</a>`)}
  </div>
  <p class="hcount">${pages} handbook pages across ${SECTIONS.reduce((a,s)=>a+s.groups.length,0)} frameworks · every page cites the handbook page it comes from</p>`;
}

function sectionHeader(S, activeGroup){
  return `<div class="shead"><div class="eyebrow">${esc(instName(INST))}</div><h1>${S.title}</h1><p>${S.q} · ${S.items}</p>
    <nav class="tabs"><a class="tab ${activeGroup?'':'on'}" href="#/${S.id}">Overview</a>${S.groups.map(g => `<a class="tab ${g.id===activeGroup?'on':''}" href="#/${S.id}/${g.id}">${g.title}</a>`).join('')}</nav></div>`;
}

function renderSection(S){
  return `<div class="crumbs"><a href="#/">Home</a> › ${S.title}</div>${sectionHeader(S, null)}
    <div class="sbody"><div class="gcards">${S.groups.map(g => `<div class="card gcard"><a href="#/${S.id}/${g.id}"><h3>${g.title}</h3><p class="gblurb">${esc(g.blurb)}</p></a>
      <ul>${g.pages.map(p => `<li><a href="#/${S.id}/${g.id}/${p.id}">${esc(p.title)}</a>${p.sample?pill('Sample data','warn'):p.p?`<span class="pg">p. ${p.p}</span>`:''}</li>`).join('')}</ul></div>`).join('')}</div></div>`;
}

function renderPage(S, G, P){
  const body = P.render ? P.render() : P.blocks.map(renderBlock).join('');
  const i = G.pages.indexOf(P), prev = G.pages[i-1], next = G.pages[i+1];
  return `<div class="crumbs"><a href="#/">Home</a> › <a href="#/${S.id}">${S.title}</a> › <a href="#/${S.id}/${G.id}">${G.title}</a> › ${esc(P.title)}</div>
    ${sectionHeader(S, G.id)}
    <div class="layout">
      <aside class="side"><div class="side-t">${G.title}</div>${G.pages.map(p => `<a class="${p===P?'on':''}" href="#/${S.id}/${G.id}/${p.id}"><span>${esc(p.title)}</span>${p.sample?'<i class="dot"></i>':p.p?`<em>${p.p}</em>`:''}</a>`).join('')}</aside>
      <div class="main">
        <div class="ptitle"><h2>${esc(P.title)}</h2>${P.sample ? pill('Sample data','warn') : hbRef(P.p)}</div>
        ${body}
        <div class="pnav">${prev?`<a href="#/${S.id}/${G.id}/${prev.id}">← ${esc(prev.title)}</a>`:'<span></span>'}${next?`<a href="#/${S.id}/${G.id}/${next.id}">${esc(next.title)} →</a>`:''}</div>
      </div>
    </div>`;
}

function render(){
  const [sec, grp, pg] = location.hash.replace(/^#\/?/,'').split('/');
  const app = document.getElementById('app'), S = sectionById(sec);
  document.documentElement.style.setProperty('--sec', S?.color || '#0d2350');
  let P = null;
  if (!S) app.innerHTML = renderHome();
  else {
    const G = S.groups.find(g => g.id === grp);
    if (!G) app.innerHTML = renderSection(S);
    else { P = G.pages.find(p => p.id === pg) || G.pages[0]; app.innerHTML = renderPage(S, G, P); }
  }
  if (P && P.mount) P.mount();
  wireChecks(app);
  window.scrollTo(0, 0);
}

const sel = document.getElementById('inst');
sel.innerHTML = INSTITUTIONS.map(([id,n]) => `<option value="${id}">${n}</option>`).join('');
sel.value = INST;
sel.onchange = () => { INST = sel.value; try { localStorage.setItem('arr-inst', INST); } catch(e){} render(); };
window.addEventListener('hashchange', render);
render();
