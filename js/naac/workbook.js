/* One NAAC metric workbook on the site: the inputs people type or upload,
   the template's own formulas rerun over them, each sheet drawn as a grid,
   and the Excel file read in or written back out. */

class Workbook {
  constructor(def){
    this.def = def;
    this.key = 'naac-wb-' + def.id;
    this.byName = new Map(def.sheets.map((s, i) => [s.name.toLowerCase(), i]));
    this.grid = def.sheets.map(s => new Map(s.cells.map(c => [c[0] * 1000 + c[1], c])));
    this.inputs = [];
    def.sheets.forEach((s, si) => s.cells.forEach(c => { if (c[6]) this.inputs.push({si, r: c[0], c: c[1], spec: c[6], dflt: c[2]}); }));
    this.asts = new Map();
    this.cache = new Map();
    this.values = {};
    try { this.values = JSON.parse(localStorage.getItem(this.key) || '{}'); } catch(e){}
  }

  static k(si, r, c){ return si + '!' + r + ',' + c; }
  cellDef(si, r, c){ return this.grid[si].get(r * 1000 + c); }
  sheetIndex(name){ return this.byName.get(String(name).toLowerCase()); }

  value(si, r, c){
    const d = this.cellDef(si, r, c);
    if (!d) return null;
    if (d[6]) { const k = Workbook.k(si, r, c); return k in this.values ? this.values[k] : d[2]; }
    if (d[3] == null) return d[2];
    const key = Workbook.k(si, r, c);
    if (this.cache.has(key)) return this.cache.get(key);
    this.cache.set(key, XL.ERR.circ);
    let v;
    try {
      if (!this.asts.has(key)) this.asts.set(key, XL.parse(d[3]));
      v = XL.evaluate(this.asts.get(key), {sheet: this.def.sheets[si].name, cell: (sh, rr, cc) => {
        const i = this.sheetIndex(sh);
        return i === undefined ? XL.ERR.ref : this.value(i, rr, cc);
      }});
      if (v && v.range) v = XL.ERR.value;
    } catch(e) { console.warn(this.def.id, this.def.sheets[si].name, d[3], e); v = XL.ERR.value; }
    this.cache.set(key, v);
    return v;
  }
  display(si, r, c){
    const d = this.cellDef(si, r, c);
    return d ? brandText(XL.format(this.value(si, r, c), this.def.fmts[d[5]])) : '';
  }
  // A cell named the way formulas name it: "'5. Summary & Ratio'!H12"
  at(ref){
    const m = /^'(.+)'!([A-Z]+)(\d+)$/.exec(ref);
    const si = this.sheetIndex(m[1]), r = +m[3], c = XL.colNum(m[2]);
    return {si, r, c, value: this.value(si, r, c), text: this.display(si, r, c)};
  }

  set(k, v){
    const inp = this.inputs.find(i => Workbook.k(i.si, i.r, i.c) === k);
    if (XL.blank(v) && XL.blank(inp && inp.dflt)) delete this.values[k];
    else this.values[k] = v;
    this.cache.clear();
    this.save();
  }
  save(){ try { localStorage.setItem(this.key, JSON.stringify(this.values)); } catch(e){} }
  clear(){ this.values = {}; this.cache.clear(); this.save(); this.markSample(false); }

  // Illustrative figures from js/naac/sample.js, flagged so the page can say so.
  loadSample(){ this.values = {...SAMPLE[this.def.id]}; this.cache.clear(); this.save(); this.markSample(true); }
  get isSample(){ try { return localStorage.getItem(this.key + '-sample') === '1'; } catch(e){ return false; } }
  markSample(on){ try { on ? localStorage.setItem(this.key + '-sample', '1') : localStorage.removeItem(this.key + '-sample'); } catch(e){} }
  entered(){ return this.inputs.filter(i => { const k = Workbook.k(i.si, i.r, i.c); return k in this.values && !XL.blank(this.values[k]) && this.values[k] !== i.dflt; }).length; }

