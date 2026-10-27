/* One NAAC metric workbook: the inputs people type or upload, and the
   template's own formulas rerun over them. Components subscribe to it and
   re-render when a value changes. */

import { useSyncExternalStore } from 'react';
import * as XL from './formula';
import type { Scalar, Ast } from './formula';
import { brandText } from '../lib/brand';
import { read, write } from '../lib/persist';
import WORKBOOKS from '../data/workbooks.json';
import SAMPLE from '../data/sample.json';

export type InputSpec = { t: 'num' | 'int' | 'list' | 'date' | 'text'; o?: string[] };
// [row, col, value, formula, styleIdx, fmtIdx, inputSpec?]
export type CellDef = [number, number, Scalar, string | null, number, number, InputSpec?];
export type ChartDef = { r1: number; r2: number; title: string; series: { name: string; ref: string }[] };
export type SheetDef = { name: string; widths: Record<string, number>; merges: number[][]; charts: ChartDef[]; maxCol: number; maxRow: number; cells: CellDef[] };
export type Style = { bg?: string; fg?: string; b?: boolean; i?: boolean; sz?: number; al?: string; wr?: boolean };
export type WorkbookDef = { id: string; title: string; marks: number; file: string; styles: Style[]; fmts: string[]; sheets: SheetDef[] };
export type Input = { si: number; r: number; c: number; spec: InputSpec; dflt: Scalar };
export type Values = Record<string, Scalar>;

export const DEFS = WORKBOOKS as unknown as WorkbookDef[];

export class Workbook {
  readonly def: WorkbookDef;
  readonly key: string;
  readonly inputs: Input[] = [];
  readonly inputAt = new Map<string, Input>();
  private byName: Map<string, number>;
  private grid: Map<number, CellDef>[];
  private asts = new Map<string, Ast>();
  private cache = new Map<string, Scalar>();
  private subs = new Set<() => void>();
  values: Values;
  version = 0;
  isSample: boolean;

  constructor(def: WorkbookDef) {
    this.def = def;
    this.key = 'naac-wb-' + def.id;
    this.byName = new Map(def.sheets.map((s, i) => [s.name.toLowerCase(), i]));
    this.grid = def.sheets.map(s => new Map(s.cells.map(c => [c[0] * 1000 + c[1], c])));
    def.sheets.forEach((s, si) => s.cells.forEach(c => {
      if (!c[6]) return;
      const inp = { si, r: c[0], c: c[1], spec: c[6], dflt: c[2] };
      this.inputs.push(inp);
      this.inputAt.set(Workbook.k(si, c[0], c[1]), inp);
    }));
    this.values = read<Values>(this.key, {});
    this.isSample = read<boolean>(this.key + '-sample', false);
  }

  static k(si: number, r: number, c: number) { return si + '!' + r + ',' + c; }
  cellDef(si: number, r: number, c: number) { return this.grid[si].get(r * 1000 + c); }
  sheetIndex(name: string) { return this.byName.get(String(name).toLowerCase()); }

  value(si: number, r: number, c: number): Scalar {
    const d = this.cellDef(si, r, c);
    if (!d) return null;
    if (d[6]) { const k = Workbook.k(si, r, c); return k in this.values ? this.values[k] : d[2]; }
    if (d[3] == null) return d[2];
    const key = Workbook.k(si, r, c);
    if (this.cache.has(key)) return this.cache.get(key);
    this.cache.set(key, XL.ERR.circ);
    let v: Scalar;
    try {
      if (!this.asts.has(key)) this.asts.set(key, XL.parse(d[3]));
      const out = XL.evaluate(this.asts.get(key)!, {
        sheet: this.def.sheets[si].name,
        cell: (sh, rr, cc) => { const i = this.sheetIndex(sh); return i === undefined ? XL.ERR.ref : this.value(i, rr, cc); },
      });
      v = out && typeof out === 'object' && 'range' in out ? XL.ERR.value : out as Scalar;
    } catch (e) { console.warn(this.def.id, this.def.sheets[si].name, d[3], e); v = XL.ERR.value; }
    this.cache.set(key, v);
    return v;
  }
  display(si: number, r: number, c: number) {
    const d = this.cellDef(si, r, c);
    return d ? brandText(XL.format(this.value(si, r, c), this.def.fmts[d[5]])) : '';
  }
  // A cell named the way formulas name it: "'5. Summary & Ratio'!H12"
  at(ref: string) {
    const m = /^'(.+)'!([A-Z]+)(\d+)$/.exec(ref)!;
    const si = this.sheetIndex(m[1])!, r = +m[3], c = XL.colNum(m[2]);
    return { si, r, c, value: this.value(si, r, c), text: this.display(si, r, c) };
  }

