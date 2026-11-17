/* Bringing an uploaded workbook into the NBA data, with Undo. */

import { toast } from 'sonner';
import { readWorkbook, readStructure, mergeSurveys, type ImportResult, type StructCourse } from './excel';
import { classOfSem, getNba, newCourse, setNba, uid, type Course, type NbaState } from './model';

function summary(r: ImportResult) {
  const parts = [`${r.courses.length} course${r.courses.length === 1 ? '' : 's'}`];
  const st = r.reports.reduce((s, x) => s + x.students, 0);
  if (st) parts.push(`${st} student rows`);
  if (r.surveys.length) parts.push(`${r.surveys.length} surveys`);
  if (Object.keys(r.config).length) parts.push('settings');
  return parts.join(' · ');
}
export const notesOf = (r: ImportResult) => r.reports.flatMap(x => x.notes.map(n => `${x.code}: ${n}`));

/** A whole CO–PO workbook: courses are added or replaced by code; settings and surveys too when the file has them. */
export async function importProgram(f: File, onNotes?: (notes: string[], name: string) => void, opts?: { sem?: number }) {
  const id = toast.loading(`Reading ${f.name}…`);
  try {
    const r = await readWorkbook(f);
    if (!r.courses.length && !r.surveys.length) throw new Error('No course mark sheets or survey sheet found. Each course sheet needs a “Seat No” column heading.');
    if (opts?.sem) for (const c of r.courses) { c.sem = String(opts.sem); c.cls = classOfSem(opts.sem); }
    const before = getNba();
    setNba(s => {
      const courses: Course[] = [...s.courses];
      for (const c of r.courses) {
        const at = courses.findIndex(x => x.code.toLowerCase() === c.code.toLowerCase());
        if (at < 0) { courses.push(c); continue; }
        const old = courses[at];
        const hasCos = c.cos.some(co => co.text || co.map.some(Boolean));
        courses[at] = { ...c, id: old.id, name: c.name || old.name, faculty: c.faculty || old.faculty, coTarget: c.coTarget ?? old.coTarget, sem: c.sem || old.sem, cls: c.cls || old.cls,
          cos: hasCos || !old.cos.length ? c.cos : mergeCos(old, c) };
      }
      const base: NbaState = s.sample ? { ...s, courses: [] } : s;
      return {
        ...base,
        courses: s.sample ? r.courses : courses,
        config: { ...base.config, ...r.config },
        surveys: r.surveys.length ? mergeSurveys(base.surveys, r.surveys) : base.surveys,
        sample: false,
      };
    });
    const notes = notesOf(r);
    onNotes?.(notes, f.name);
    toast.success(`${f.name} loaded${opts?.sem ? ` into semester ${opts.sem}` : ''}`, { id, description: summary(r) + (notes.length ? ` · ${notes.length} to check` : ''), action: { label: 'Undo', onClick: () => setNba(before) } });
    return r;
  } catch (e) { toast.error('Could not read that file', { id, description: (e as Error).message }); }
}

/** One course's marks file: the sheet for this course's code, or the only course in the file. */
export async function importCourse(courseId: string, f: File, onNotes?: (notes: string[], name: string) => void) {
  const id = toast.loading(`Reading ${f.name}…`);
  try {
    const r = await readWorkbook(f);
    const cur = getNba().courses.find(c => c.id === courseId)!;
    const hit = r.courses.find(c => cur.code && c.code.toLowerCase() === cur.code.toLowerCase()) || (r.courses.length === 1 ? r.courses[0] : null);
    if (!hit) throw new Error(r.courses.length ? `The file has ${r.courses.length} courses and none is ${cur.code || 'this one'}. Upload it on the NBA overview to bring them all in.` : 'No course mark sheet found: it needs a “Seat No” column heading.');
    const before = getNba();
    setNba(s => ({
      ...s, sample: false,
      config: { ...s.config, ...r.config },
      courses: s.courses.map(c => c.id === courseId ? { ...hit, id: c.id, code: hit.code || c.code, name: hit.name || c.name, coTarget: hit.coTarget ?? c.coTarget, cos: hit.cos.some(co => co.text || co.map.some(Boolean)) ? hit.cos : mergeCos(c, hit) } : c),
    }));
    const rep = r.reports[r.courses.indexOf(hit)];
    onNotes?.(rep.notes, f.name);
    toast.success(`${f.name} loaded into ${hit.code || 'the course'}`, { id, description: `${rep.students} students · ${rep.assessments} assessments · ${rep.cos} COs`, action: { label: 'Undo', onClick: () => setNba(before) } });
  } catch (e) { toast.error('Could not read that file', { id, description: (e as Error).message }); }
}

// A marks-only file keeps the COs and mapping already typed in, re-pointing which assessments they use by name.
function mergeCos(old: Course, got: Course) {
  const byName = new Map(got.assessments.map(a => [a.name.toLowerCase(), a.id]));
  return old.cos.map((co, i) => {
    const fromFile = got.cos[i]?.uses;
    const kept = co.uses.map(u => byName.get(old.assessments.find(a => a.id === u)?.name.toLowerCase() || '')).filter((x): x is string => !!x);
    return { ...co, uses: fromFile?.length ? fromFile : kept.length ? kept : got.assessments.map(a => a.id) };
  });
}

/* ---------- the university's programme structure ---------- */
function applyStructure(list: Course[], got: StructCourse[]) {
  const courses = [...list];
  let updated = 0, created = 0;
  for (const g of got) {
    const sem = g.sem ? String(g.sem) : '', cls = g.sem ? classOfSem(g.sem) : '';
    const at = courses.findIndex(c => c.code.toLowerCase() === g.code.toLowerCase());
    if (at >= 0) {
      const c = courses[at];
      const cos = g.cos.map((x, i) => c.cos[i]
        ? { ...c.cos[i], text: x.text || c.cos[i].text, map: x.map }
        : { id: uid(), text: x.text, map: x.map, uses: c.assessments.map(a => a.id) });
      courses[at] = { ...c, name: g.name || c.name, type: g.type, sem: sem || c.sem, cls: cls || c.cls, cos };
      updated++;
    } else {
      const c = newCourse(g.type, g.code);
      courses.push({ ...c, name: g.name, sem, cls, cos: g.cos.map(x => ({ id: uid(), text: x.text, map: x.map, uses: c.assessments.map(a => a.id) })) });
      created++;
    }
  }
  return { courses, updated, created };
}

/** The university's programme structure: COs, statements and CO–PO mapping by course code, for the active year and, if asked, every stored year. */
export async function importStructure(f: File, allYears = false) {
  const id = toast.loading(`Reading ${f.name}…`);
  try {
    const got = await readStructure(f);
    if (!got.length) throw new Error('No programme structure found. It needs a header row with “Course code” and PO1…PSO3 columns, and one row per CO.');
    const before = getNba();
    let updated = 0, created = 0;
    setNba(s => {
      const cur = applyStructure(s.sample ? [] : s.courses, got);
      updated = cur.updated; created = cur.created;
      const years = allYears ? Object.fromEntries(Object.entries(s.years).map(([y, d]) => [y, { ...d, courses: applyStructure(d.courses, got).courses }])) : s.years;
      return { ...s, courses: cur.courses, years, sample: false };
    });
    const n = Object.keys(before.years).length;
    toast.success(`${f.name} loaded`, { id, description: `${updated} course${updated === 1 ? '' : 's'} updated · ${created} added${allYears && n ? ` · applied to ${n + 1} years` : ''}`, action: { label: 'Undo', onClick: () => setNba(before) } });
  } catch (e) { toast.error('Could not read that file', { id, description: (e as Error).message }); }
}