  /* ---------- reading a filled Excel file ---------- */
  async importFile(file){
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
    const book = XLSX.read(await file.arrayBuffer(), {type: 'array'});
    const names = new Map(book.SheetNames.map(n => [n.trim().toLowerCase(), n]));
    const wanted = this.def.sheets.filter((s, si) => this.inputs.some(i => i.si === si));
    const found = wanted.filter(s => names.has(s.name.toLowerCase()));
    if (!found.length) {
      // Name the metric only when every sheet it has inputs on is in the file.
      const other = WORKBOOKS.find(d => d.id !== this.def.id
        && d.sheets.filter(s => s.cells.some(c => c[6])).every(s => names.has(s.name.toLowerCase())));
      throw new Error(other ? `This is the Metric ${other.id} workbook. Upload it on the ${other.id} page.`
        : `This file doesn't match the Metric ${this.def.id} template: it has no sheet named “${wanted[0].name}”.`);
    }
    const report = {filled: 0, warnings: [], missing: wanted.filter(s => !found.includes(s)).map(s => s.name)};
    const vals = {};
    this.def.sheets.forEach((s, si) => {
      const ws = book.Sheets[names.get(s.name.toLowerCase())];
      if (!ws) return;
      // Rows are matched by the code in column B, so inserted or deleted rows don't shift data.
      const codeRows = new Map(), range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      for (let r = range.s.r; r <= range.e.r; r++) {
        const cell = ws[XLSX.utils.encode_cell({r, c: 1})];
        if (!cell || XL.blank(cell.v)) continue;
        const code = XL.str(cell.v).trim();
        codeRows.set(code, codeRows.has(code) ? -1 : r + 1);
      }
      for (const inp of this.inputs.filter(i => i.si === si)) {
        const code = this.cellDef(si, inp.r, 2);
        const row = code && codeRows.get(XL.str(code[2]).trim()) > 0 ? codeRows.get(XL.str(code[2]).trim()) : inp.r;
        const cell = ws[XLSX.utils.encode_cell({r: row - 1, c: inp.c - 1})];
        const where = `${s.name} ${XL.colName(inp.c)}${row}`;
        const v = coerce(cell ? cell.v : null, inp.spec, msg => report.warnings.push(`${where}: ${msg}`));
        if (v === undefined) continue;
        vals[Workbook.k(si, inp.r, inp.c)] = v;
        if (!XL.blank(v) && v !== inp.dflt) report.filled++;
      }
    });
    this.values = vals;
    this.cache.clear();
    this.save();
    this.markSample(false);
    return report;
  }

