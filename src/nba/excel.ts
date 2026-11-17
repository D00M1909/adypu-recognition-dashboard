/* Criterion 3 in and out of Excel.

   Reading accepts the department's own CO–PO attainment workbook (one sheet
   per course: a mark sheet, the COs each assessment tests, the CO–PO/PSO
   mapping, plus a Configuration sheet) and the templates this site hands out,
   which use the same layout. Cells are found by their labels, not by fixed
   addresses, so moved columns and extra rows don't matter.

   Writing produces blank templates, filled sample files and a full export. */

import { getBrand } from '../lib/brand';
import {
  N_OUT, OUT_CODES, STATUS_LABEL, courseResult, emptyCounts, emptyRow, mean, newCourse, programResult, rowPct, semNo, stateForYear, statusOf, uid, yearsOf,
  type Assessment, type Config, type Course, type Kind, type Mark, type NbaState, type Student, type Survey,
} from './model';

type Cell = string | number | boolean | null;
type Rows = Cell[][];
const XLSX = () => import('xlsx');

const txt = (v: Cell | undefined) => (v == null ? '' : String(v).replace(/\s+/g, ' ').trim());
const numOf = (v: Cell | undefined): number | null => {
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const s = txt(v).replace(/[,%\s]/g, '');
  if (!s || isNaN(+s)) return null;
  return +s;
};
const isCO = (v: Cell | undefined) => /^CO\s*-?\d+$/i.test(txt(v));
const coNo = (v: Cell | undefined) => +txt(v).replace(/\D/g, '');

export function guessKind(name: string): Kind {
  if (/feedback|exit|survey/i.test(name)) return 'feedback';
  if (/mock/i.test(name)) return 'internal';
  if (/theory|university|end.?sem|in.?sem|term ?work|\bTW\b|practical|oral|\bese\b|external/i.test(name)) return 'external';
  return 'internal';
}

/* ---------- reading ---------- */
const LABELS = /^(code|subject name.*|course name|academic year|subject faculty|faculty|semester|sem|class|course type|co target)$/i;

function labelValue(rows: Rows, upto: number, re: RegExp): Cell | undefined {
  for (let r = 0; r < Math.min(upto, rows.length); r++) {
    const row = rows[r] || [];
    for (let c = 0; c < row.length; c++) {
      if (!re.test(txt(row[c]))) continue;
      for (let k = c + 1; k < Math.min(row.length, c + 6); k++) {
        const v = txt(row[k]);
        if (!v) continue;
        if (LABELS.test(v)) break;
        return row[k];
      }
    }
  }
}

export type SheetReport = { sheet: string; code: string; students: number; assessments: number; cos: number; notes: string[] };