  /* ---------- changes ---------- */
  subscribe = (f: () => void) => { this.subs.add(f); return () => { this.subs.delete(f); }; };
  private changed() {
    this.cache.clear();
    this.version++;
    write(this.key, this.values);
    this.subs.forEach(f => f());
  }
  private markSample(on: boolean) { this.isSample = on; write(this.key + '-sample', on || null); }

  set(k: string, v: Scalar) {
    const inp = this.inputAt.get(k);
    if (XL.blank(v) && XL.blank(inp?.dflt)) delete this.values[k];
    else this.values[k] = v;
    this.changed();
  }
  replace(values: Values, sample = false) { this.values = values; this.markSample(sample); this.changed(); }
  clear() { this.replace({}); }
  loadSample() { this.replace({ ...(SAMPLE as Record<string, Values>)[this.def.id] }, true); }

  entered(si?: number) {
    return this.inputs.filter(i => {
      if (si !== undefined && i.si !== si) return false;
      const k = Workbook.k(i.si, i.r, i.c);
      return k in this.values && !XL.blank(this.values[k]) && this.values[k] !== i.dflt;
    }).length;
  }
  inputCount(si?: number) { return si === undefined ? this.inputs.length : this.inputs.filter(i => i.si === si).length; }
}

export const WORKBOOK_LIST = DEFS.map(d => new Workbook(d));
export const workbookById = (id?: string) => WORKBOOK_LIST.find(w => w.def.id === id);

/** Re-render when this workbook's values change; returns its version. */
export const useWorkbook = (wb: Workbook) => useSyncExternalStore(wb.subscribe, () => wb.version);
/** Re-render when any workbook changes. */
export function useAllWorkbooks() {
  return useSyncExternalStore(
    f => { const offs = WORKBOOK_LIST.map(w => w.subscribe(f)); return () => offs.forEach(o => o()); },
    () => WORKBOOK_LIST.reduce((s, w) => s + w.version, 0),
  );
}

/* ---------- chart data, read from the sheet the way Excel draws it ---------- */
export type ChartData = { title: string; cats: string[]; series: { name: string; vals: number[] }[]; pct: boolean };
export function chartData(wb: Workbook, si: number, ch: ChartDef): ChartData {
  // Series point at a row of FY cells; the FY labels sit in the nearest header row above.
  const series = ch.series.map(s => {
    const m = /!\$?([A-Z]+)\$?(\d+):\$?([A-Z]+)\$?(\d+)/.exec(s.ref)!, r = +m[2], c1 = XL.colNum(m[1]), c2 = XL.colNum(m[3]);
    const vals: number[] = [];
    for (let c = c1; c <= c2; c++) { const x = wb.value(si, r, c); vals.push(typeof x === 'number' ? x : 0); }
    return { name: s.name.replace(/^"|"$/g, ''), r, c1, c2, vals };
  });
  const { r, c1, c2 } = series[0];
  let cats: string[] = [];
  for (let hr = r - 1; hr > 0 && !cats.length; hr--) {
    const row: string[] = [];
    for (let c = c1; c <= c2; c++) { const x = wb.value(si, hr, c); row.push(typeof x === 'string' ? x.split('\n')[0] : ''); }
    if (row.every(x => /^FY/.test(x))) cats = row;
  }
  // Oldest year first, the way a trend reads.
  return {
    title: ch.title || '', pct: /%/.test(ch.title || ''),
    cats: [...cats].reverse(),
    series: series.map(s => ({ name: s.name, vals: [...s.vals].reverse() })),
  };
}
export function summaryChart(wb: Workbook) {
  const si = wb.def.sheets.findIndex(s => s.charts.length);
  return si < 0 ? null : chartData(wb, si, wb.def.sheets[si].charts[0]);
}