  /* ---------- writing the template back out with the data in it ---------- */
  async exportFile(){
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    const res = await fetch(this.def.file);
    if (!res.ok) throw new Error('Could not load the template file (' + res.status + ').');
    const zip = await JSZip.loadAsync(await res.arrayBuffer());
    const xml = async p => new DOMParser().parseFromString(await zip.file(p).async('string'), 'application/xml');
    const out = (p, doc) => zip.file(p, new XMLSerializer().serializeToString(doc));
    const wbDoc = await xml('xl/workbook.xml'), rels = await xml('xl/_rels/workbook.xml.rels');
    const target = {};
    for (const r of rels.getElementsByTagName('Relationship')) target[r.getAttribute('Id')] = r.getAttribute('Target').replace(/^\/?(xl\/)?/, 'xl/');
    const paths = {};
    for (const s of wbDoc.getElementsByTagName('sheet')) {
      const rid = s.getAttribute('r:id') || s.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
      paths[s.getAttribute('name').toLowerCase()] = target[rid];
    }
    for (const [si, s] of this.def.sheets.entries()) {
      const path = paths[s.name.toLowerCase()];
      if (!path) continue;
      const doc = await xml(path), ns = doc.documentElement.namespaceURI;
      const cells = new Map([...doc.getElementsByTagName('c')].map(c => [c.getAttribute('r'), c]));
      for (const inp of this.inputs.filter(i => i.si === si)) {
        const ref = XL.colName(inp.c) + inp.r;
        const el = cells.get(ref) || addCell(doc, ns, inp.r, ref);
        const v = this.value(si, inp.r, inp.c);
        while (el.firstChild) el.removeChild(el.firstChild);
        el.removeAttribute('t');
        if (XL.blank(v)) continue;
        if (typeof v === 'number') { el.appendChild(doc.createElementNS(ns, 'v')).textContent = String(v); }
        else {
          el.setAttribute('t', 'inlineStr');
          const t = el.appendChild(doc.createElementNS(ns, 'is')).appendChild(doc.createElementNS(ns, 't'));
          t.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
          t.textContent = String(v);
        }
      }
      // Drop cached formula results so Excel recalculates on open.
      for (const c of doc.getElementsByTagName('c')) {
        if (c.getElementsByTagName('f').length) for (const v of [...c.getElementsByTagName('v')]) c.removeChild(v);
      }
      out(path, doc);
    }
    let calc = wbDoc.getElementsByTagName('calcPr')[0];
    if (!calc) calc = wbDoc.documentElement.appendChild(wbDoc.createElementNS(wbDoc.documentElement.namespaceURI, 'calcPr'));
    calc.setAttribute('fullCalcOnLoad', '1');
    out('xl/workbook.xml', wbDoc);
    if (zip.file('xl/sharedStrings.xml')) {
      const ss = await zip.file('xl/sharedStrings.xml').async('string');
      zip.file('xl/sharedStrings.xml', brandText(ss, true));
    }
    const blob = await zip.generateAsync({type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const name = this.def.file.split('/').pop().replace('.xlsx', (THEME.short || THEME.name) ? '_' + (THEME.short || THEME.name).replace(/[^\w-]+/g, '_') + '.xlsx' : '_filled.xlsx');
    const a = Object.assign(document.createElement('a'), {href: URL.createObjectURL(blob), download: name});
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
}

function addCell(doc, ns, r, ref){
  const data = doc.getElementsByTagName('sheetData')[0];
  let row = [...data.getElementsByTagName('row')].find(x => +x.getAttribute('r') === r);
  if (!row) {
    row = doc.createElementNS(ns, 'row'); row.setAttribute('r', r);
    const after = [...data.getElementsByTagName('row')].find(x => +x.getAttribute('r') > r);
    data.insertBefore(row, after || null);
  }
  const c = doc.createElementNS(ns, 'c'); c.setAttribute('r', ref);
  const col = XL.colNum(ref.replace(/\d+/, ''));
  const after = [...row.getElementsByTagName('c')].find(x => XL.colNum(x.getAttribute('r').replace(/\d+/, '')) > col);
  row.insertBefore(c, after || null);
  return c;
}

// An uploaded or typed value, turned into what the input expects.
// Returns undefined to skip the cell (after warning), null for blank.
function coerce(v, spec, warn){
  if (XL.blank(v)) return null;
  if (typeof v === 'string') v = v.trim();
  if (XL.blank(v)) return null;
  switch (spec.t) {
    case 'num': case 'int': {
      const n = typeof v === 'number' ? v : Number(String(v).replace(/[,\s₹]/g, '').replace(/^\((.*)\)$/, '-$1'));
      if (typeof v === 'string' && /^-$/.test(v)) return null;
      if (isNaN(n)) { warn(`“${v}” is not a number, left blank`); return undefined; }
      if (n < 0) warn(`negative value ${n}`);
      return spec.t === 'int' ? Math.round(n) : n;
    }
    case 'date': {
      if (typeof v === 'number') return Math.round(v);
      const d = parseDate(String(v));
      if (d === null) { warn(`“${v}” is not a date, left blank`); return undefined; }
      return d;
    }
    case 'list': {
      const hit = spec.o.find(o => o.toLowerCase() === String(v).toLowerCase());
      if (!hit) warn(`“${v}” is not one of: ${spec.o.join(', ')}`);
      return hit || String(v);
    }
    default: return typeof v === 'number' ? v : String(v);
  }
}
function parseDate(s){
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s) || null, y, mo, d;
  if (m) [y, mo, d] = [+m[1], +m[2], +m[3]];
  else if ((m = /^(\d{1,2})[-/. ](\d{1,2}|[A-Za-z]{3})[-/. ](\d{4})$/.exec(s))) {
    d = +m[1]; y = +m[3];
    mo = /\d/.test(m[2]) ? +m[2] : ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[2].toLowerCase()) + 1;
  } else return null;
  if (!mo || mo > 12 || d > 31) return null;
  return Math.round((Date.UTC(y, mo - 1, d) - Date.UTC(1899, 11, 30)) / 864e5);
}
const serialToISO = n => new Date(Date.UTC(1899, 11, 30) + n * 864e5).toISOString().slice(0, 10);

const loaded = {};
function loadScript(src){
  return loaded[src] || (loaded[src] = new Promise((ok, fail) => {
    const s = Object.assign(document.createElement('script'), {src, onload: ok, onerror: () => { delete loaded[src]; fail(new Error('Could not load ' + src.split('/').slice(-3, -1).join(' ') + '. Check the internet connection.')); }});
    document.head.appendChild(s);
  }));
}

/* ---------- drawing a sheet ---------- */
const XL_THEMED = {'1F3864': 'var(--navy)', 'C9A227': 'var(--gold)'};
function workbookCss(wb){
  const pt = sz => Math.round(8.5 + (sz || 10) * 0.45);
  return wb.def.styles.map((s, i) => {
    const css = [];
    if (s.bg) css.push('background:' + (XL_THEMED[s.bg] || '#' + s.bg));
    if (s.fg && s.fg !== '000000') css.push('color:' + (XL_THEMED[s.fg] || '#' + s.fg));
    if (s.b) css.push('font-weight:700');
    if (s.i) css.push('font-style:italic');
    if (s.sz && s.sz !== 10 && s.sz !== 11) css.push('font-size:' + pt(s.sz) + 'px');
    if (s.al) css.push('text-align:' + (s.al === 'centerContinuous' ? 'center' : s.al === 'general' ? 'left' : s.al));
    return `.xl-${wb.def.id.replace('.', '')} .s${i}{${css.join(';')}}`;
  }).join('\n');
}

function renderSheet(wb, si){
  const S = wb.def.sheets[si], first = 2, last = S.maxCol, ncol = last - first + 1;
  const span = new Map(), covered = new Set();
  for (const [r1, c1, r2, c2] of S.merges) {
    span.set(r1 * 1000 + c1, [r2 - r1 + 1, Math.min(c2, last) - Math.max(c1, first) + 1]);
    for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) if (r !== r1 || c !== c1) covered.add(r * 1000 + c);
  }
  const charts = new Map(S.charts.map(ch => [ch.r1, ch]));
  const px = c => { const w = S.widths[XL.colName(c)]; return Math.round((w || 13) * 7 + 5); };
  let html = `<colgroup>${Array.from({length: ncol}, (_, i) => `<col style="width:${px(first + i)}px">`).join('')}</colgroup>`;
  for (let r = 1; r <= S.maxRow; r++) {
    if (charts.has(r)) {
      const ch = charts.get(r);
      html += `<tr><td class="xchart" colspan="${ncol}">${sheetChart(wb, si, ch)}</td></tr>`;
      r = ch.r2;
      continue;
    }
    let row = '', any = false;
    for (let c = first; c <= last; c++) {
      if (covered.has(r * 1000 + c)) continue;
      const d = wb.cellDef(si, r, c), sp = span.get(r * 1000 + c);
      const attrs = sp ? `${sp[0] > 1 ? ` rowspan="${sp[0]}"` : ''}${sp[1] > 1 ? ` colspan="${sp[1]}"` : ''}` : '';
      if (!d) { row += `<td${attrs}></td>`; continue; }
      any = true;
      row += cellHtml(wb, si, d, attrs);
    }
    html += `<tr${any ? '' : ' class="blank"'}>${row}</tr>`;
  }
  return `<div class="xlwrap"><table class="xl xl-${wb.def.id.replace('.', '')}">${html}</table></div>`;
}