/** One course out of a sheet, or null when the sheet isn't a course mark sheet. */
export function parseCourseSheet(rows: Rows, sheet: string): { course: Course; report: SheetReport } | null {
  const h = rows.findIndex(r => (r || []).some(c => /seat\s*no/i.test(txt(c))));
  if (h < 0) return null;
  const notes: string[] = [];
  const head = rows[h];
  const seatHead = head.findIndex(c => /seat\s*no/i.test(txt(c)));
  const nameHead = head.findIndex(c => /name/i.test(txt(c)));
  const firstA = Math.max(seatHead, nameHead) + 1;
  let lastA = head.length - 1;
  while (lastA >= firstA && !txt(head[lastA])) lastA--;

  // Max marks and (on this site's templates) the type of each assessment sit under the header.
  let r = h + 1;
  const maxRow = (rows[r] || []).slice(0, firstA).some(c => /max/i.test(txt(c))) ? rows[r++] : null;
  const typeRow = (rows[r] || []).slice(0, firstA).some(c => /type/i.test(txt(c))) ? rows[r++] : null;

  // Seat numbers and names: some sheets swap the two columns under their headings, so look at the data.
  const startStudents = r;
  const studentRows: Rows = [];
  for (; r < rows.length; r++) {
    const row = rows[r] || [];
    const lead = txt(row[0]);
    if (/^note|marks\s*[<>=]|total|^\(?[A-D]\)?$/i.test(lead) || isCO(lead)) break;
    if (row.slice(0, firstA).every(c => !txt(c)) && row.slice(firstA).every(c => !txt(c))) {
      // Numbered but empty rows (S.No only) and blank gaps both end up here; stop after a long gap.
      if (rows.slice(r, r + 25).every(rr => (rr || []).slice(1).every(c => !txt(c)))) break;
      continue;
    }
    if (row.slice(1, firstA).every(c => !txt(c))) continue;
    studentRows.push(row);
  }
  const looksSeat = (v: Cell) => /^[A-Z]{0,4}\d{4,}[A-Z0-9]*$/i.test(txt(v).replace(/\s/g, '')) && !/\s/.test(txt(v));
  const idCols = Array.from({ length: firstA }, (_, i) => i).filter(i => i !== 0 || seatHead === 0 || nameHead === 0);
  const seatCol = idCols.map(c => ({ c, n: studentRows.filter(s => looksSeat(s[c])).length })).sort((a, b) => b.n - a.n)[0]?.c ?? seatHead;
  const nameCol = [nameHead, seatHead, ...idCols].find(c => c !== seatCol && c >= 0 && c < firstA && studentRows.some(s => /[a-z]{2}/i.test(txt(s[c])) && !looksSeat(s[c]))) ?? nameHead;

  const all: (Assessment & { col: number })[] = [];
  for (let c = firstA; c <= lastA; c++) {
    const name = txt(head[c]);
    if (!name) continue;
    const t = txt(typeRow?.[c]).toLowerCase();
    const kind: Kind = /feed|indirect/.test(t) ? 'feedback' : /ext/.test(t) ? 'external' : /int/.test(t) ? 'internal' : guessKind(name);
    all.push({ id: uid(), name, kind, max: numOf(maxRow?.[c]), counts: emptyCounts(), col: c });
  }

  // Result counts (A)…(T), used when there are no student marks.
  const countRow = (re: RegExp) => rows.slice(startStudents).find(rw => (rw || []).slice(0, firstA).some(c => re.test(txt(c))));
  const rowsAT = { a: countRow(/^\(A\)$/), b: countRow(/^\(B\)$/), c: countRow(/^\(C\)$/), d: countRow(/^\(D\)$/), t: countRow(/^\(T\)$/) };

  const students: Student[] = studentRows.map(row => {
    const marks: Record<string, Mark> = {};
    for (const a of all) {
      const v = row[a.col];
      if (/^a\.?b\.?$|^absent$/i.test(txt(v))) marks[a.id] = 'AB';
      else { const n = numOf(v); marks[a.id] = n; if (n != null && a.max != null && n > a.max) notes.push(`${txt(row[seatCol]) || txt(row[nameCol])}: ${n} in ${a.name} is over the maximum of ${a.max}`); }
    }
    return { id: uid(), seat: txt(row[seatCol]), name: txt(row[nameCol]), marks };
  });
  for (const a of all) {
    a.counts = { a: numOf(rowsAT.a?.[a.col]), b: numOf(rowsAT.b?.[a.col]), c: numOf(rowsAT.c?.[a.col]), d: numOf(rowsAT.d?.[a.col]), t: numOf(rowsAT.t?.[a.col]) };
  }
  // Columns the course doesn't use (Mock Practical on a theory course): no maximum, no marks, no counts.
  const used = all.filter(a => a.max != null || students.some(s => s.marks[a.id] != null) || a.counts.a != null);

  // The COs each assessment tests: the first block of CO rows below the marks.
  const after = rows.slice(r);
  const mapAt = after.findIndex(rw => findMapStart(rw) >= 0);
  const coverRows = after.slice(0, mapAt < 0 ? undefined : mapAt).filter(rw => isCO((rw || [])[0]));
  const uses = new Map<number, string[]>();
  for (const rw of coverRows) {
    const n = coNo(rw[0]);
    if (uses.has(n)) continue;
    uses.set(n, used.filter(a => txt(rw[a.col]) !== '' && !/^(n|no|-|0)$/i.test(txt(rw[a.col]))).map(a => a.id));
  }

  // The CO–PO/PSO mapping: a header row reading 1…12, 1…3, then one row per CO.
  const cos: Course['cos'] = [];
  if (mapAt >= 0) {
    const k = findMapStart(after[mapAt]);
    for (const rw of after.slice(mapAt + 1)) {
      if (!isCO((rw || [])[0])) { if (cos.length) break; continue; }
      const n = coNo(rw[0]);
      const text = txt(rw[1]).replace(/^to\s+/i, '');
      const map = Array.from({ length: N_OUT }, (_, o) => { const v = numOf(rw[k + o]); return v != null && v > 0 ? Math.min(3, Math.round(v)) : null; });
      cos.push({ id: uid(), text: text ? text[0].toUpperCase() + text.slice(1) : '', map, uses: uses.get(n) ?? used.map(a => a.id) });
    }
  }
  // Spare CO rows the sheet leaves empty (no statement, no mapping, nothing tested) aren't COs.
  for (let k = cos.length - 1; k >= 0; k--) if (!cos[k].text && !cos[k].map.some(Boolean) && !cos[k].uses.length) cos.splice(k, 1);
  if (!cos.length) for (const [, u] of [...uses.entries()].sort((a, b) => a[0] - b[0])) cos.push({ id: uid(), text: '', map: Array(N_OUT).fill(null), uses: u });
  if (!cos.length) notes.push('No CO rows found: add the COs and their mapping on the site.');

  const code = txt(labelValue(rows, h, /^code$/i)) || sheet;
  const t = numOf(labelValue(rows, rows.length, /^co target$/i) ?? null);
  const type = /lab|practical/i.test(txt(labelValue(rows, h, /^course type$/i))) || (!used.some(a => /theory/i.test(a.name)) && used.some(a => /practical|term work|oral/i.test(a.name))) ? 'lab' : 'theory';
  const course: Course = {
    ...newCourse(type, code),
    name: txt(labelValue(rows, h, /^(subject name.*|course name)$/i)),
    faculty: txt(labelValue(rows, h, /^(subject )?faculty$/i)),
    year: txt(labelValue(rows, h, /^academic year$/i)),
    sem: txt(labelValue(rows, h, /^sem(ester)?$/i)),
    cls: txt(labelValue(rows, h, /^class$/i)).replace(/^Second Year.*/i, 'SE').replace(/^Third Year.*/i, 'TE').replace(/^(Final|Fourth) Year.*/i, 'BE').replace(/^First Year.*/i, 'FE'),
    coTarget: t == null ? null : t <= 1 ? Math.round(t * 1000) / 10 : t,
    assessments: used.map(({ col: _c, ...a }) => a),
    cos,
    students,
  };
  if (!students.length && !used.some(a => a.counts.a != null)) notes.push('No student marks or result counts found.');
  return { course, report: { sheet, code, students: students.length, assessments: used.length, cos: cos.length, notes } };
}

