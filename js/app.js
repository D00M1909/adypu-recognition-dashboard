/* Home, the NAAC framework page and the hash router:
   #/  ·  #/naac  ·  #/a4/<metric>/<sheet>  ·  #/brand */

function renderHome(){
  return `<section class="intro">
      <div class="eyebrow">NAAC Binary Accreditation · ${NAAC_TOTAL} marks</div>
      <h1>${esc(THEME.name || 'NAAC readiness')}</h1>
      <p>Attribute 4, Financial Resources &amp; Management: fill each metric online or upload its Excel workbook.</p>
      ${sampleBar()}
    </section>
    <section class="a4home">
      <div class="a4home-h"><h2>Attribute 4 · Financial Resources &amp; Management</h2><span class="marks">${A4_TOTAL} marks</span></div>
      <div class="mcards">${A4.map(metricCard).join('')}</div>
      <p class="fine">NAAC’s draft names the ratios for 4.1 and 4.2 without publishing how they are scored. Bands are the workbooks’ indicative guidance.</p>
    </section>
    <section class="coming">
      <h2>Coming next</h2>
      <div class="chips">${COMING.map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div>
      <a class="more" href="#/naac">See all ten NAAC attributes →</a>
    </section>`;
}

// Sample data: offered while nothing is entered, and labelled while it's showing.
function sampleBar(){
  if (A4.some(wb => wb.isSample)) return `<div class="samplebar">${pill('Showing sample data', 'info')}<button class="btn ghost" id="sample-clear" type="button">Clear sample data</button></div>`;
  if (A4.every(wb => !wb.entered())) return `<div class="samplebar"><button class="btn ghost" id="sample-load" type="button">Load sample data</button><span class="fine">See how filled workbooks look, with made-up figures.</span></div>`;
  return '';
}
function mountHome(){
  const load = document.getElementById('sample-load'), clear = document.getElementById('sample-clear');
  if (load) load.onclick = () => { A4.forEach(wb => wb.loadSample()); render(); };
  if (clear) clear.onclick = () => { A4.filter(wb => wb.isSample).forEach(wb => wb.clear()); render(); };
}

function renderNaac(){
  const max = Math.max(...NAAC_ATTRIBUTES.map(a => a.marks));
  return `<section class="intro">
      <div class="eyebrow">NAAC Binary Accreditation Framework</div>
      <h1>${NAAC_TOTAL} marks across ten attributes</h1>
      <p>University weights from the BAF draft manual. Attributes open here as each one is built.</p>
    </section>
    <section class="card attrs">${NAAC_ATTRIBUTES.map(a => {
      const row = `<span class="an">${a.n}</span>
        <span class="at"><b>${esc(a.title)}</b><small>${a.group} · ${a.metrics} metrics</small></span>
        <span class="ab"><span class="track"><span class="fill" style="width:${a.marks / max * 100}%"></span></span></span>
        <span class="am">${a.marks}</span>
        ${a.live ? pill('Open', 'good') : pill('Coming')}`;
      return a.live ? `<a class="arow live" href="#/a4/${A4[0].def.id}">${row}</a>` : `<div class="arow">${row}</div>`;
    }).join('')}</section>`;
}

function setNav(route){
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('on', a.dataset.r === route));
}

function render(){
  const [route, id, sub] = location.hash.replace(/^#\/?/, '').split('/');
  const app = document.getElementById('app');
  const wb = route === 'a4' && A4.find(w => w.def.id === id);
  if (wb) { app.innerHTML = metricPage(wb, sub); mountMetric(wb, sub); setNav('a4'); }
  else if (route === 'naac') { app.innerHTML = renderNaac(); setNav('naac'); }
  else if (route === 'brand') { app.innerHTML = renderBrand(); mountBrand(); setNav('brand'); }
  else { app.innerHTML = renderHome(); mountHome(); setNav(''); }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
applyTheme();
render();