function cellHtml(wb, si, d, attrs){
  const [r, c, v, f, st, fm, spec] = d;
  const k = Workbook.k(si, r, c);
  if (spec) {
    const val = wb.value(si, r, c), aria = `aria-label="${esc(wb.def.sheets[si].name + ' ' + XL.colName(c) + r)}"`;
    let ctl;
    if (spec.t === 'list') ctl = `<select data-k="${k}" ${aria}><option value=""></option>${spec.o.map(o => `<option${o === val ? ' selected' : ''}>${esc(o)}</option>`).join('')}${!XL.blank(val) && !spec.o.includes(val) ? `<option selected>${esc(val)}</option>` : ''}</select>`;
    else if (spec.t === 'date') ctl = `<input type="date" data-k="${k}" ${aria} value="${typeof val === 'number' ? serialToISO(val) : ''}">`;
    else ctl = `<input type="text" data-k="${k}" data-t="${spec.t}" ${aria}${spec.t !== 'text' ? ' inputmode="decimal"' : ''} value="${XL.blank(val) ? '' : esc(val)}">`;
    return `<td class="s${st} in"${attrs}>${ctl}</td>`;
  }
  if (f != null) {
    const val = wb.value(si, r, c);
    return `<td class="s${st} fx${typeof val === 'number' ? ' n' : ''}"${attrs} data-fx="${k}" title="=${esc(f)}">${esc(wb.display(si, r, c))}</td>`;
  }
  return `<td class="s${st}${typeof v === 'number' ? ' n' : ''}"${attrs}>${esc(typeof v === 'number' ? XL.format(v, wb.def.fmts[fm]) : brandText(String(v ?? '')))}</td>`;
}

