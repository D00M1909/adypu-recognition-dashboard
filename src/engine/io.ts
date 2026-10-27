/* Reading a filled Excel workbook in, and writing the template back out
   with the data in it. Both libraries load only when first needed. */

import * as XL from './formula';
import type { Scalar } from './formula';
import { Workbook, DEFS, type InputSpec, type Values } from './workbook';
import { brandText, getBrand } from '../lib/brand';

export type ImportReport = { filled: number; warnings: string[]; missing: string[] };

export async function importFile(wb: Workbook, file: File): Promise<ImportReport> {
  const XLSX = await import('xlsx');
  const book = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const names = new Map(book.SheetNames.map(n => [n.trim().toLowerCase(), n]));
  const wanted = wb.def.sheets.filter((_, si) => wb.inputs.some(i => i.si === si));
  const found = wanted.filter(s => names.has(s.name.toLowerCase()));
  // Another metric's workbook, recognised when every sheet it has inputs on is in the file. Some
  // sheet names (Document Checklist, CA Certificate) are shared, so a partial match isn't enough.
  const other = found.length < wanted.length && DEFS.find(d => d.id !== wb.def.id
    && d.sheets.filter(s => s.cells.some(c => c[6])).every(s => names.has(s.name.toLowerCase())));
  if (other) throw new Error(`This is the Metric ${other.id} workbook. Upload it on the ${other.id} page.`);
  if (!found.length) throw new Error(`This file doesn't match the Metric ${wb.def.id} template: it has no sheet named “${wanted[0].name}”.`);
  const report: ImportReport = { filled: 0, warnings: [], missing: wanted.filter(s => !found.includes(s)).map(s => s.name) };
  const vals: Values = {};
  wb.def.sheets.forEach((s, si) => {
    const ws = book.Sheets[names.get(s.name.toLowerCase()) ?? ''];
    if (!ws) return;
    // Rows are matched by the code in column B, so inserted or deleted rows don't shift data.
    const codeRows = new Map<string, number>(), range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let r = range.s.r; r <= range.e.r; r++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c: 1 })];
      if (!cell || XL.blank(cell.v)) continue;
      const code = XL.str(cell.v as Scalar).trim();
      codeRows.set(code, codeRows.has(code) ? -1 : r + 1);
    }
    for (const inp of wb.inputs.filter(i => i.si === si)) {
      const code = wb.cellDef(si, inp.r, 2), hit = code ? codeRows.get(XL.str(code[2]).trim()) : undefined;
      const row = hit && hit > 0 ? hit : inp.r;
      const cell = ws[XLSX.utils.encode_cell({ r: row - 1, c: inp.c - 1 })];
      const where = `${s.name} ${XL.colName(inp.c)}${row}`;
      const v = coerce(cell ? cell.v as Scalar : null, inp.spec, msg => report.warnings.push(`${where}: ${msg}`));
      if (v === undefined) continue;
      vals[Workbook.k(si, inp.r, inp.c)] = v;
      if (!XL.blank(v) && v !== inp.dflt) report.filled++;
    }
  });
  wb.replace(vals);
  return report;
}

