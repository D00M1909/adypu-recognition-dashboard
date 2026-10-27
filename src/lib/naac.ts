/* The NAAC Binary Accreditation Framework outline, and the headline results
   read off each Attribute 4 workbook's summary sheet. */

import * as XL from '../engine/formula';
import type { Workbook } from '../engine/workbook';

// Metrics for Manual, Base (draft): university weights.
export const NAAC_ATTRIBUTES = [
  { n: 1, title: 'Curriculum', group: 'Input', marks: 75, metrics: 8 },
  { n: 2, title: 'Faculty Resources', group: 'Input', marks: 50, metrics: 3 },
  { n: 3, title: 'Infrastructure', group: 'Input', marks: 50, metrics: 6 },
  { n: 4, title: 'Financial Resources & Management', group: 'Input', marks: 50, metrics: 4, live: true },
  { n: 5, title: 'Learning & Teaching', group: 'Process', marks: 125, metrics: 7 },
  { n: 6, title: 'Extended Curricular Engagements', group: 'Process', marks: 100, metrics: 6 },
  { n: 7, title: 'Governance & Administration', group: 'Process', marks: 100, metrics: 10 },
  { n: 8, title: 'Student Outcomes', group: 'Outcome', marks: 150, metrics: 4 },
  { n: 9, title: 'Research & Innovation Outcomes', group: 'Outcome', marks: 125, metrics: 7 },
  { n: 10, title: 'Sustainability Outcomes & Green Initiatives', group: 'Outcome', marks: 75, metrics: 4 },
];
export const NAAC_TOTAL = NAAC_ATTRIBUTES.reduce((s, a) => s + a.marks, 0);

export const COMING = ['NAAC attributes 1–3, 5–10', 'NIRF', 'NBA', 'QS & THE rankings', 'IIC & GreenMetric', 'Awards register'];

export const SHORT: Record<string, string> = {
  '4.1': 'Capital income vs expenditure', '4.2': 'Revenue income vs expenditure',
  '4.3': 'Financial sustainability', '4.4': 'Financial controls & risk',
};

type Key = { label: string; ref: string; money?: boolean };
export const KEYS: Record<string, Key[]> = {
  '4.1': [{ label: 'Capital utilisation ratio', ref: "'5. Summary & Ratio'!H12" }, { label: 'Band (indicative)', ref: "'5. Summary & Ratio'!H17" },
    { label: 'Capital income, 3 yrs', ref: "'5. Summary & Ratio'!H7", money: true }, { label: 'Capital expenditure, 3 yrs', ref: "'5. Summary & Ratio'!H8", money: true }],
  '4.2': [{ label: 'Revenue coverage ratio', ref: "'5. Summary & Ratio'!H12" }, { label: 'Band (indicative)', ref: "'5. Summary & Ratio'!H19" },
    { label: 'Revenue income, 3 yrs', ref: "'5. Summary & Ratio'!H7", money: true }, { label: 'Revenue expenditure, 3 yrs', ref: "'5. Summary & Ratio'!H8", money: true }],
  '4.3': [{ label: 'Options met', ref: "'6. Summary & Compliance'!D9" }, { label: '(a) Creation of corpus', ref: "'6. Summary & Compliance'!D7" },
    { label: '(b) Diversified investments', ref: "'6. Summary & Compliance'!D8" }],
  '4.4': [{ label: 'Options fully met', ref: "'7. Summary & Compliance'!D10" }, { label: '(a) Internal audits', ref: "'7. Summary & Compliance'!D7" },
    { label: '(b) External audits', ref: "'7. Summary & Compliance'!D8" }, { label: '(c) Risk management', ref: "'7. Summary & Compliance'!D9" }],
};

export type Tone = 'good' | 'warn' | 'bad' | null;
export function toneOf(t: string): Tone {
  if (/^YES|Band III|^(2 of 2|3 of 3)$/.test(t)) return 'good';
  if (/^PARTIAL|Band II|Band IV|^1 of|^2 of 3/.test(t)) return 'warn';
  if (/^NO|Band I\b|^0 of/.test(t)) return 'bad';
  return null;
}

export type Result = Key & { text: string; value: XL.Scalar; tone: Tone; empty: boolean };
export function results(wb: Workbook): Result[] {
  const any = wb.entered() > 0;
  return KEYS[wb.def.id].map(k => {
    if (!any) return { ...k, text: '—', value: null, tone: null, empty: true };
    const { text, value } = wb.at(k.ref);
    const empty = XL.blank(text) || text === '-' || text === 'Enter data';
    // "1.00x" reads as a capital X in the display serif; the times sign doesn't.
    return { ...k, text: empty ? '—' : text.replace(/(\d)x$/, '$1×'), value, tone: empty ? null : toneOf(text), empty };
  });
}
/** Where a metric stands overall: its band for the ratio metrics, else its headline. */
export function standing(wb: Workbook): Tone {
  const rs = results(wb);
  return (rs.find(r => r.label.startsWith('Band')) || rs[0]).tone;
}
/** "YES – Corpus created / strengthened" → "YES" and "Corpus created / strengthened" */
export function splitVerdict(t: string): [string, string] {
  const m = /^(YES|NO|PARTIAL)\s*[–-]\s*(.*)$/.exec(t);
  if (m) return [m[1], m[2]];
  const b = /^(Band [IV]+)\s*[–-]\s*(.*)$/.exec(t);
  return b ? [b[1], b[2]] : [t, ''];
}