function findMapStart(row: Cell[] | undefined) {
  if (!row) return -1;
  const want = [...Array.from({ length: 12 }, (_, i) => i + 1), 1, 2, 3];
  for (let k = 0; k + N_OUT <= row.length; k++) {
    if (want.every((w, i) => numOf(row[k + i]) === w || txt(row[k + i]).toUpperCase() === OUT_CODES[i])) return k;
  }
  return -1;
}

function parseConfig(rows: Rows): { config: Partial<Config>; targets: Record<string, number> } {
  const config: Partial<Config> = {}, targets: Record<string, number> = {};
  const pc = (v: Cell) => { const n = numOf(v); return n == null ? null : n <= 1 ? n * 100 : n; };
  for (const row of rows) {
    const k = txt(row?.[0]), v = row?.[1];
    if (!k || v == null) continue;
    const set = (key: keyof Config, val: number | null) => { if (val != null) config[key] = Math.round(val * 100) / 100; };
    if (/^po target/i.test(k)) set('poTarget', pc(v));
    else if (/^co target/i.test(k)) set('coTarget', pc(v));
    else if (/internal score|\(is\)/i.test(k)) set('isW', pc(v));
    else if (/external score|\(es\)/i.test(k)) set('esW', pc(v));
    else if (/direct attainment|\(da\)/i.test(k) && !/indirect/i.test(k)) set('daW', pc(v));
    else if (/indirect|\(ia\)/i.test(k)) set('iaW', pc(v));
    else if (/criteria a/i.test(k)) set('critA', numOf(v));
    else if (/criteria b/i.test(k)) set('critB', numOf(v));
    else if (/criteria c/i.test(k)) set('critC', numOf(v));
    else if (/^low/i.test(k)) set('low', numOf(v));
    else if (/^partial/i.test(k)) set('partial', numOf(v));
    else if (/^C\d{3}/i.test(k)) { const n = pc(v); if (n != null) targets[k.toUpperCase()] = n; }
  }
  return { config, targets };
}

