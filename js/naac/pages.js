/* NAAC Attribute 4 (Financial Resources & Management): a page per metric
   workbook with its sheets as tabs, and the metric cards on the home page. */

const A4 = WORKBOOKS.map(d => new Workbook(d));
const A4_SHORT = {'4.1': 'Capital income vs expenditure', '4.2': 'Revenue income vs expenditure', '4.3': 'Financial sustainability', '4.4': 'Financial controls & risk'};
const A4_TOTAL = A4.reduce((s, wb) => s + wb.def.marks, 0);

// Headline results, read straight from each workbook's summary sheet.
const A4_KEYS = {
  '4.1': [['Capital utilisation ratio', "'5. Summary & Ratio'!H12"], ['Band (indicative)', "'5. Summary & Ratio'!H17"],
          ['Capital income, 3 years (₹ lakh)', "'5. Summary & Ratio'!H7"], ['Capital expenditure, 3 years (₹ lakh)', "'5. Summary & Ratio'!H8"]],
  '4.2': [['Revenue coverage ratio', "'5. Summary & Ratio'!H12"], ['Band (indicative)', "'5. Summary & Ratio'!H19"],
          ['Revenue income, 3 years (₹ lakh)', "'5. Summary & Ratio'!H7"], ['Revenue expenditure, 3 years (₹ lakh)', "'5. Summary & Ratio'!H8"]],
  '4.3': [['Options met', "'6. Summary & Compliance'!D9"], ['(a) Creation of corpus', "'6. Summary & Compliance'!D7"],
          ['(b) Diversification of investments', "'6. Summary & Compliance'!D8"]],
  '4.4': [['Options fully met', "'7. Summary & Compliance'!D10"], ['(a) Internal audits', "'7. Summary & Compliance'!D7"],
          ['(b) External / statutory audits', "'7. Summary & Compliance'!D8"], ['(c) Risk management', "'7. Summary & Compliance'!D9"]],
};
function resultTone(t){
  if (/^YES|Band III|^(2 of 2|3 of 3)$/.test(t)) return 'good';
  if (/^PARTIAL|Band II|Band IV|^1 of|^2 of 3/.test(t)) return 'warn';
  if (/^NO|Band I\b|^0 of/.test(t)) return 'bad';
  return null;
}
function a4Result(wb, [label, ref]){
  // Nothing entered yet: show a neutral dash rather than "NO" or "0 of 3".
  if (!wb.entered()) return {label, shown: '—', tone: null, html: '—'};
  const {text} = wb.at(ref), tone = resultTone(text), shown = XL.blank(text) || text === '-' || text === 'Enter data' ? '—' : text;
  return {label, shown, tone, html: tone ? `<span class="pill ${tone}">${esc(shown)}</span>` : esc(shown)};
}
const a4Results = wb => A4_KEYS[wb.def.id].map(k => a4Result(wb, k))
  .map(r => `<div class="stat"><span>${esc(r.label)}</span><b>${r.html}</b></div>`).join('');

function metricCard(wb){
  const [head, ...rest] = A4_KEYS[wb.def.id].map(k => a4Result(wb, k)), n = wb.entered();
  return `<a class="mcard" href="#/a4/${wb.def.id}">
    <div class="mc-top"><b>${wb.def.id}</b><span>${wb.def.marks} marks</span></div>
    <h3>${esc(A4_SHORT[wb.def.id])}</h3>
    <div class="mc-head"><span>${esc(head.label)}</span><b>${head.html}</b></div>
    <ul>${rest.map(r => `<li><span>${esc(r.label)}</span>${r.tone ? `<i class="dot ${r.tone}"></i>` : `<b>${esc(r.shown)}</b>`}</li>`).join('')}</ul>
    <div class="mc-foot">${wb.isSample ? pill('Sample data', 'info') : n ? `${n} cell${n === 1 ? '' : 's'} filled` : 'Not started'}<span>Open →</span></div></a>`;
}

/* ---------- one metric ---------- */
const HELP_SHEETS = /cover|guidelines|worked example/i;
const sheetLabel = s => s.name.replace(/^\d+\.\s*/, '');
function a4Tabs(wb){
  const help = wb.def.sheets.map((s, i) => i).filter(i => HELP_SHEETS.test(wb.def.sheets[i].name));
  return [...wb.def.sheets.map((s, i) => ({key: String(i), label: sheetLabel(s), sheets: [i], input: wb.inputs.some(x => x.si === i)}))
    .filter(t => !help.includes(t.sheets[0])), {key: 'help', label: 'How to fill this', sheets: help}];
}
function a4Tab(wb, sub){
  const tabs = a4Tabs(wb);
  return tabs.find(t => t.key === sub) || tabs.find(t => t.input);
}

let A4_FLASH = null;
function ensureWorkbookCss(wb){
  const id = 'xlcss-' + wb.def.id;
  if (!document.getElementById(id)) document.head.appendChild(Object.assign(document.createElement('style'), {id, textContent: workbookCss(wb)}));
}

