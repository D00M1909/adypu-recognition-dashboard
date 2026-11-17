/* NBA Criterion 3: course outcomes (COs) and programme outcomes (POs/PSOs).
   The programme, its courses and its surveys live in one store; everything on
   screen is worked out from it here, the same way the department's CO–PO
   attainment workbook does it:

     assessment score  = (3A + 2B + C) / 3T × 100     A, B, C = students in each marks band
     CO %              = DA × 80% + IA × 20%          DA = IS × 20% + ES × 80%, IA = course exit feedback
     CO level (of 3)   = CO % × 3 / 100
     PO direct         = average CO level of every course mapped to that PO
     PO indirect       = Σ(MF × satisfactory %) / Σ MF, from the surveys
     PO overall        = direct × 80% + indirect × 20%

   Every percentage above is a setting. */

import { useSyncExternalStore } from 'react';
import { read, write } from '../lib/persist';

/* ---------- shape ---------- */
export type Kind = 'internal' | 'external' | 'feedback';
export type Counts = { a: number | null; b: number | null; c: number | null; d: number | null; t: number | null };
export type Assessment = { id: string; name: string; kind: Kind; max: number | null; counts: Counts };
export type CO = { id: string; text: string; map: (number | null)[]; uses: string[] };
export type Mark = number | 'AB' | null;
export type Student = { id: string; seat: string; name: string; marks: Record<string, Mark> };
export type Course = {
  id: string; code: string; name: string; faculty: string; year: string; sem: string; cls: string;
  type: 'theory' | 'lab'; coTarget: number | null; assessments: Assessment[]; cos: CO[]; students: Student[];
};
export type Outcome = { code: string; title: string; text: string };
export type Config = {
  isW: number; esW: number;          // internal vs external, inside direct (%)
  daW: number; iaW: number;          // direct vs indirect (%)
  critA: number; critB: number; critC: number; // marks bands (% of max)
  coTarget: number; poTarget: number; // % of the mapping average a CO / PO must reach
  low: number; partial: number;       // PO status cut-offs, out of 3
};
export type SurveyRow = { total: number | null; ex: number | null; good: number | null; sat: number | null; pct: number | null; mf: number | null };
export type Survey = { id: string; name: string; activity: boolean; rows: SurveyRow[] };
export type Program = { name: string; dept: string; batch: string; year: string };
export type YearData = { courses: Course[]; surveys: Survey[] };
/** `year` is the active academic year, whose data sits in courses/surveys; `years` holds the others. */
export type NbaState = { program: Program; outcomes: Outcome[]; config: Config; courses: Course[]; surveys: Survey[]; sample: boolean; year: string; years: Record<string, YearData> };

export const N_OUT = 15;
export const OUT_CODES = [...Array.from({ length: 12 }, (_, i) => `PO${i + 1}`), 'PSO1', 'PSO2', 'PSO3'];

export const PO_TITLES = [
  'Engineering knowledge', 'Problem analysis', 'Design / development of solutions', 'Conduct investigations of complex problems',
  'Modern tool usage', 'The engineer and society', 'Environment and sustainability', 'Ethics', 'Individual and team work',
  'Communication', 'Project management and finance', 'Life-long learning',
];

export const DEFAULT_CONFIG: Config = { isW: 20, esW: 80, daW: 80, iaW: 20, critA: 55, critB: 50, critC: 40, coTarget: 70, poTarget: 80, low: 2.4, partial: 2.8 };

export const uid = () => Math.random().toString(36).slice(2, 10);
export const emptyCounts = (): Counts => ({ a: null, b: null, c: null, d: null, t: null });
export const emptyRow = (): SurveyRow => ({ total: null, ex: null, good: null, sat: null, pct: null, mf: null });

