import { memo, useCallback, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, ChevronDown, Download, FileSpreadsheet, MoreHorizontal, Plus, Sparkles, Trash2, Upload, X } from 'lucide-react';
import { Button, Eyebrow, Pill, btn, cn } from '../../components/ui';
import { StatusMark } from '../../components/Fields';
import {
  N_OUT, OUT_CODES, courseResult, courseSteps, editCourse, emptyCounts, f1, f2, pctText, statusOf, uid, useNba, edit,
  type AStat, type Assessment, type Config, type Course, type CourseResult, type Kind, type Mark, type Student,
} from '../../nba/model';
import { downloadCourse } from '../../nba/excel';
import { sampleState } from '../../nba/sample';
import { importCourse } from '../../nba/actions';
import { Card, Field, Menu, MenuItem, MenuLabel, MenuSep, NbaNav, NumInput, StatusPill, TextInput, YesNo, saving, statusText, useFilePicker, withUndo } from '../../nba/parts';

const TABS = [
  { key: 'details', label: 'Course & assessments' },
  { key: 'cos', label: 'COs & mapping' },
  { key: 'marks', label: 'Marks' },
  { key: 'attainment', label: 'Attainment' },
];
const KINDS: { k: Kind; label: string; hint: string }[] = [
  { k: 'internal', label: 'Internal', hint: 'Class tests, prelims, progressive assessment, mock oral' },
  { k: 'external', label: 'External', hint: 'University theory, term work, practical, oral' },
  { k: 'feedback', label: 'Feedback', hint: 'Course exit survey: the indirect part' },
];
const KIND_TONE: Record<Kind, 'brand' | 'info' | 'warn'> = { internal: 'brand', external: 'info', feedback: 'warn' };

export function NbaCourse() {
  const { id, tab } = useParams();
  const s = useNba();
  const course = s.courses.find(c => c.id === id);
  if (!course) return <Navigate to="/nba" replace />;
  return <CoursePage key={course.id} course={course} cfg={s.config} all={s.courses} tab={TABS.some(t => t.key === tab) ? tab! : null} />;
}