function parseSurveys(rows: Rows): Survey[] {
  const blocks: { mf: boolean; rows: { name: string; vals: (number | null)[] }[] }[] = [];
  let cur: (typeof blocks)[number] | null = null, k = -1;
  for (const row of rows) {
    const at = (row || []).findIndex((c, i) => txt(c).toUpperCase() === 'PO1' && txt(row[i + 12]).toUpperCase() === 'PSO1');
    if (at >= 0) { k = at; cur = { mf: (row || []).slice(0, at).some(c => /weight|factor|\bmf\b/i.test(txt(c))), rows: [] }; blocks.push(cur); continue; }
    if (!cur) continue;
    const name = txt(row?.[k - 1] ?? row?.[0]);
    if (!name) { cur = null; continue; }
    cur.rows.push({ name, vals: Array.from({ length: N_OUT }, (_, o) => numOf(row[k + o])) });
  }
  const pct = blocks.find(b => !b.mf), mf = blocks.find(b => b.mf);
  if (!pct) return [];
  return pct.rows.map(p => {
    const w = mf?.rows.find(m => m.name.toLowerCase() === p.name.toLowerCase());
    return {
      id: uid(), name: p.name, activity: /activit/i.test(p.name),
      rows: p.vals.map((v, o) => ({ ...emptyRow(), pct: v, mf: w ? w.vals[o] : v != null ? (/parent|exit/i.test(p.name) ? .5 : 1) : null })),
    };
  });
}

export type ImportResult = { courses: Course[]; reports: SheetReport[]; config: Partial<Config>; surveys: Survey[]; skipped: string[] };

export async function readWorkbook(file: File): Promise<ImportResult> {
  const X = await XLSX();
  const book = X.read(await file.arrayBuffer(), { type: 'array' });
  const out: ImportResult = { courses: [], reports: [], config: {}, surveys: [], skipped: [] };
  let targets: Record<string, number> = {};
  for (const name of book.SheetNames) {
    const rows = X.utils.sheet_to_json<Cell[]>(book.Sheets[name], { header: 1, raw: true, defval: null, blankrows: true });
    if (/^config/i.test(name)) { const c = parseConfig(rows); out.config = c.config; targets = c.targets; continue; }
    if (/survey|indirect/i.test(name)) { out.surveys.push(...parseSurveys(rows)); continue; }
    if (/^template/i.test(name)) { out.skipped.push(name); continue; }
    const got = parseCourseSheet(rows, name);
    if (!got) { out.skipped.push(name); continue; }
    // The department's file keeps a demo copy of one course; keep the sheet named after the course.
    const dup = out.courses.findIndex(c => c.code === got.course.code);
    if (dup >= 0) {
      if (got.report.sheet !== got.course.code) { out.skipped.push(name); continue; }
      out.courses.splice(dup, 1); out.reports.splice(dup, 1);
    }
    out.courses.push(got.course); out.reports.push(got.report);
  }
  for (const c of out.courses) if (c.coTarget == null && targets[c.code.toUpperCase()] != null) c.coTarget = targets[c.code.toUpperCase()];
  return out;
}

/* ---------- writing ---------- */
const KIND_LABEL: Record<Kind, string> = { internal: 'Internal', external: 'External', feedback: 'Feedback' };
const r2 = (v: number | null | undefined) => (v == null ? '' : Math.round(v * 100) / 100);