function sheetChart(wb, si, ch){
  // Series point at a row of four FY cells; the FY labels sit in the nearest header row above.
  const series = ch.series.map(s => {
    const m = /!\$?([A-Z]+)\$?(\d+):\$?([A-Z]+)\$?(\d+)/.exec(s.ref), r = +m[2], c1 = XL.colNum(m[1]), c2 = XL.colNum(m[3]);
    const vals = []; for (let c = c1; c <= c2; c++) { const x = wb.value(si, r, c); vals.push(typeof x === 'number' ? x : 0); }
    return {name: s.name.replace(/^"|"$/g, ''), r, c1, c2, vals};
  });
  const {r, c1, c2} = series[0];
  let cats = [];
  for (let hr = r - 1; hr > 0 && !cats.length; hr--) {
    const row = []; for (let c = c1; c <= c2; c++) { const x = wb.value(si, hr, c); row.push(typeof x === 'string' ? x.split('\n')[0] : ''); }
    if (row.every(x => /^FY/.test(x))) cats = row;
  }
  const pct = /%/.test(ch.title || '');
  return barChart(ch.title, cats, series, pct);
}

function barChart(title, cats, series, pct){
  const W = 640, H = 260, L = 56, B = 34, T = 16, n = cats.length || series[0].vals.length;
  const max = Math.max(pct ? 1 : 0, ...series.flatMap(s => s.vals)) || 1;
  const nice = (() => { const p = Math.pow(10, Math.floor(Math.log10(max))); return Math.ceil(max / p / (max / p > 5 ? 2 : 1)) * p * (max / p > 5 ? 2 : 1); })();
  const y = v => T + (H - T - B) * (1 - v / nice), gw = (W - L - 10) / n, bw = Math.min(34, (gw - 16) / series.length);
  const colors = ['var(--navy)', 'var(--gold)'];
  const fmtV = v => pct ? Math.round(v * 100) + '%' : v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v * 10) / 10);
  let g = '';
  for (let i = 0; i <= 4; i++) { const v = nice * i / 4; g += `<line x1="${L}" x2="${W - 10}" y1="${y(v)}" y2="${y(v)}" class="gl"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" class="ax">${fmtV(v)}</text>`; }
  // Oldest year first, the way a trend reads.
  const order = [...Array(n).keys()].reverse();
  order.forEach((i, j) => {
    const x0 = L + j * gw + (gw - bw * series.length) / 2;
    series.forEach((s, k) => {
      const v = s.vals[i];
      g += `<rect x="${x0 + k * bw}" y="${y(v)}" width="${bw - 3}" height="${Math.max(0, y(0) - y(v))}" rx="3" fill="${colors[k % 2]}"><title>${esc(s.name)} · ${esc(cats[i] || '')}: ${pct ? (v * 100).toFixed(1) + '%' : v.toLocaleString('en-IN')}</title></rect>`;
    });
    g += `<text x="${L + j * gw + gw / 2}" y="${H - 12}" text-anchor="middle" class="ax">${esc(cats[i] || '')}</text>`;
  });
  return `<figure class="xlchart"><figcaption>${esc(title || '')}</figcaption>
    <div class="clg">${series.map((s, k) => `<span><i style="background:${colors[k % 2]}"></i>${esc(s.name)}</span>`).join('')}</div>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title || 'Chart')}">${g}</svg></figure>`;
}

// Live updates after an input changes: every formula cell on the page is refreshed in place.
function refreshFormulas(wb, root, si){
  root.querySelectorAll('[data-fx]').forEach(td => {
    const [si, rc] = td.dataset.fx.split('!'), [r, c] = rc.split(',').map(Number);
    td.textContent = wb.display(+si, r, c);
  });
  root.querySelectorAll('.xchart').forEach(td => { td.innerHTML = sheetChart(wb, si, wb.def.sheets[si].charts[0]); });
}