function CoursePage({ course: c, cfg, all, tab: tabKey }: { course: Course; cfg: Config; all: Course[]; tab: string | null }) {
  const nav = useNavigate();
  const r = courseResult(c, cfg), steps = courseSteps(c, r);
  // A course with nothing in it opens on its details; otherwise on what it has worked out.
  const tab = tabKey || (steps.every(x => !x.done) ? 'details' : r.level != null ? 'attainment' : 'marks');
  const [notes, setNotes] = useState<{ name: string; list: string[] } | null>(null);
  const picker = useFilePicker(f => importCourse(c.id, f, (list, name) => setNotes(list.length ? { name, list } : null)));
  const st = statusOf(r.level, cfg), s = useNba();
  const i = all.indexOf(c);
  const go = (k: string) => nav(`/nba/c/${c.id}/${k}`, { replace: true });

  return (
    <>
      <NbaNav />
      {picker.input}
      <CourseSwitch all={all} current={c} />

      <header className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <Eyebrow>Course {i + 1} of {all.length} · {c.type === 'lab' ? 'Lab' : 'Theory'}{c.cls && ` · ${c.cls}`}{c.sem && ` · Sem ${c.sem}`}{c.year && ` · ${c.year}`}</Eyebrow>
          <h1 className="mt-2 font-serif text-[clamp(26px,3.8vw,38px)] font-bold leading-tight text-ink">
            <span className="mr-3 font-mono text-[0.62em] font-medium text-brand-ink">{c.code || 'New'}</span>{c.name || 'Untitled course'}
          </h1>
          {c.faculty && <p className="mt-1 text-[13.5px] text-muted">{c.faculty}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button kind="solid" onClick={picker.open}><Upload size={16} />Upload marks</Button>
          <Menu trigger={<button className={btn('ghost')}><FileSpreadsheet size={16} />Templates<ChevronDown size={15} className="text-muted" /></button>}>
            <MenuLabel>For this course</MenuLabel>
            <MenuItem onSelect={() => saving(`the ${c.code || 'course'} template`, () => downloadCourse(s, c, 'blank'))}><FileSpreadsheet size={15} />Blank mark sheet, with these assessments</MenuItem>
            <MenuItem onSelect={() => saving('the sample file', () => { const sm = sampleState(); return downloadCourse(sm, sm.courses.find(x => x.code === 'C212')!, 'filled'); })}><Sparkles size={15} />Sample file, filled in</MenuItem>
            <MenuSep />
            <MenuItem onSelect={() => saving(`${c.code || 'the course'} with results`, () => downloadCourse(s, c, 'filled'))}><Download size={15} />Export with results</MenuItem>
          </Menu>
          <Menu trigger={<button className={btn('ghost', 'w-9 px-0')} aria-label="More actions"><MoreHorizontal size={17} /></button>}>
            <MenuItem disabled={!c.students.length} onSelect={() => withUndo('Student marks cleared', () => editCourse(c.id, x => ({ ...x, students: [] })))}><Trash2 size={15} />Clear student marks</MenuItem>
            <MenuItem danger onSelect={() => { nav(all[i + 1] ? `/nba/c/${all[i + 1].id}` : all[i - 1] ? `/nba/c/${all[i - 1].id}` : '/nba'); withUndo(`${c.code || 'Course'} deleted`, () => edit(st => ({ ...st, courses: st.courses.filter(x => x.id !== c.id) }))); }}><Trash2 size={15} />Delete course</MenuItem>
          </Menu>
        </div>
      </header>

      <AnimatePresence>
        {notes && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-5 flex items-start gap-3 rounded-xl bg-warn-bg px-4 py-3 text-[13.5px] text-warn">
              <AlertTriangle size={17} className="mt-0.5 shrink-0" />
              <details className="min-w-0 flex-1 text-ink/85"><summary className="cursor-pointer"><b className="text-ink">{notes.name}</b>: {notes.list.length} to check</summary>
                <ul className="mt-2 max-h-48 list-disc space-y-0.5 overflow-auto pl-5 font-mono text-[12px]">{notes.list.slice(0, 80).map((n, k) => <li key={k}>{n}</li>)}</ul></details>
              <button onClick={() => setNotes(null)} className="rounded-md p-0.5 hover:bg-black/5" aria-label="Dismiss"><X size={15} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="CO attainment" lead value={r.level == null ? '—' : r.level.toFixed(2)} unit="of 3" extra={r.pct != null && <span className={cn('font-mono text-[13px]', statusText(st))}>{r.pct.toFixed(1)}%</span>} foot={r.level != null && <StatusPill status={st} />} />
        <Kpi label="COs on target" value={r.coCount ? `${r.coMet}/${r.coCount}` : '—'} foot={<span className="text-[12px] text-muted">Target {r.coTarget}% of each CO’s mapping average</span>} />
        <Kpi label="Direct · indirect" value={r.cos.length ? `${f1(mean(r.cos.map(x => x.da)))}%` : '—'} extra={<span className="font-mono text-[13px] text-muted">· {f1(mean(r.cos.map(x => x.ia)))}%</span>}
          foot={<span className="text-[12px] text-muted">Weighted {cfg.daW}% · {cfg.iaW}%</span>} />
        <Kpi label="Class" value={String(c.students.length || maxT(r))} unit={c.students.length ? 'students' : 'from counts'} foot={<span className="text-[12px] text-muted">{c.assessments.length} assessments · {c.cos.length} COs</span>} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-hairline bg-raised px-4 py-3 shadow-sm">
        <span className="text-[13px] font-semibold text-ink">{steps.filter(x => x.done).length} of {steps.length} done</span>
        {steps.map(x => (
          <button key={x.key} onClick={() => go(x.key === 'details' || x.key === 'assess' ? 'details' : x.key === 'marks' ? 'marks' : 'cos')}
            className="flex items-center gap-2 text-[12.5px] text-soft transition hover:text-ink"><StatusMark s={x.done ? 'done' : 'empty'} />{x.label}</button>
        ))}
      </div>

      <nav className="no-scrollbar sticky top-16 z-30 -mx-4 mt-4 overflow-x-auto bg-surface/85 px-4 backdrop-blur-md sm:-mx-6 sm:px-6" aria-label="Course sections">
        <div className="flex min-w-max gap-1 border-b border-hairline">
          {TABS.map(t => (
            <Link key={t.key} to={`/nba/c/${c.id}/${t.key}`} replace className={cn('relative px-3 py-3 text-[13.5px] font-medium transition-colors', t.key === tab ? 'text-ink' : 'text-muted hover:text-ink')}>
              {t.label}
              {t.key === tab && <motion.span layoutId="course-tab" className="absolute inset-x-2 -bottom-px h-[2.5px] rounded-full bg-brand" transition={{ type: 'spring', stiffness: 520, damping: 40 }} />}
            </Link>
          ))}
        </div>
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} className="mt-5 space-y-6">
          {tab === 'details' && <Details c={c} cfg={cfg} />}
          {tab === 'cos' && <Cos c={c} />}
          {tab === 'marks' && <Marks c={c} r={r} cfg={cfg} />}
          {tab === 'attainment' && <Attainment c={c} r={r} cfg={cfg} />}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex justify-between gap-3">
        {(() => {
          const k = TABS.findIndex(t => t.key === tab), prev = TABS[k - 1], next = TABS[k + 1];
          return <>
            {prev ? <Button onClick={() => go(prev.key)}>← {prev.label}</Button> : <span />}
            {next ? <Button kind="solid" onClick={() => go(next.key)}>{next.label} →</Button>
              : all[i + 1] && <Link to={`/nba/c/${all[i + 1].id}`} className={btn('solid')}>Next course: {all[i + 1].code} →</Link>}
          </>;
        })()}
      </div>
    </>
  );
}

const band = (lo: number, hi: number) => `${lo}–${Number.isInteger(hi) ? hi - 1 : '<' + hi}%`;
const mean = (xs: (number | null)[]) => { const v = xs.filter((x): x is number => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
const maxT = (r: CourseResult) => Math.max(0, ...Object.values(r.stats).map(x => x.n));

function Kpi({ label, value, unit, extra, foot, lead }: { label: string; value: string; unit?: string; extra?: React.ReactNode; foot?: React.ReactNode; lead?: boolean }) {
  return (
    <div className={cn('rounded-2xl border bg-raised p-4 shadow-sm', lead ? 'border-[color-mix(in_srgb,var(--brand)_30%,var(--hairline))]' : 'border-hairline')}>
      <div className="text-[12px] text-muted">{label}</div>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
        <span className={cn('font-serif text-[28px] font-bold leading-none tabular', value === '—' ? 'text-faint' : 'text-ink')}>{value}</span>
        {unit && <span className="text-[12px] text-muted">{unit}</span>}{extra}
      </div>
      {foot && <div className="mt-2">{foot}</div>}
    </div>
  );
}

function CourseSwitch({ all, current }: { all: Course[]; current: Course }) {
  return (
    <div className="no-scrollbar -mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex w-max gap-1">
        {all.map(x => (
          <Link key={x.id} to={`/nba/c/${x.id}`} title={x.name}
            className={cn('rounded-lg border px-2.5 py-1 font-mono text-[12px] transition', x === current ? 'border-[color-mix(in_srgb,var(--brand)_40%,var(--hairline))] bg-raised text-brand-ink shadow-sm' : 'border-transparent text-muted hover:border-hairline hover:bg-raised hover:text-ink')}>
            {x.code || 'New'}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- course details and its assessments ---------- */
function Details({ c, cfg }: { c: Course; cfg: Config }) {
  const set = (patch: Partial<Course>) => editCourse(c.id, x => ({ ...x, ...patch }));
  const setA = (aid: string, patch: Partial<Assessment>) => editCourse(c.id, x => ({ ...x, assessments: x.assessments.map(a => a.id === aid ? { ...a, ...patch } : a) }));
  return (
    <>
      <Card title="Course details">
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Course code" hint="As in the SAR, e.g. C211"><TextInput value={c.code} onChange={v => set({ code: v.toUpperCase() })} placeholder="C211" /></Field>
          <Field label="Course name and subject code" className="sm:col-span-1 lg:col-span-3"><TextInput value={c.name} onChange={v => set({ name: v })} placeholder="Computer Graphics (210251)" /></Field>
          <Field label="Faculty" className="lg:col-span-2"><TextInput value={c.faculty} onChange={v => set({ faculty: v })} placeholder="Who taught it" /></Field>
          <Field label="Class"><TextInput value={c.cls} onChange={v => set({ cls: v })} placeholder="SE" /></Field>
          <Field label="Semester"><TextInput value={c.sem} onChange={v => set({ sem: v })} placeholder="II" /></Field>
          <Field label="Academic year"><TextInput value={c.year} onChange={v => set({ year: v })} placeholder="2018–19" /></Field>
          <Field label="Course type">
            <div className="flex gap-0.5 rounded-lg bg-sunk p-0.5">
              {(['theory', 'lab'] as const).map(t => (
                <button key={t} onClick={() => set({ type: t })} className={cn('flex-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition', c.type === t ? 'bg-raised text-ink shadow-sm' : 'text-muted hover:text-ink')}>{t === 'lab' ? 'Lab' : 'Theory'}</button>
              ))}
            </div>
          </Field>
          <Field label="CO target, %" hint={`Blank uses the programme’s ${cfg.coTarget}%`}>
            <NumInput value={c.coTarget} onChange={v => set({ coTarget: typeof v === 'number' ? v : null })} placeholder={String(cfg.coTarget)} min={0} max={100} className="text-left" />
          </Field>
        </div>
      </Card>

      <Card title="Assessments" sub={`Internal ones make ${cfg.isW}% and external ${cfg.esW}% of the direct score; feedback is the indirect ${cfg.iaW}%.`}
        aside={<Button onClick={() => editCourse(c.id, x => ({ ...x, assessments: [...x.assessments, { id: uid(), name: `Assessment ${x.assessments.length + 1}`, kind: 'internal', max: null, counts: emptyCounts() }] }))}><Plus size={15} />Add assessment</Button>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead><tr className="text-left text-[12px] text-muted"><th className="px-5 py-2.5 font-medium">Name</th><th className="px-2 py-2.5 font-medium">Type</th><th className="w-32 px-2 py-2.5 font-medium">Max marks</th><th className="w-12" /></tr></thead>
            <tbody>
              {c.assessments.map(a => (
                <tr key={a.id} className="border-t border-divider">
                  <td className="px-5 py-2"><TextInput value={a.name} onChange={v => setA(a.id, { name: v })} label="Assessment name" className="py-1.5" /></td>
                  <td className="px-2 py-2">
                    <div className="flex gap-0.5 rounded-lg bg-sunk p-0.5">
                      {KINDS.map(k => <button key={k.k} title={k.hint} onClick={() => setA(a.id, { kind: k.k })} className={cn('flex-1 rounded-md px-2.5 py-1 text-[12.5px] font-medium transition', a.kind === k.k ? 'bg-raised text-ink shadow-sm' : 'text-muted hover:text-ink')}>{k.label}</button>)}
                    </div>
                  </td>
                  <td className="px-2 py-2"><NumInput value={a.max} onChange={v => setA(a.id, { max: typeof v === 'number' ? v : null })} min={1} label="Maximum marks" placeholder="e.g. 50" /></td>
                  <td className="pr-4 text-right">
                    <button className="rounded-md p-1.5 text-faint transition hover:bg-bad-bg hover:text-bad" aria-label={`Remove ${a.name}`}
                      onClick={() => withUndo(`${a.name} removed`, () => editCourse(c.id, x => ({ ...x, assessments: x.assessments.filter(y => y.id !== a.id), cos: x.cos.map(co => ({ ...co, uses: co.uses.filter(u => u !== a.id) })) })))}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ---------- COs, which assessments test them, and the CO–PO/PSO mapping ---------- */
function Cos({ c }: { c: Course }) {
  const setCo = (cid: string, fn: (co: Course['cos'][number]) => Course['cos'][number]) => editCourse(c.id, x => ({ ...x, cos: x.cos.map(co => co.id === cid ? fn(co) : co) }));
  const add = () => editCourse(c.id, x => ({ ...x, cos: [...x.cos, { id: uid(), text: '', map: Array(N_OUT).fill(null), uses: x.assessments.map(a => a.id) }] }));
  return (
    <>
      <Card title="Course outcomes" sub="What a student can do after the course. Write one per CO." aside={<Button onClick={add}><Plus size={15} />Add CO</Button>}>
        <div className="divide-y divide-divider">
          {c.cos.map((co, k) => (
            <div key={co.id} className="flex items-start gap-3 px-5 py-3">
              <span className="mt-2.5 w-12 shrink-0 font-mono text-[12.5px] font-medium text-brand-ink">CO{k + 1}</span>
              <TextInput area value={co.text} onChange={v => setCo(co.id, x => ({ ...x, text: v }))} placeholder="Apply … to …" label={`CO${k + 1} statement`} />
              <button className="mt-1.5 rounded-md p-1.5 text-faint transition hover:bg-bad-bg hover:text-bad" aria-label={`Remove CO${k + 1}`}
                onClick={() => withUndo(`CO${k + 1} removed`, () => editCourse(c.id, x => ({ ...x, cos: x.cos.filter(y => y.id !== co.id) })))}><Trash2 size={15} /></button>
            </div>
          ))}
          {!c.cos.length && <p className="px-5 py-6 text-[13.5px] text-muted">No COs yet.</p>}
        </div>
      </Card>

      <Card title="CO–PO and CO–PSO mapping" sub="Click a cell to step through 1 (low), 2 (medium), 3 (high) and blank, or type 1–3 and 0 to clear.">
        <div className="overflow-x-auto p-3 sm:p-5">
          <table className="mx-auto border-separate border-spacing-1 text-[12.5px]">
            <thead>
              <tr><th />{OUT_CODES.map((o, i) => <th key={o} className={cn('w-10 pb-1 text-center font-mono text-[11px] font-medium text-muted', i === 12 && 'pl-3')}>{o}</th>)}<th className="pl-3 text-left text-[11px] font-medium text-muted">Average</th></tr>
            </thead>
            <tbody>
              {c.cos.map((co, k) => (
                <tr key={co.id}>
                  <td className="pr-2 font-mono text-[12px] font-medium text-brand-ink" title={co.text}>CO{k + 1}</td>
                  {co.map.map((m, o) => (
                    <td key={o} className={cn(o === 12 && 'pl-3')}>
                      <MapCell v={m} label={`CO${k + 1} to ${OUT_CODES[o]}`} onChange={v => setCo(co.id, x => ({ ...x, map: x.map.map((y, j) => (j === o ? v : y)) }))} />
                    </td>
                  ))}
                  <td className="pl-3 font-mono text-ink tabular">{f2(mean(co.map.filter(m => m != null && m > 0)))}</td>
                </tr>
              ))}
              <tr>
                <td className="pr-2 pt-2 text-[11.5px] text-muted">Average</td>
                {OUT_CODES.map((_, o) => <td key={o} className={cn('pt-2 text-center font-mono text-[11.5px] text-muted', o === 12 && 'pl-3')}>{f2(mean(c.cos.map(co => co.map[o]).filter(m => m != null && m > 0)))}</td>)}
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Which assessments test each CO" sub="A CO’s internal score is the average of the internal assessments ticked for it; likewise external and feedback.">
        <div className="overflow-x-auto p-3 sm:p-5">
          <table className="w-full min-w-[560px] text-[12.5px]">
            <thead>
              <tr>
                <th />
                {c.assessments.map(a => <th key={a.id} className="px-2 pb-2 text-center align-bottom"><div className="text-[12px] font-medium leading-tight text-ink">{a.name}</div><Pill tone={KIND_TONE[a.kind]} className="mt-1">{a.kind}</Pill></th>)}
              </tr>
            </thead>
            <tbody>
              {c.cos.map((co, k) => (
                <tr key={co.id} className="border-t border-divider">
                  <td className="py-2 pr-2 font-mono text-[12px] font-medium text-brand-ink">CO{k + 1}</td>
                  {c.assessments.map(a => {
                    const on = co.uses.includes(a.id);
                    return (
                      <td key={a.id} className="py-1.5 text-center">
                        <button role="checkbox" aria-checked={on} aria-label={`CO${k + 1} tested by ${a.name}`}
                          onClick={() => setCo(co.id, x => ({ ...x, uses: on ? x.uses.filter(u => u !== a.id) : [...x.uses, a.id] }))}
                          className={cn('grid size-7 place-items-center rounded-md border transition', on ? 'border-transparent bg-brand text-white' : 'border-hairline bg-raised text-transparent hover:border-faint')}>
                          <svg viewBox="0 0 16 16" className="size-3.5"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function MapCell({ v, onChange, label }: { v: number | null; onChange: (v: number | null) => void; label: string }) {
  const next = (x: number | null) => (x == null ? 1 : x >= 3 ? null : x + 1);
  return (
    <button aria-label={`${label}: ${v ?? 'not mapped'}`} onClick={() => onChange(next(v))}
      onKeyDown={e => { if (/^[0-3]$/.test(e.key)) { e.preventDefault(); onChange(e.key === '0' ? null : +e.key); } if (e.key === 'Backspace' || e.key === 'Delete') onChange(null); }}
      className={cn('grid h-9 w-10 place-items-center rounded-md font-mono text-[13px] font-semibold transition active:scale-95',
        v == null ? 'border border-dashed border-hairline text-faint hover:border-faint' : v === 1 ? 'bg-[color-mix(in_srgb,var(--brand)_16%,transparent)] text-brand-ink' : v === 2 ? 'bg-[color-mix(in_srgb,var(--brand)_42%,transparent)] text-ink dark:text-white' : 'bg-brand text-white')}>
      {v ?? '·'}
    </button>
  );
}

/* ---------- marks: per student, or the result counts ---------- */
function Marks({ c, r, cfg }: { c: Course; r: CourseResult; cfg: Config }) {
  const [view, setView] = useState<'students' | 'counts'>(c.students.length || !c.assessments.some(a => a.counts.a != null) ? 'students' : 'counts');
  const setMark = useCallback((sid: string, aid: string, v: Mark) => editCourse(c.id, x => ({ ...x, students: x.students.map(st => st.id === sid ? { ...st, marks: { ...st.marks, [aid]: v } } : st) })), [c.id]);
  const setText = useCallback((sid: string, key: 'seat' | 'name', v: string) => editCourse(c.id, x => ({ ...x, students: x.students.map(st => st.id === sid ? { ...st, [key]: v } : st) })), [c.id]);
  const addRows = (n: number) => editCourse(c.id, x => ({ ...x, students: [...x.students, ...Array.from({ length: n }, () => ({ id: uid(), seat: '', name: '', marks: {} }))] }));

  // Paste a block from Excel: columns run Seat No, Name, then the assessments in order.
  const paste = useCallback((e: ClipboardEvent<HTMLInputElement>, row: number, col: number) => {
    const text = e.clipboardData.getData('text/plain');
    if (!/[\t\n]/.test(text.trim())) return;
    e.preventDefault();
    const grid = text.replace(/\r/g, '').replace(/\n$/, '').split('\n').map(l => l.split('\t'));
    editCourse(c.id, x => {
      const students = [...x.students];
      while (students.length < row + grid.length) students.push({ id: uid(), seat: '', name: '', marks: {} });
      grid.forEach((line, i) => {
        const st = { ...students[row + i], marks: { ...students[row + i].marks } };
        line.forEach((raw, j) => {
          const cc = col + j, v = raw.trim();
          if (cc === 0) st.seat = v; else if (cc === 1) st.name = v;
          else { const a = x.assessments[cc - 2]; if (!a) return; st.marks[a.id] = !v ? null : /^ab$/i.test(v) ? 'AB' : isNaN(+v) ? st.marks[a.id] ?? null : +v; }
        });
        students[row + i] = st;
      });
      return { ...x, students };
    });
  }, [c.id]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-0.5 rounded-lg bg-sunk p-0.5" role="tablist">
          {([['students', `Student marks${c.students.length ? ` · ${c.students.length}` : ''}`], ['counts', 'Result counts only']] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)} className={cn('relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors', view === k ? 'text-ink' : 'text-muted hover:text-ink')}>
              {view === k && <motion.span layoutId="marks-view" className="absolute inset-0 rounded-md bg-raised shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              <span className="relative">{l}</span>
            </button>
          ))}
        </div>
        <p className="text-[12.5px] text-muted">Bands: A ≥ {cfg.critA}% · B ≥ {cfg.critB}% · C ≥ {cfg.critC}% of the maximum · D below or absent.</p>
      </div>

      {view === 'students' ? (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-divider px-5 py-3">
            <p className="text-[13px] text-soft">Type, or paste straight from Excel: seat no, name, then each assessment. Write <b className="font-mono text-ink">AB</b> for absent. Enter moves down.</p>
            <div className="flex gap-2">
              <Button onClick={() => addRows(1)}><Plus size={15} />Student</Button>
              <Button onClick={() => addRows(10)}><Plus size={15} />10 rows</Button>
            </div>
          </div>
          {c.students.length ? (
            <div className="max-h-[70vh] overflow-auto">
              <table className="min-w-full table-fixed border-separate border-spacing-0 text-[12.5px]" style={{ width: 40 + 130 + 210 + 36 + c.assessments.length * 100 }}>
                <colgroup><col style={{ width: 40 }} /><col style={{ width: 130 }} /><col /> {c.assessments.map(a => <col key={a.id} style={{ width: 100 }} />)}<col style={{ width: 36 }} /></colgroup>
                <thead className="sticky top-0 z-10 bg-raised shadow-[0_1px_0_var(--divider)]">
                  <tr>
                    <th className="px-2 py-2 text-right font-mono text-[11px] font-medium text-muted">#</th>
                    <th className="px-1 py-2 text-left text-[12px] font-medium text-muted">Seat no</th>
                    <th className="px-1 py-2 text-left text-[12px] font-medium text-muted">Name</th>
                    {c.assessments.map(a => (
                      <th key={a.id} className="px-1 py-2 text-right align-bottom">
                        <div className="truncate text-[12px] font-medium text-ink" title={a.name}>{a.name}</div>
                        <div className="font-mono text-[11px] text-muted">/ {a.max ?? '?'} · {a.kind.slice(0, 3)}</div>
                      </th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {c.students.map((st, k) => <StudentRow key={st.id} st={st} k={k} as={c.assessments} setMark={setMark} setText={setText} paste={paste} courseId={c.id} />)}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-[14px] text-soft">No students yet. Upload the mark sheet, paste from Excel, or add rows.</p>
              <div className="mt-4 flex justify-center gap-2"><Button kind="solid" onClick={() => addRows(10)}><Plus size={15} />Add 10 rows</Button></div>
            </div>
          )}
        </Card>
      ) : null}

      <Card title="Result analysis" sub={c.students.length ? 'Worked out from the student marks.' : 'Type how many students fell in each band, as in the department’s result analysis.'}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[12.5px]">
            <thead>
              <tr className="text-[12px] text-muted">
                <th className="px-5 py-2.5 text-left font-medium">Assessment</th>
                {[['A', `≥ ${cfg.critA}%`], ['B', band(cfg.critB, cfg.critA)], ['C', band(cfg.critC, cfg.critB)], ['D', `< ${cfg.critC}% + AB`], ['T', 'attended']].map(([k, h]) => (
                  <th key={k} className="w-24 px-2 py-2.5 text-right font-medium"><span className="font-mono text-ink">({k})</span> <span className="block text-[11px]">{h}</span></th>
                ))}
                <th className="w-40 px-2 py-2.5 text-left font-medium">Spread</th>
                <th className="w-28 px-5 py-2.5 text-right font-medium">Score %<span className="block text-[11px]">(3A+2B+C)/3T</span></th>
              </tr>
            </thead>
            <tbody>
              {c.assessments.map(a => {
                const stt = r.stats[a.id], fromMarks = stt.source === 'marks';
                const setCount = (k: keyof Assessment['counts'], v: number | null) => editCourse(c.id, x => ({ ...x, assessments: x.assessments.map(y => y.id === a.id ? { ...y, counts: { ...y.counts, [k]: v } } : y) }));
                return (
                  <tr key={a.id} className="border-t border-divider">
                    <td className="px-5 py-2"><span className="font-medium text-ink">{a.name}</span> <Pill tone={KIND_TONE[a.kind]} className="ml-1">{a.kind}</Pill></td>
                    {(['a', 'b', 'c', 'd', 't'] as const).map(k => (
                      <td key={k} className="px-2 py-1.5 text-right">
                        {fromMarks || (view === 'students' && c.students.length)
                          ? <span className="font-mono text-ink tabular">{stt.source ? stt[k] : '—'}</span>
                          : <NumInput value={a.counts[k]} step={1} min={0} onChange={v => setCount(k, typeof v === 'number' ? v : null)} label={`${a.name} (${k.toUpperCase()})`} placeholder={k === 't' ? String((a.counts.a || 0) + (a.counts.b || 0) + (a.counts.c || 0) + (a.counts.d || 0) || '') : ''} />}
                      </td>
                    ))}
                    <td className="px-2 py-2"><Spread s={stt} /></td>
                    <td className="px-5 py-2 text-right font-mono text-[13px] font-semibold text-ink tabular">{pctText(stt.score, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

const StudentRow = memo(function StudentRow({ st, k, as, setMark, setText, paste, courseId }: {
  st: Student; k: number; as: Assessment[]; courseId: string;
  setMark: (sid: string, aid: string, v: Mark) => void; setText: (sid: string, key: 'seat' | 'name', v: string) => void;
  paste: (e: ClipboardEvent<HTMLInputElement>, row: number, col: number) => void;
}) {
  const move = (e: KeyboardEvent<HTMLInputElement>, col: number) => {
    const dr = e.key === 'Enter' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!dr) return;
    e.preventDefault();
    document.querySelector<HTMLInputElement>(`input[data-r="${k + dr}"][data-c="${col}"]`)?.focus();
  };
  const txt = 'w-full rounded-md bg-transparent px-1.5 py-1.5 text-[12.5px] text-ink outline-none transition focus:bg-[var(--cream)] focus:shadow-[inset_0_0_0_2px_var(--brand-ink)]';
  return (
    <tr className="group hover:bg-sunk/60">
      <td className="border-b border-divider px-2 text-right font-mono text-[11px] text-faint">{k + 1}</td>
      <td className="border-b border-divider px-1"><input data-r={k} data-c={0} value={st.seat} onChange={e => setText(st.id, 'seat', e.target.value)} onPaste={e => paste(e, k, 0)} onKeyDown={e => move(e, 0)} className={cn(txt, 'font-mono')} aria-label={`Row ${k + 1} seat no`} /></td>
      <td className="border-b border-divider px-1"><input data-r={k} data-c={1} value={st.name} onChange={e => setText(st.id, 'name', e.target.value)} onPaste={e => paste(e, k, 1)} onKeyDown={e => move(e, 1)} className={txt} aria-label={`Row ${k + 1} name`} /></td>
      {as.map((a, j) => (
        <td key={a.id} className="border-b border-divider px-1 py-0.5">
          <NumInput value={st.marks[a.id]} allowAB min={0} max={a.max ?? undefined} onChange={v => setMark(st.id, a.id, v)} label={`${st.name || 'Row ' + (k + 1)} ${a.name}`}
            data-r={k} data-c={j + 2} onPaste={e => paste(e, k, j + 2)} onKeyDown={e => move(e, j + 2)} className={cn('py-1', st.marks[a.id] === 'AB' && 'text-muted')} />
        </td>
      ))}
      <td className="border-b border-divider pr-2 text-right">
        <button className="rounded-md p-1 text-faint opacity-0 transition group-hover:opacity-100 hover:bg-bad-bg hover:text-bad focus:opacity-100" aria-label={`Remove row ${k + 1}`}
          onClick={() => editCourse(courseId, x => ({ ...x, students: x.students.filter(y => y.id !== st.id) }))}><X size={14} /></button>
      </td>
    </tr>
  );
});

function Spread({ s }: { s: AStat }) {
  const total = s.a + s.b + s.c + s.d;
  if (!total) return <span className="text-faint">—</span>;
  const parts = [[s.a, 'var(--good)', 'A'], [s.b, 'var(--brand-ink)', 'B'], [s.c, 'var(--accent)', 'C'], [s.d, 'var(--bad)', 'D']] as const;
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-sunk" title={parts.map(([v, , l]) => `${l} ${v}`).join(' · ')}>
      {parts.map(([v, col, l]) => <motion.span key={l} style={{ background: col }} initial={{ width: 0 }} animate={{ width: `${v / total * 100}%` }} transition={{ duration: .6 }} />)}
    </div>
  );
}

/* ---------- the worked attainment, like the department's sheet ---------- */
function Attainment({ c, r, cfg }: { c: Course; r: CourseResult; cfg: Config }) {
  const kinds: Kind[] = ['internal', 'external', 'feedback'];
  const st = statusOf(r.level, cfg);
  return (
    <>
      <Card title="CO attainment" sub={<>IS = average of internal · ES = average of external · DA = {cfg.isW}% IS + {cfg.esW}% ES · IA = feedback · CO = {cfg.daW}% DA + {cfg.iaW}% IA, then × 3 ÷ 100</>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[12.5px]">
            <thead>
              <tr className="text-[11.5px] text-muted">
                <th className="px-5 pt-3 text-left font-medium" rowSpan={2}>CO</th>
                {kinds.map(k => { const n = c.assessments.filter(a => a.kind === k).length; return n ? <th key={k} colSpan={n} className="px-2 pt-3 text-center font-medium capitalize"><Pill tone={KIND_TONE[k]}>{k}</Pill></th> : null; })}
                <th colSpan={4} className="border-l border-divider px-2 pt-3 text-center font-medium">Distribution in %</th>
                <th className="px-5 pt-3 text-right font-medium" rowSpan={2}>CO<br />of 3</th>
              </tr>
              <tr className="text-[11.5px] text-muted">
                {kinds.flatMap(k => c.assessments.filter(a => a.kind === k)).map(a => <th key={a.id} className="max-w-[90px] px-2 pb-2.5 pt-1 text-right font-medium"><span className="line-clamp-2">{a.name}</span></th>)}
                {[`IS · ${cfg.isW}%`, `ES · ${cfg.esW}%`, `DA · ${cfg.daW}%`, `IA · ${cfg.iaW}%`].map((h, k) => <th key={h} className={cn('px-2 pb-2.5 pt-1 text-right font-medium', !k && 'border-l border-divider')}>{h}</th>)}
              </tr>
              <tr className="border-t border-divider bg-sunk/50 text-[12px]">
                <td className="px-5 py-2 text-muted">Score</td>
                {kinds.flatMap(k => c.assessments.filter(a => a.kind === k)).map(a => <td key={a.id} className="px-2 py-2 text-right font-mono text-muted tabular">{f2(r.stats[a.id].score)}</td>)}
                <td colSpan={4} className="border-l border-divider" /><td />
              </tr>
            </thead>
            <tbody>
              {r.cos.map((x, k) => (
                <tr key={x.co.id} className="border-t border-divider">
                  <td className="px-5 py-2 font-mono text-[12px] font-medium text-brand-ink" title={x.co.text}>CO{k + 1}</td>
                  {kinds.flatMap(kk => c.assessments.filter(a => a.kind === kk)).map(a => <td key={a.id} className="px-2 py-2 text-right font-mono tabular">{x.co.uses.includes(a.id) ? <span className="text-ink">{f2(r.stats[a.id].score)}</span> : <span className="text-faint">·</span>}</td>)}
                  {[x.is, x.es, x.da, x.ia].map((v, j) => <td key={j} className={cn('px-2 py-2 text-right font-mono text-ink tabular', !j && 'border-l border-divider', j === 2 && 'font-semibold')}>{f2(v)}</td>)}
                  <td className={cn('px-5 py-2 text-right font-mono text-[13.5px] font-bold tabular', statusText(statusOf(x.level, cfg)))}>{f2(x.level)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-hairline bg-[color-mix(in_srgb,var(--brand)_5%,transparent)]">
                <td className="px-5 py-3 font-semibold text-ink" colSpan={c.assessments.length + 5}>Course CO attainment <span className="ml-2 font-normal text-muted">{pctText(r.pct, 2)}</span> <span className="ml-2"><StatusPill status={st} /></span></td>
                <td className="px-5 py-3 text-right font-serif text-[22px] font-bold text-ink tabular">{f2(r.level)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="CO and PO attainment against target" sub={`A CO is attained when its mapping average × CO level ÷ 3 reaches ${r.coTarget}% of the mapping average. A PO when it beats ${cfg.poTarget}% of its average.`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-[12.5px]">
            <thead>
              <tr className="text-[11.5px] text-muted">
                <th className="px-5 py-2.5 text-left font-medium">CO</th>
                <th className="px-2 py-2.5 text-right font-medium">Of 3</th>
                {OUT_CODES.map((o, i) => <th key={o} className={cn('w-10 px-1 py-2.5 text-center font-mono font-medium', i === 12 && 'border-l border-divider')}>{o}</th>)}
                <th className="border-l border-divider px-2 py-2.5 text-right font-medium">Avg map</th>
                <th className="px-2 py-2.5 text-right font-medium">Target</th>
                <th className="px-2 py-2.5 text-right font-medium">Reached</th>
                <th className="px-5 py-2.5 text-center font-medium">Met</th>
              </tr>
            </thead>
            <tbody>
              {r.cos.map((x, k) => (
                <tr key={x.co.id} className="border-t border-divider">
                  <td className="px-5 py-2 font-mono text-[12px] font-medium text-brand-ink" title={x.co.text}>CO{k + 1}</td>
                  <td className="px-2 py-2 text-right font-mono text-ink tabular">{f2(x.level)}</td>
                  {x.co.map.map((m, o) => <td key={o} className={cn('px-1 py-2 text-center font-mono', m ? 'text-ink' : 'text-faint', o === 12 && 'border-l border-divider')}>{m ?? '·'}</td>)}
                  <td className="border-l border-divider px-2 py-2 text-right font-mono tabular">{f2(x.avgMap)}</td>
                  <td className="px-2 py-2 text-right font-mono text-muted tabular">{f2(x.target)}</td>
                  <td className="px-2 py-2 text-right font-mono text-ink tabular">{f2(x.reached)}</td>
                  <td className="px-5 py-2 text-center"><YesNo v={x.met} /></td>
                </tr>
              ))}
              {([['PO average', (i: number) => f2(r.pos[i].avg)], [`PO target · ${cfg.poTarget}%`, (i: number) => f2(r.pos[i].target)], ['PO attainment', (i: number) => f2(r.pos[i].att)]] as const).map(([l, get], j) => (
                <tr key={l} className={cn('border-t border-divider', j === 0 && 'border-t-2 border-hairline', j === 2 && 'font-semibold')}>
                  <td className="whitespace-nowrap px-5 py-2 text-body" colSpan={2}>{l}</td>
                  {OUT_CODES.map((_, i) => <td key={i} className={cn('px-1 py-2 text-center font-mono text-[11.5px] tabular', j === 2 ? 'text-ink' : 'text-muted', i === 12 && 'border-l border-divider')}>{get(i)}</td>)}
                  <td colSpan={4} className="border-l border-divider" />
                </tr>
              ))}
              <tr className="border-t border-divider">
                <td className="px-5 py-2 text-body" colSpan={2}>Attained</td>
                {r.pos.map((p, i) => <td key={i} className={cn('px-0.5 py-2 text-center', i === 12 && 'border-l border-divider')}><YesNo v={p.met} /></td>)}
                <td colSpan={4} className="border-l border-divider" />
              </tr>
            </tbody>
          </table>
        </div>
        <p className="border-t border-divider px-5 py-3 text-[12.5px] text-muted">Into the programme’s direct PO attainment this course gives <b className="font-mono text-ink">{f2(r.level)}</b> to each PO and PSO it maps to ({r.contrib.filter(v => v != null).length} of 15).</p>
      </Card>
    </>
  );
}