function courseRows(c: Course, cfg: Config, opts: { blank?: boolean; results?: boolean }): Rows {
  const res = courseResult(c, cfg), brand = getBrand();
  const as = c.assessments, w = as.length;
  const pad = (n: number) => Array<Cell>(n).fill('');
  const rows: Rows = [];
  rows.push([`${brand.short || brand.name || ''} · NBA Criterion 3 · Course mark sheet`.replace(/^ · /, '')]);
  rows.push(['Code', c.code, 'Subject Name & Subject Code', c.name, '', '', 'Class', c.cls, 'Course type', c.type === 'lab' ? 'Lab' : 'Theory']);
  rows.push(['Academic Year', c.year, 'Subject Faculty', c.faculty, '', '', 'Semester', c.sem, 'CO Target', c.coTarget == null ? `${cfg.coTarget}%` : `${c.coTarget}%`]);
  rows.push(['S.No', 'Seat No', 'Name of the student', ...as.map(a => a.name)]);
  rows.push(['', '', 'Max.Marks', ...as.map(a => a.max ?? '')]);
  rows.push(['', '', 'Assessment type', ...as.map(a => KIND_LABEL[a.kind])]);
  const studs = opts.blank ? [] : c.students;
  studs.forEach((s, i) => rows.push([i + 1, s.seat, s.name, ...as.map(a => s.marks[a.id] ?? '')]));
  if (opts.blank) for (let i = 0; i < 60; i++) rows.push([i + 1, '', '', ...pad(w)]);
  rows.push([`Note: write "AB" for an absent student. Without student marks, fill the counts (A)–(T) below instead.`]);
  const stat = (k: 'a' | 'b' | 'c' | 'd' | 't') => as.map(a => {
    if (opts.blank) return '';
    const s = res.stats[a.id];
    return s.source ? s[k] : '';
  });
  rows.push([`Marks >= ${cfg.critA}%`, '', '(A)', ...stat('a')]);
  rows.push([`Marks ${cfg.critB}% to ${cfg.critA}%`, '', '(B)', ...stat('b')]);
  rows.push([`Marks ${cfg.critC}% to ${cfg.critB}%`, '', '(C)', ...stat('c')]);
  rows.push([`Marks < ${cfg.critC}% (failed) + absent`, '', '(D)', ...stat('d')]);
  rows.push(['Total attendance', '', '(T)', ...stat('t')]);
  if (opts.results) rows.push(['Assessment score % = (3A + 2B + C) / 3T × 100', '', '', ...as.map(a => r2(res.stats[a.id].score))]);
  rows.push([]);
  rows.push(['COs tested by each assessment (Y)', '', '', ...as.map(a => a.name)]);
  c.cos.forEach((co, i) => rows.push([`CO${i + 1}`, '', '', ...as.map(a => (co.uses.includes(a.id) ? 'Y' : ''))]));
  rows.push([]);
  rows.push(['Course Outcomes (CO)', 'Statement', 'CO attainment (of 3)', 'Program Outcomes (PO)', ...pad(11), 'Program Specific Outcomes (PSO)', '', '']);
  rows.push(['', '', '', ...Array.from({ length: 12 }, (_, i) => i + 1), 1, 2, 3]);
  c.cos.forEach((co, i) => rows.push([`CO${i + 1}`, opts.blank && !co.text ? '' : co.text, opts.results ? r2(res.cos[i].level) : '', ...co.map.map(m => m ?? '')]));
  if (opts.results) {
    rows.push(['PO average', '', c.code, ...res.pos.map(p => r2(p.avg))]);
    rows.push([`PO target = ${cfg.poTarget}% of PO average`, '', '', ...res.pos.map(p => r2(p.target))]);
    rows.push(['PO attainment', '', c.code, ...res.pos.map(p => r2(p.att))]);
    rows.push(['', '', '(Yes/No)', ...res.pos.map(p => (p.met == null ? '' : p.met ? 'Yes' : 'No'))]);
    rows.push([]);
    rows.push(['CO attainment (of 3)', '', r2(res.level)]);
    rows.push(['CO attainment %', '', res.pct == null ? '' : `${r2(res.pct)}%`]);
  }
  return rows;
}

function configRows(cfg: Config, courses: Course[]): Rows {
  return [
    ['Criteria', 'Value'],
    ['PO Target', `${cfg.poTarget}%`], ['Internal Score (IS)', `${cfg.isW}%`], ['External Score (ES)', `${cfg.esW}%`],
    ['Direct attainment (DA)', `${cfg.daW}%`], ['Indirect Attainment (IA)', `${cfg.iaW}%`],
    ['Criteria A (in marks)', cfg.critA], ['Criteria B (in marks)', cfg.critB], ['Criteria C (in marks)', cfg.critC],
    ['CO Target', `${cfg.coTarget}%`], ['Low attained up to (of 3)', cfg.low], ['Partially attained up to (of 3)', cfg.partial],
    [], ['Course CO targets (%)', ''],
    ...courses.map(c => [c.code, c.coTarget ?? cfg.coTarget]),
  ];
}

function surveyRows(s: NbaState, blank: boolean): Rows {
  const head = ['', 'Survey', ...OUT_CODES];
  return [
    ['NBA Criterion 3 · Indirect assessment'],
    ['Satisfactory response % = (Excellent + 0.8 × Good + 0.6 × Satisfactory) ÷ responses × 100. Leave a cell blank where the survey does not ask about that outcome.'],
    head,
    ...s.surveys.map(sv => ['', sv.name, ...sv.rows.map(r => (blank ? '' : r2(rowPct(r))))]),
    [],
    ['', 'Multiplication factor (MF)', ...OUT_CODES],
    ...s.surveys.map(sv => ['', sv.name, ...sv.rows.map(r => r.mf ?? '')]),
  ];
}

function summaryRows(s: NbaState): Rows {
  const p = programResult(s);
  return [
    [`${s.program.name || 'Programme'} · PO and PSO attainment${s.year ? ' · ' + s.year : ''}`],
    [],
    ['Assessment', ...OUT_CODES],
    ['Direct (of 3)', ...p.outcomes.map(o => r2(o.direct))],
    ['Indirect %', ...p.outcomes.map(o => r2(o.indirectPct))],
    ['Indirect (of 3)', ...p.outcomes.map(o => r2(o.indirect))],
    [`Direct × ${s.config.daW}%`, ...p.outcomes.map(o => (o.direct == null ? '' : r2(o.direct * s.config.daW / 100)))],
    [`Indirect × ${s.config.iaW}%`, ...p.outcomes.map(o => (o.indirect == null ? '' : r2(o.indirect * s.config.iaW / 100)))],
    ['Overall (of 3)', ...p.outcomes.map(o => r2(o.overall))],
    ['Overall %', ...p.outcomes.map(o => r2(o.pct))],
    [],
    ['Record of direct attainment by course', ...OUT_CODES],
    ...p.courses.map(({ course, r }) => [`${course.code} ${course.name}`.trim(), ...r.contrib.map(r2)]),
  ];
}