export function defaultOutcomes(): Outcome[] {
  return OUT_CODES.map((code, i) => ({ code, title: i < 12 ? PO_TITLES[i] : '', text: '' }));
}
export function defaultSurveys(): Survey[] {
  const s = (name: string, mf: number | null, activity = false): Survey => ({ id: uid(), name, activity, rows: Array.from({ length: N_OUT }, () => ({ ...emptyRow(), mf })) });
  return [s('Parent survey', 0.5), s('Alumni survey', 1), s('Employer survey', 1), s('Programme exit survey', 0.5), s('Activities', 1, true)];
}
/** The academic year running now (June to May), e.g. "2025–26". */
export function currentYear(d = new Date()) {
  const y = d.getMonth() >= 5 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}–${String((y + 1) % 100).padStart(2, '0')}`;
}
/** "2024-25", "2024–2025", "2024/25" → "2024–25"; null when it isn't a pair of consecutive years. */
export function normYear(input: string): string | null {
  const m = /^\s*(\d{4})\s*[-–—/]\s*(\d{2}|\d{4})\s*$/.exec(input);
  if (!m) return null;
  const a = +m[1], b = +m[2] % 100;
  if (b !== (a + 1) % 100) return null;
  return `${a}–${String(b).padStart(2, '0')}`;
}
export function blankState(): NbaState {
  const year = currentYear();
  return { program: { name: '', dept: '', batch: '', year }, outcomes: defaultOutcomes(), config: { ...DEFAULT_CONFIG }, courses: [], surveys: defaultSurveys(), sample: false, year, years: {} };
}

/* ---------- semesters ---------- */
export const CLASSES = ['FE', 'SE', 'TE', 'BE'];
export const classOfSem = (n: number) => CLASSES[Math.max(0, Math.min(3, Math.floor((n - 1) / 2)))];
const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
/** University semester 1–8: a number as it is (3–8), or term I/II within the class (SE + II = 4). */
export function semNo(c: Pick<Course, 'sem' | 'cls'>): number | null {
  const t = (c.sem || '').trim().replace(/^sem(ester)?\s*[-:.]?\s*/i, '').toUpperCase();
  const n = /^\d+$/.test(t) ? +t : ROMAN[t];
  if (!n || n < 1 || n > 8) return null;
  const ci = CLASSES.indexOf((c.cls || '').trim().toUpperCase());
  if (n <= 2 && ci > 0) return ci * 2 + n;
  return n;
}

export const THEORY_ASSESSMENTS: [string, Kind, number][] = [
  ['Preliminary Examination', 'internal', 50], ['Class Test 1', 'internal', 30], ['Class Test 2', 'internal', 30],
  ['Progressive Assessment', 'internal', 25], ['Theory Exam', 'external', 100], ['Course Exit Feedback', 'feedback', 30],
];
export const LAB_ASSESSMENTS: [string, Kind, number][] = [
  ['Mock Practical / Oral', 'internal', 50], ['Progressive Assessment', 'internal', 25], ['Term Work', 'external', 25],
  ['Practical Exam', 'external', 50], ['Course Exit Feedback', 'feedback', 30],
];
export function newCourse(type: 'theory' | 'lab' = 'theory', code = ''): Course {
  const assessments = (type === 'lab' ? LAB_ASSESSMENTS : THEORY_ASSESSMENTS).map(([name, kind, max]) => ({ id: uid(), name, kind, max, counts: emptyCounts() }));
  const cos = Array.from({ length: 6 }, () => ({ id: uid(), text: '', map: Array(N_OUT).fill(null), uses: assessments.map(a => a.id) }));
  return { id: uid(), code, name: '', faculty: '', year: '', sem: '', cls: '', type, coTarget: null, assessments, cos, students: [] };
}

/* ---------- store ---------- */
const KEY = 'nba-c3';
function load(): NbaState {
  const s = read<Partial<NbaState> | null>(KEY, null);
  if (!s) return blankState();
  const b = blankState();
  const raw = s.year || s.program?.year || '';
  const year = normYear(raw) || raw || b.year;
  return { ...b, ...s, year, years: s.years || {}, program: { ...b.program, ...s.program, year }, config: { ...b.config, ...s.config } };
}
let state = load();
let version = 0;
const subs = new Set<() => void>();
export const getNba = () => state;
export const useNba = () => { useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f); }, () => version); return state; };
export function setNba(next: NbaState | ((s: NbaState) => NbaState)) {
  state = typeof next === 'function' ? next(state) : next;
  version++;
  write(KEY, state);
  subs.forEach(f => f());
}
/** Change part of the state; any edit means it's no longer the untouched sample. */
export function edit(fn: (s: NbaState) => NbaState) { setNba(s => ({ ...fn(s), sample: false })); }
export function editCourse(id: string, fn: (c: Course) => Course) {
  edit(s => ({ ...s, courses: s.courses.map(c => c.id === id ? fn(c) : c) }));
}

/* ---------- academic years ---------- */
export const yearsOf = (s: NbaState) => [...new Set([s.year, ...Object.keys(s.years)])].sort();
export const yearData = (s: NbaState, y: string): YearData => y === s.year ? { courses: s.courses, surveys: s.surveys } : s.years[y] ?? { courses: [], surveys: [] };
/** The state as it stands for one year, ready for programResult. */
export const stateForYear = (s: NbaState, y: string): NbaState => ({ ...s, year: y, ...yearData(s, y), years: {} });

export function switchYear(y: string) {
  setNba(s => {
    if (y === s.year || !s.years[y]) return s;
    const { [y]: target, ...rest } = s.years;
    return { ...s, year: y, program: { ...s.program, year: y }, courses: target.courses, surveys: target.surveys, years: { ...rest, [s.year]: { courses: s.courses, surveys: s.surveys } } };
  });
}

/** A copy of a course with fresh ids; `clear` drops marks, counts and students and keeps the structure. */
export function cloneCourse(c: Course, clear: boolean): Course {
  const ids = new Map<string, string>();
  const assessments = c.assessments.map(a => { const id = uid(); ids.set(a.id, id); return { ...a, id, counts: clear ? emptyCounts() : { ...a.counts } }; });
  return {
    ...c, id: uid(), assessments,
    cos: c.cos.map(co => ({ ...co, id: uid(), map: [...co.map], uses: co.uses.map(u => ids.get(u)!).filter(Boolean) })),
    students: clear ? [] : c.students.map(st => ({ ...st, id: uid(), marks: Object.fromEntries(Object.entries(st.marks).map(([k, v]) => [ids.get(k)!, v]).filter(([k]) => k)) })),
  };
}

/** Add a year (kept alongside the active one). With `copy`, the active year's courses, COs and mapping carry over without marks. */
export function addYear(y: string, copy: boolean): boolean {
  if (yearsOf(getNba()).includes(y)) return false;
  edit(s => ({
    ...s,
    years: {
      ...s.years,
      [y]: copy
        ? { courses: s.courses.map(c => ({ ...cloneCourse(c, true), year: y })), surveys: s.surveys.map(sv => ({ ...sv, id: uid(), rows: sv.rows.map(r => ({ ...emptyRow(), mf: r.mf })) })) }
        : { courses: [], surveys: s.surveys.map(sv => ({ ...sv, id: uid(), rows: sv.rows.map(r => ({ ...emptyRow(), mf: r.mf })) })) },
    },
  }));
  return true;
}

/** Remove a year, always leaving at least one. Removing the active year switches to the latest other one first. */
export function removeYear(y: string): boolean {
  const all = yearsOf(getNba());
  if (all.length < 2 || !all.includes(y)) return false;
  if (y === getNba().year) switchYear(all.filter(x => x !== y).pop()!);
  edit(s => { const { [y]: _gone, ...rest } = s.years; return { ...s, years: rest }; });
  return true;
}

/* ---------- maths ---------- */
const num = (v: unknown): v is number => typeof v === 'number' && isFinite(v);
export const mean = (xs: (number | null | undefined)[]) => { const v = xs.filter(num); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };

export type AStat = { a: number; b: number; c: number; d: number; t: number; n: number; absent: number; score: number | null; source: 'marks' | 'counts' | null };

/** How the class did in one assessment: from the student marks when there are any, else the counts typed in. */
export function assessmentStat(course: Course, as: Assessment, cfg: Config): AStat {
  const entered = course.students.filter(s => s.marks[as.id] != null);
  if (entered.length && num(as.max) && as.max > 0) {
    const max = as.max, n = course.students.filter(s => s.seat || s.name || Object.values(s.marks).some(m => m != null)).length;
    let a = 0, b = 0, c = 0, absent = 0;
    for (const s of course.students) {
      const m = s.marks[as.id];
      if (m === 'AB') { absent++; continue; }
      if (!num(m)) continue;
      const p = m / max * 100;
      if (p >= cfg.critA) a++; else if (p >= cfg.critB) b++; else if (p >= cfg.critC) c++;
    }
    // As in the department's sheet: everyone below band C, absent or blank falls in D,
    // and the class size less the absentees is the attendance the score divides by.
    const t = n - absent, d = n - a - b - c;
    return { a, b, c, d, t, n, absent, score: t > 0 ? (3 * a + 2 * b + c) / (3 * t) * 100 : null, source: 'marks' };
  }
  const k = as.counts;
  if (num(k.a) || num(k.b) || num(k.c)) {
    const a = k.a || 0, b = k.b || 0, c = k.c || 0, d = k.d || 0;
    const t = num(k.t) ? k.t : a + b + c + d;
    return { a, b, c, d, t, n: a + b + c + d, absent: 0, score: t > 0 ? (3 * a + 2 * b + c) / (3 * t) * 100 : null, source: 'counts' };
  }
  return { a: 0, b: 0, c: 0, d: 0, t: 0, n: 0, absent: 0, score: null, source: null };
}

export type CoResult = { co: CO; is: number | null; es: number | null; da: number | null; ia: number | null; pct: number | null; level: number | null;
  avgMap: number | null; target: number | null; reached: number | null; met: boolean | null };
export type PoCourse = { avg: number | null; target: number | null; att: number | null; met: boolean | null };
export type CourseResult = { stats: Record<string, AStat>; cos: CoResult[]; level: number | null; pct: number | null; pos: PoCourse[]; contrib: (number | null)[]; coTarget: number; coMet: number; coCount: number };

export function courseResult(course: Course, cfg: Config): CourseResult {
  const stats: Record<string, AStat> = {};
  for (const a of course.assessments) stats[a.id] = assessmentStat(course, a, cfg);
  const scoreOf = (kind: Kind, co: CO) => mean(course.assessments.filter(a => a.kind === kind && co.uses.includes(a.id)).map(a => stats[a.id].score));
  const coTarget = course.coTarget ?? cfg.coTarget;
  const cos = course.cos.map<CoResult>(co => {
    const is = scoreOf('internal', co), es = scoreOf('external', co), ia = scoreOf('feedback', co);
    // With only one side present it stands for the whole of direct; the same for indirect.
    const da = is != null && es != null ? (is * cfg.isW + es * cfg.esW) / (cfg.isW + cfg.esW || 1) : is ?? es;
    const pct = da != null && ia != null ? (da * cfg.daW + ia * cfg.iaW) / (cfg.daW + cfg.iaW || 1) : da;
    const level = pct == null ? null : pct * 3 / 100;
    const avgMap = mean(co.map.filter(m => num(m) && m > 0));
    const target = avgMap == null ? null : avgMap * coTarget / 100;
    const reached = avgMap == null || level == null ? null : avgMap * level / 3;
    return { co, is, es, da, ia, pct, level, avgMap, target, reached, met: reached == null || target == null ? null : reached >= target - 1e-9 };
  });
  const level = mean(cos.map(c => c.level)), pct = level == null ? null : level / 3 * 100;
  const pos = Array.from({ length: N_OUT }, (_, o) => {
    const avg = mean(course.cos.map(co => co.map[o]).filter(m => num(m) && m > 0));
    const target = avg == null ? null : avg * cfg.poTarget / 100;
    const att = avg == null || level == null ? null : avg * level / 3;
    return { avg, target, att, met: att == null || target == null ? null : att > target };
  });
  const contrib = pos.map(p => (p.avg != null ? level : null));
  return { stats, cos, level, pct, pos, contrib, coTarget, coMet: cos.filter(c => c.met).length, coCount: cos.filter(c => c.met != null).length };
}

export const rowPct = (r: SurveyRow) => {
  if (num(r.pct)) return r.pct;
  if (num(r.total) && r.total > 0 && (num(r.ex) || num(r.good) || num(r.sat))) return ((r.ex || 0) + (r.good || 0) * .8 + (r.sat || 0) * .6) / r.total * 100;
  return null;
};

export type OutcomeResult = { direct: number | null; courses: number; indirectPct: number | null; indirect: number | null; overall: number | null; pct: number | null; status: Status };
export type Status = 'almost' | 'partial' | 'low' | null;
export const statusOf = (v: number | null, cfg: Config): Status => v == null ? null : v > cfg.partial ? 'almost' : v > cfg.low ? 'partial' : 'low';
export const STATUS_LABEL: Record<NonNullable<Status>, string> = { almost: 'Almost attained', partial: 'Partially attained', low: 'Low attained' };
export const STATUS_TONE = { almost: 'good', partial: 'warn', low: 'bad' } as const;

export function programResult(s: NbaState) {
  const courses = s.courses.map(c => ({ course: c, r: courseResult(c, s.config) }));
  const outcomes = Array.from({ length: N_OUT }, (_, o): OutcomeResult => {
    const vals = courses.map(x => x.r.contrib[o]).filter(num);
    const direct = mean(vals);
    let pi = 0, mf = 0;
    for (const sv of s.surveys) {
      const r = sv.rows[o], p = r ? rowPct(r) : null;
      if (p == null || !num(r.mf) || r.mf <= 0) continue;
      pi += r.mf * p; mf += r.mf;
    }
    const indirectPct = mf > 0 ? pi / mf : null, indirect = indirectPct == null ? null : indirectPct * 3 / 100;
    const cfg = s.config;
    const overall = direct != null && indirect != null ? (direct * cfg.daW + indirect * cfg.iaW) / (cfg.daW + cfg.iaW || 1) : direct ?? indirect;
    return { direct, courses: vals.length, indirectPct, indirect, overall, pct: overall == null ? null : overall / 3 * 100, status: statusOf(overall, cfg) };
  });
  const overall = mean(outcomes.map(o => o.overall));
  return { courses, outcomes, overall, pct: overall == null ? null : overall / 3 * 100 };
}

/* ---------- how complete a course is ---------- */
export function courseSteps(c: Course, r: CourseResult) {
  const cos = c.cos.filter(co => co.text.trim() || co.map.some(m => num(m) && m > 0));
  return [
    { key: 'details', label: 'Course details', done: !!(c.code.trim() && c.name.trim()) },
    { key: 'cos', label: 'CO statements', done: cos.length > 0 && cos.every(co => co.text.trim()) },
    { key: 'map', label: 'CO–PO/PSO mapping', done: cos.length > 0 && cos.every(co => co.map.some(m => num(m) && m > 0)) },
    { key: 'assess', label: 'Assessments and the COs they test', done: c.assessments.length > 0 && c.assessments.every(a => num(a.max)) && c.cos.every(co => co.uses.length > 0) },
    { key: 'marks', label: 'Marks or result counts', done: c.assessments.length > 0 && c.assessments.every(a => r.stats[a.id]?.score != null) },
  ];
}

/* ---------- formatting ---------- */
export const f2 = (v: number | null | undefined) => (num(v) ? v.toFixed(2) : '—');
export const f1 = (v: number | null | undefined) => (num(v) ? v.toFixed(1) : '—');
export const pctText = (v: number | null | undefined, d = 1) => (num(v) ? v.toFixed(d) + '%' : '—');
export const courseLabel = (c: Course) => c.code || 'New course';