export async function exportFile(wb: Workbook) {
  const { default: JSZip } = await import('jszip');
  const res = await fetch(import.meta.env.BASE_URL + wb.def.file);
  if (!res.ok) throw new Error('Could not load the template file (' + res.status + ').');
  const zip = await JSZip.loadAsync(await res.arrayBuffer());
  const xml = async (p: string) => new DOMParser().parseFromString(await zip.file(p)!.async('string'), 'application/xml');
  const out = (p: string, doc: Document) => zip.file(p, new XMLSerializer().serializeToString(doc));
  const wbDoc = await xml('xl/workbook.xml'), rels = await xml('xl/_rels/workbook.xml.rels');
  const target: Record<string, string> = {};
  for (const r of rels.getElementsByTagName('Relationship')) target[r.getAttribute('Id')!] = r.getAttribute('Target')!.replace(/^\/?(xl\/)?/, 'xl/');
  const paths: Record<string, string> = {};
  for (const s of wbDoc.getElementsByTagName('sheet')) {
    const rid = s.getAttribute('r:id') || s.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
    paths[s.getAttribute('name')!.toLowerCase()] = target[rid!];
  }
  for (const [si, s] of wb.def.sheets.entries()) {
    const path = paths[s.name.toLowerCase()];
    if (!path) continue;
    const doc = await xml(path), ns = doc.documentElement.namespaceURI;
    const cells = new Map([...doc.getElementsByTagName('c')].map(c => [c.getAttribute('r')!, c]));
    for (const inp of wb.inputs.filter(i => i.si === si)) {
      const ref = XL.colName(inp.c) + inp.r;
      const el = cells.get(ref) || addCell(doc, ns, inp.r, ref);
      const v = wb.value(si, inp.r, inp.c);
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
  const shared = zip.file('xl/sharedStrings.xml');
  if (shared) zip.file('xl/sharedStrings.xml', brandText(await shared.async('string'), true));
  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const b = getBrand(), tag = (b.short || b.name).replace(/[^\w-]+/g, '_');
  const name = wb.def.file.split('/').pop()!.replace('.xlsx', tag ? `_${tag}.xlsx` : '_filled.xlsx');
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function addCell(doc: Document, ns: string | null, r: number, ref: string) {
  const data = doc.getElementsByTagName('sheetData')[0];
  let row = [...data.getElementsByTagName('row')].find(x => +x.getAttribute('r')! === r);
  if (!row) {
    row = doc.createElementNS(ns, 'row'); row.setAttribute('r', String(r));
    const after = [...data.getElementsByTagName('row')].find(x => +x.getAttribute('r')! > r);
    data.insertBefore(row, after || null);
  }
  const c = doc.createElementNS(ns, 'c'); c.setAttribute('r', ref);
  const col = XL.colNum(ref.replace(/\d+/, ''));
  const after = [...row.getElementsByTagName('c')].find(x => XL.colNum(x.getAttribute('r')!.replace(/\d+/, '')) > col);
  row.insertBefore(c, after || null);
  return c;
}

// An uploaded or typed value, turned into what the input expects.
// Returns undefined to skip the cell (after warning), null for blank.
export function coerce(v: Scalar, spec: InputSpec, warn: (msg: string) => void): Scalar | undefined {
  if (XL.blank(v)) return null;
  if (typeof v === 'string') v = v.trim();
  if (XL.blank(v)) return null;
  switch (spec.t) {
    case 'num': case 'int': {
      if (typeof v === 'string' && /^-$/.test(v)) return null;
      const n = typeof v === 'number' ? v : Number(String(v).replace(/[,\s₹]/g, '').replace(/^\((.*)\)$/, '-$1'));
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
      const hit = spec.o!.find(o => o.toLowerCase() === String(v).toLowerCase());
      if (!hit) warn(`“${v}” is not one of: ${spec.o!.join(', ')}`);
      return hit || String(v);
    }
    default: return typeof v === 'number' ? v : String(v);
  }
}
export function parseDate(s: string): number | null {
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s), y: number, mo: number, d: number;
  if (m) [y, mo, d] = [+m[1], +m[2], +m[3]];
  else if ((m = /^(\d{1,2})[-/. ](\d{1,2}|[A-Za-z]{3})[-/. ](\d{4})$/.exec(s))) {
    d = +m[1]; y = +m[3];
    mo = /\d/.test(m[2]) ? +m[2] : ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(m[2].toLowerCase()) + 1;
  } else return null;
  if (!mo || mo > 12 || d > 31) return null;
  return Math.round((Date.UTC(y, mo - 1, d) - Date.UTC(1899, 11, 30)) / 864e5);
}
export const serialToISO = (n: number) => new Date(Date.UTC(1899, 11, 30) + n * 864e5).toISOString().slice(0, 10);