function sheetOf(X: typeof import('xlsx'), rows: Rows, widths: number[]) {
  const ws = X.utils.aoa_to_sheet(rows);
  ws['!cols'] = widths.map(wch => ({ wch }));
  return ws;
}
const fileTag = () => { const b = getBrand(); return (b.short || b.name).replace(/[^\w-]+/g, '_'); };

const README: Rows = [
  ['NBA Criterion 3 · how to fill this workbook'],
  [],
  ['1', 'One sheet per course, named by its code (C211, C212…). Copy a course sheet for each new course.'],
  ['2', 'Fill the course details at the top, then each assessment’s name, maximum marks and type (Internal, External or Feedback).'],
  ['3', 'Enter every student’s marks, or "AB" when absent. If you only have the result counts, leave the marks empty and fill rows (A)–(T).'],
  ['4', 'Mark with Y which COs each assessment tests, then write each CO and map it to POs and PSOs with 1, 2 or 3.'],
  ['5', 'Upload the file on the dashboard. Everything else (scores, CO and PO attainment) is worked out there.'],
  [],
  ['Bands', 'A: marks ≥ criteria A% of the maximum · B: ≥ criteria B% · C: ≥ criteria C% · D: below, or absent. See the Configuration sheet.'],
];

/** The blank or filled course template, or the whole programme. */
export async function downloadCourse(s: NbaState, c: Course, mode: 'blank' | 'filled') {
  const X = await XLSX();
  const wb = X.utils.book_new();
  X.utils.book_append_sheet(wb, sheetOf(X, README, [8, 110]), 'Read me');
  X.utils.book_append_sheet(wb, sheetOf(X, configRows(s.config, [c]), [34, 12]), 'Configuration');
  X.utils.book_append_sheet(wb, sheetOf(X, courseRows(c, s.config, { blank: mode === 'blank', results: mode === 'filled' }), [22, 16, 30, ...c.assessments.map(() => 14), 10]), (c.code || 'Course').slice(0, 31));
  X.writeFile(wb, `NBA_C3_${c.code || 'course'}${mode === 'blank' ? '_blank' : ''}${fileTag() ? '_' + fileTag() : ''}.xlsx`);
}

export async function downloadProgram(s: NbaState, mode: 'blank' | 'filled' | 'sample') {
  const X = await XLSX();
  const wb = X.utils.book_new();
  X.utils.book_append_sheet(wb, sheetOf(X, README, [8, 110]), 'Read me');
  X.utils.book_append_sheet(wb, sheetOf(X, configRows(s.config, s.courses), [34, 12]), 'Configuration');
  if (mode !== 'blank') X.utils.book_append_sheet(wb, sheetOf(X, summaryRows(s), [34, ...OUT_CODES.map(() => 8)]), 'PO attainment');
  const courses = mode === 'blank' ? [newCourse('theory', 'C101'), newCourse('lab', 'C102')] : s.courses;
  const seen = new Set<string>();
  for (const c of courses) {
    let name = (c.code || 'Course').replace(/[\\/?*[\]:]/g, '-').slice(0, 31);
    while (seen.has(name)) name = name.slice(0, 28) + '-' + seen.size;
    seen.add(name);
    X.utils.book_append_sheet(wb, sheetOf(X, courseRows(c, s.config, { blank: mode === 'blank', results: mode !== 'blank' }), [22, 16, 30, ...c.assessments.map(() => 14), 10]), name);
  }
  X.utils.book_append_sheet(wb, sheetOf(X, surveyRows(s, mode === 'blank'), [4, 28, ...OUT_CODES.map(() => 8)]), 'Indirect surveys');
  const tag = fileTag();
  X.writeFile(wb, `NBA_C3_${mode === 'blank' ? 'template' : mode === 'sample' ? 'sample' : 'programme'}${tag ? '_' + tag : ''}.xlsx`);
}