function metricPage(wb, sub){
  const d = wb.def, tab = a4Tab(wb, sub);
  const flash = A4_FLASH && A4_FLASH.id === d.id ? A4_FLASH
    : wb.isSample ? {tone: 'info', html: '<b>Sample data.</b> These figures are made up to show how a filled workbook looks. Upload your Excel to replace them, or clear them from the ⋯ menu.'} : null;
  ensureWorkbookCss(wb);
  A4_FLASH = null;
  return `<nav class="mnav" aria-label="Attribute 4 metrics"><a href="#/">All metrics</a>${A4.map(w => `<a class="${w === wb ? 'on' : ''}" href="#/a4/${w.def.id}">${w.def.id} <span>${esc(A4_SHORT[w.def.id])}</span></a>`).join('')}</nav>
    <header class="mhead">
      <div><div class="eyebrow">Metric ${d.id} · ${d.marks} of ${A4_TOTAL} marks</div><h1>${esc(A4_SHORT[d.id])}</h1></div>
      <div class="actions">
        <label class="btn"><input type="file" id="a4-up" accept=".xlsx,.xlsm,.xls,.ods" hidden>Upload Excel</label>
        <button class="btn ghost" id="a4-down" type="button">Download Excel</button>
        <a class="btn ghost" href="${d.file}" download>Blank template</a>
        <details class="menu"><summary class="btn ghost" aria-label="More actions">⋯</summary><div><button id="a4-sample" class="plain" type="button">Load sample data</button><button id="a4-clear" type="button">Clear all data</button></div></details>
      </div>
    </header>
    <div id="a4-msg" class="msg ${flash ? flash.tone : ''}" ${flash ? '' : 'hidden'}>${flash ? flash.html : ''}</div>
    <div class="stats" id="a4-kpis">${a4Results(wb)}</div>
    <nav class="xltabs" aria-label="Workbook sheets">${a4Tabs(wb).map(t => `<a class="${t === tab ? 'on' : ''}${t.key === 'help' ? ' help' : ''}" href="#/a4/${d.id}/${t.key}">${esc(t.label)}</a>`).join('')}</nav>
    ${tab.input ? '<p class="hint">Type in the cream cells, or upload the filled Excel. Grey cells calculate on their own: hover one to see its formula.</p>' : ''}
    ${tab.sheets.map(si => `${tab.sheets.length > 1 ? `<h2 class="sheet-h">${esc(sheetLabel(d.sheets[si]))}</h2>` : ''}${renderSheet(wb, si)}`).join('')}`;
}

function mountMetric(wb, sub){
  const app = document.getElementById('app'), tab = a4Tab(wb, sub), msg = document.getElementById('a4-msg');
  const say = (html, tone = 'info') => { msg.className = 'msg ' + tone; msg.innerHTML = html; msg.hidden = false; };
  const update = () => { refreshFormulas(wb, app, tab.sheets[0]); document.getElementById('a4-kpis').innerHTML = a4Results(wb); };
  app.querySelectorAll('[data-k]').forEach(el => {
    const inp = wb.inputs.find(i => Workbook.k(i.si, i.r, i.c) === el.dataset.k);
    el.addEventListener(el.tagName === 'SELECT' || el.type === 'date' ? 'change' : 'input', () => {
      let v = el.value;
      if (el.type === 'date') v = v ? parseDate(v) : null;
      else if (inp.spec.t === 'num' || inp.spec.t === 'int') {
        let bad = false;
        v = coerce(v, inp.spec, () => { bad = true; });
        el.classList.toggle('bad', bad && v === undefined);
        if (v === undefined) return;
      } else v = v === '' ? null : v;
      wb.set(el.dataset.k, v);
      update();
    });
  });
  document.getElementById('a4-up').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    say('Reading ' + esc(f.name) + '…');
    try {
      const rep = await wb.importFile(f);
      const warn = rep.warnings.length ? `<details><summary>${rep.warnings.length} cell${rep.warnings.length === 1 ? '' : 's'} to check</summary><ul>${rep.warnings.slice(0, 40).map(w => `<li>${esc(w)}</li>`).join('')}</ul></details>` : '';
      const miss = rep.missing.length ? `<p>Sheets not found in the file: ${rep.missing.map(esc).join(', ')}.</p>` : '';
      A4_FLASH = {id: wb.def.id, tone: rep.warnings.length || rep.missing.length ? 'warn' : 'good',
        html: `<b>Loaded ${esc(f.name)}.</b> ${rep.filled} cell${rep.filled === 1 ? '' : 's'} filled.${miss}${warn}`};
      render();
    } catch(err) { say(esc(err.message), 'bad'); }
    e.target.value = '';
  };
  document.getElementById('a4-down').onclick = async () => {
    say('Preparing the workbook…');
    try { await wb.exportFile(); say('Downloaded. The formulas recalculate when you open it in Excel or Google Sheets.', 'good'); }
    catch(err) { say(esc(err.message), 'bad'); }
  };
  document.getElementById('a4-sample').onclick = () => {
    if (wb.entered() && !wb.isSample && !confirm(`Replace the data entered for Metric ${wb.def.id} with sample figures?`)) return;
    wb.loadSample();
    render();
  };
  document.getElementById('a4-clear').onclick = () => {
    if (!confirm(`Clear every value entered for Metric ${wb.def.id}? This cannot be undone.`)) return;
    wb.clear();
    A4_FLASH = {id: wb.def.id, tone: 'info', html: 'All data for this metric was cleared.'};
    render();
  };
}
