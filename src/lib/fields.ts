/* A metric's fields: one per input row, named by its code (column B) and
   heading (column C), with how many of its required cells are filled.
   Audit reference, evidence, file name and remarks columns are optional,
   and a template's placeholder ("Pending", prompt text, example risks)
   doesn't count as filled until someone changes it. */

import * as XL from '../engine/formula';
import { Workbook } from '../engine/workbook';

export type Field = { si: number; r: number; code: string; label: string; section: string; filled: number; total: number };
export type FieldStatus = 'done' | 'partial' | 'empty';
export type SheetFields = { si: number; name: string; fields: Field[] };

const OPTIONAL = /remark|reference|evidence|file name/i;
const SECTION_SKIP = /^(sub-?total|total|net|grand|code|#|s\.? ?no)/i;

type Shape = { si: number; name: string; rows: { r: number; code: string; label: string | null; section: string; req: number[]; first: number }[] };
const shapes = new WeakMap<Workbook, Shape[]>();

// Which rows are fields, their names and required columns: fixed per template, so worked out once.
function shape(wb: Workbook): Shape[] {
  const hit = shapes.get(wb);
  if (hit) return hit;
  const out: Shape[] = [];
  wb.def.sheets.forEach((s, si) => {
    const ins = wb.inputs.filter(i => i.si === si);
    if (!ins.length) return;
    const top = Math.min(...ins.map(i => i.r));
    const header = (c: number) => {
      for (let r = top - 1; r > 0; r--) { const d = wb.cellDef(si, r, c); if (d && !d[6] && typeof d[2] === 'string' && d[2].trim()) return d[2]; }
      return '';
    };
    const optional = new Set([...new Set(ins.map(i => i.c))].filter(c => OPTIONAL.test(header(c))));
    const byRow = new Map<number, number[]>();
    ins.forEach(i => { if (!byRow.has(i.r)) byRow.set(i.r, []); byRow.get(i.r)!.push(i.c); });
    const text = (r: number, c: number) => { const d = wb.cellDef(si, r, c); return d && !d[6] && !XL.blank(d[2]) ? XL.str(d[2]).replace(/\s+/g, ' ').trim() : ''; };

    let section = '';
    const rows: Shape['rows'] = [];
    const last = Math.max(...byRow.keys());
    // Start a little above the first input row, where the first section's heading sits.
    for (let r = Math.max(1, top - 2); r <= last; r++) {
      const cols = byRow.get(r);
      if (!cols) {
        // A heading row inside the table, like "A  Government Grants (Capital / Non-recurring)".
        // Calculated rows (a closure %, a difference check) sit between fields but aren't headings.
        const code = text(r, 2), head = text(r, 3);
        const calc = Array.from({ length: s.maxCol }, (_, i) => wb.cellDef(si, r, i + 1)).some(d => d && d[3] != null);
        if (head && !calc && !SECTION_SKIP.test(head) && !SECTION_SKIP.test(code)) section = code ? `${code} · ${head}` : head;
        continue;
      }
      const req = cols.filter(c => !optional.has(c)).sort((a, b) => a - b);
      if (!req.length) continue;
      rows.push({ r, code: text(r, 2), label: text(r, 3) || null, section, req, first: Math.min(...cols) });
    }
    out.push({ si, name: s.name, rows });
  });
  shapes.set(wb, out);
  return out;
}

export function isFilled(wb: Workbook, si: number, r: number, c: number) {
  const k = Workbook.k(si, r, c), v = wb.values[k];
  return k in wb.values && !XL.blank(v) && v !== wb.inputAt.get(k)?.dflt;
}

export function sheetFields(wb: Workbook): SheetFields[] {
  return shape(wb).map(s => ({
    si: s.si, name: s.name,
    fields: s.rows.map(row => ({
      si: s.si, r: row.r, code: row.code, section: row.section,
      // Rows without a heading (the risk register) are named by what was typed in their first cell.
      label: row.label || XL.str(wb.value(s.si, row.r, row.first)).trim() || `Row ${row.r}`,
      filled: row.req.filter(c => isFilled(wb, s.si, row.r, c)).length,
      total: row.req.length,
    })),
  }));
}

export const statusOf = (f: Field): FieldStatus => f.filled === 0 ? 'empty' : f.filled === f.total ? 'done' : 'partial';

export function fieldCounts(wb: Workbook, si?: number) {
  const all = sheetFields(wb).filter(s => si === undefined || s.si === si).flatMap(s => s.fields);
  return { done: all.filter(f => statusOf(f) === 'done').length, partial: all.filter(f => statusOf(f) === 'partial').length, total: all.length };
}