export async function downloadSurveys(s: NbaState, blank: boolean) {
  const X = await XLSX();
  const wb = X.utils.book_new();
  X.utils.book_append_sheet(wb, sheetOf(X, surveyRows(s, blank), [4, 28, ...OUT_CODES.map(() => 8)]), 'Indirect surveys');
  X.writeFile(wb, `NBA_C3_surveys${blank ? '_blank' : ''}${fileTag() ? '_' + fileTag() : ''}.xlsx`);
}

/** Survey % values out of an uploaded file, matched to the surveys already set up by name. */
export function mergeSurveys(cur: Survey[], got: Survey[]): Survey[] {
  const out = cur.map(s => ({ ...s, rows: s.rows.map(r => ({ ...r })) }));
  for (const g of got) {
    const hit = out.find(s => s.name.toLowerCase() === g.name.toLowerCase())
      || out.find(s => s.name.toLowerCase().split(' ')[0] === g.name.toLowerCase().split(' ')[0]);
    if (hit) hit.rows = g.rows.map((r, o) => ({ ...hit.rows[o], ...emptyRow(), pct: r.pct, mf: r.mf ?? hit.rows[o].mf }));
    else out.push(g);
  }
  return out;
}

/* ---------- PO attainment across the years ---------- */
export async function downloadAttainment(s: NbaState) {
  const X = await XLSX();
  const wb = X.utils.book_new();
  const years = yearsOf(s);
  const per = years.map(y => { const st = stateForYear(s, y); return { y, st, p: programResult(st) }; });
  const rows: Rows = [
    [`${s.program.name || 'Programme'} · PO and PSO attainment over ${years.length} year${years.length === 1 ? '' : 's'} (overall, of 3)`],
    [],
    ['Outcome', 'Title', ...years, 'Average', 'Status of average'],
    ...OUT_CODES.map((code, o) => {
      const vals = per.map(x => x.p.outcomes[o].overall), avg = mean(vals);
      const st = statusOf(avg, s.config);
      return [code, s.outcomes[o]?.title || '', ...vals.map(r2), r2(avg), st ? STATUS_LABEL[st] : ''];
    }),
    [],
    ['', 'Average of all outcomes', ...per.map(x => r2(x.p.overall)), r2(mean(per.map(x => x.p.overall)))],
  ];
  X.utils.book_append_sheet(wb, sheetOf(X, rows, [10, 36, ...years.map(() => 12), 12, 20]), `${years.length}-year summary`);
  for (const x of per) X.utils.book_append_sheet(wb, sheetOf(X, summaryRows(x.st), [34, ...OUT_CODES.map(() => 8)]), `PO attainment ${x.y}`.slice(0, 31));
  const contrib: Rows = [['Direct attainment (of 3) each course contributes to each PO and PSO'], [], ['Year', 'Course', 'Name', ...OUT_CODES]];
  for (const x of per) {
    for (const { course, r } of x.p.courses) contrib.push([x.y, course.code, course.name, ...r.contrib.map(r2)]);
    contrib.push([]);
  }
  X.utils.book_append_sheet(wb, sheetOf(X, contrib, [10, 10, 36, ...OUT_CODES.map(() => 8)]), 'Course contributions');
  X.writeFile(wb, `NBA_C3_PO_attainment${fileTag() ? '_' + fileTag() : ''}.xlsx`);
}

/* ---------- the university's programme structure ---------- */
export type StructCourse = { sem: number | null; code: string; name: string; type: 'theory' | 'lab'; cos: { text: string; map: (number | null)[] }[] };

function semCell(v: Cell | undefined): number | null {
  const t = txt(v).replace(/^sem(ester)?\s*[-:.]?\s*/i, '').toUpperCase();
  const roman: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
  const digits = /(\d+)/.exec(t);
  const n = /^\d+$/.test(t) ? +t : roman[t] ?? (digits ? +digits[1] : 0);
  return n >= 1 && n <= 8 ? n : null;
}

/** Programme-structure rows → courses, one row per CO; course columns may be blank on continuation rows. */
export function parseStructure(rows: Rows): StructCourse[] | null {
  const h = rows.findIndex(r => (r || []).some(c => /code/i.test(txt(c))) && (r || []).some(c => /^po\s*-?1$/i.test(txt(c))));
  if (h < 0) return null;
  const head = rows[h].map(txt);
  const find = (re: RegExp, not?: RegExp) => head.findIndex(c => re.test(c) && !(not && not.test(c)));
  const cSem = find(/sem/i), cCode = find(/code/i), cName = find(/name|title/i, /code|^co\b/i), cType = find(/type/i);
  const cStmt = find(/statement|description|outcome text/i);
  const cCo = head.findIndex((c, i) => i !== cStmt && /^co\s*(no\.?|number|#)?$/i.test(c));
  const poCol = OUT_CODES.map(code => head.findIndex(c => c.replace(/[\s-]/g, '').toUpperCase() === code));
  if (cCode < 0 || poCol[0] < 0) return null;
  const out: StructCourse[] = [];
  let cur: StructCourse | null = null, sem: number | null = null;
  for (const row of rows.slice(h + 1)) {
    if (!row || row.every(c => !txt(c))) continue;
    const code = txt(row[cCode]);
    if (cSem >= 0 && txt(row[cSem])) sem = semCell(row[cSem]);
    if (code && (!cur || code.toLowerCase() !== cur.code.toLowerCase())) {
      cur = { sem, code, name: cName >= 0 ? txt(row[cName]) : '', type: cType >= 0 && /lab|pract|term/i.test(txt(row[cType])) ? 'lab' : 'theory', cos: [] };
      out.push(cur);
    }
    if (!cur) continue;
    if (!cur.name && cName >= 0) cur.name = txt(row[cName]);
    const text = cStmt >= 0 ? txt(row[cStmt]) : '';
    const map = poCol.map(c => { const v = c < 0 ? null : numOf(row[c]); return v != null && v > 0 ? Math.min(3, Math.round(v)) : null; });
    if (!text && !map.some(Boolean) && !(cCo >= 0 && txt(row[cCo]))) continue;
    const n = cCo >= 0 ? coNo(row[cCo]) : 0;
    const at = n > 0 ? n - 1 : cur.cos.length;
    while (cur.cos.length <= at) cur.cos.push({ text: '', map: Array(N_OUT).fill(null) });
    cur.cos[at] = { text, map };
  }
  return out.filter(c => c.cos.length);
}

export async function readStructure(file: File): Promise<StructCourse[]> {
  const X = await XLSX();
  const book = X.read(await file.arrayBuffer(), { type: 'array' });
  for (const name of book.SheetNames) {
    const got = parseStructure(X.utils.sheet_to_json<Cell[]>(book.Sheets[name], { header: 1, raw: true, defval: null, blankrows: true }));
    if (got?.length) return got;
  }
  return [];
}

function structureRows(courses: Course[]): Rows {
  const rows: Rows = [['Semester', 'Course code', 'Course name', 'Type (Theory/Lab)', 'CO', 'CO statement', ...OUT_CODES]];
  const sorted = [...courses].sort((a, b) => (semNo(a) ?? 99) - (semNo(b) ?? 99) || a.code.localeCompare(b.code));
  for (const c of sorted) c.cos.forEach((co, i) => rows.push([semNo(c) ?? '', c.code, c.name, c.type === 'lab' ? 'Lab' : 'Theory', `CO${i + 1}`, co.text, ...co.map.map(m => m ?? '')]));
  return rows;
}
const STRUCT_README: Rows = [
  ['Programme structure · how to fill this workbook'],
  [],
  ['1', 'One row per course outcome (CO). Columns: Semester, Course code, Course name, Type (Theory or Lab), CO, CO statement, then PO1–PO12 and PSO1–PSO3.'],
  ['2', 'Semester is the university semester, 1 to 8. Course columns may be left blank on the rows after the first CO of a course; they carry forward.'],
  ['3', 'Write 1, 2 or 3 in a PO/PSO column for the strength of the mapping, or leave it blank.'],
  ['4', 'Upload the file under Setup & weightages. Courses are matched by code; existing marks and assessment links are kept, and courses not yet on the site are added.'],
];
export async function downloadStructure(s: NbaState, mode: 'blank' | 'sample' | 'filled') {
  const X = await XLSX();
  const wb = X.utils.book_new();
  const courses = mode === 'blank' ? [] : mode === 'sample' ? (await import('./sample')).sampleState().courses : s.courses;
  const rows = structureRows(courses);
  if (mode === 'blank') rows.push([3, 'C301', 'Example course', 'Theory', 'CO1', 'Statement of the first CO', ...OUT_CODES.map(() => '')], ['', '', '', '', 'CO2', '', ...OUT_CODES.map(() => '')]);
  X.utils.book_append_sheet(wb, sheetOf(X, STRUCT_README, [6, 120]), 'Read me');
  X.utils.book_append_sheet(wb, sheetOf(X, rows, [10, 12, 36, 16, 8, 60, ...OUT_CODES.map(() => 6)]), 'Programme structure');
  X.writeFile(wb, `NBA_C3_programme_structure${mode === 'blank' ? '_blank' : mode === 'sample' ? '_sample' : ''}${fileTag() ? '_' + fileTag() : ''}.xlsx`);
}
