import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, ArrowRight, ArrowUpRight, BookOpen, ChevronDown, Download, FileSpreadsheet, ListTree, FlaskConical, Plus, Sparkles, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Eyebrow, Pill, btn, cn, glowMove } from '../../components/ui';
import { StatusMark } from '../../components/Fields';
import {
  CLASSES, OUT_CODES, blankState, classOfSem, courseSteps, f2, newCourse, pctText, programResult, semNo, setNba, statusOf, useNba, edit,
  type Config, type Course, type CourseResult, type NbaState, type OutcomeResult,
} from '../../nba/model';
import { sampleState } from '../../nba/sample';
import { downloadAttainment, downloadProgram, downloadStructure } from '../../nba/excel';
import { importProgram, importStructure } from '../../nba/actions';
import { Card, Gauge, Menu, MenuItem, MenuLabel, MenuSep, NbaNav, Split, StatusPill, saving, statusText, useFilePicker, withUndo } from '../../nba/parts';

const band = (lo: number, hi: number) => `${lo}–${Number.isInteger(hi) ? hi - 1 : '<' + hi}%`;
const rise = { hidden: { opacity: 0, y: 14 }, show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: .55, delay: i * .06, ease: [0.22, 1, 0.36, 1] as const } }) };

export function NbaHome() {
  const s = useNba(), nav = useNavigate();
  const p = programResult(s);
  const [notes, setNotes] = useState<{ name: string; list: string[] } | null>(null);
  const picker = useFilePicker(f => importProgram(f, (list, name) => setNotes(list.length ? { name, list } : null)));
  const semRef = useRef(0);
  const semPicker = useFilePicker(f => importProgram(f, (list, name) => list.length && setNotes({ name, list }), { sem: semRef.current || undefined }), true);
  const structPicker = useFilePicker(f => importStructure(f));
  const uploadSem = (n: number) => { semRef.current = n; semPicker.open(); };
  const empty = !s.courses.length;

  function addCourse(type: 'theory' | 'lab') {
    const c = newCourse(type, `C${100 + s.courses.length + 1}`);
    edit(st => ({ ...(st.sample ? { ...st, courses: [] } : st), courses: [...(st.sample ? [] : st.courses), c] }));
    nav(`/nba/c/${c.id}/details`);
  }

  return (
    <>
      <NbaNav />
      {picker.input}{semPicker.input}{structPicker.input}

      <section className="grid items-center gap-8 pt-8 pb-2 lg:grid-cols-[1fr_300px] lg:gap-12">
        <motion.div initial="hidden" animate="show">
          <motion.div variants={rise} custom={0}><Eyebrow>NBA · Criterion 3 · Course outcomes &amp; programme outcomes</Eyebrow></motion.div>
          <motion.h1 variants={rise} custom={1} className="mt-3 font-serif text-[clamp(32px,4.8vw,52px)] font-bold leading-[1.05] tracking-[-.01em] text-ink text-balance">
            {s.program.name || 'CO, PO & PSO attainment'}
          </motion.h1>
          <motion.p variants={rise} custom={2} className="mt-4 max-w-[600px] text-[16px] leading-relaxed text-soft">
            {s.program.name && <span className="text-ink">{[s.program.batch && `Batch ${s.program.batch}`, s.year && `assessed ${s.year}`].filter(Boolean).join(', ')}. </span>}
            Fill each course here or drop in your CO–PO attainment workbook. CO attainment is {s.config.daW}% direct and {s.config.iaW}% indirect, and rolls up into every PO and PSO.
          </motion.p>
          <motion.div variants={rise} custom={3} className="mt-7 flex flex-wrap items-center gap-2.5">
            <Button kind="solid" className="h-11 rounded-xl px-5 text-[14.5px]" onClick={picker.open}><Upload size={17} />Upload CO–PO workbook</Button>
            <Menu trigger={<button className={btn('ghost', 'h-11 rounded-xl')}><Upload size={16} />Upload by semester<ChevronDown size={15} className="text-muted" /></button>}>
              <MenuLabel>Mark files for one semester</MenuLabel>
              {Array.from({ length: 8 }, (_, i) => i + 1).map(n => <MenuItem key={n} onSelect={() => uploadSem(n)}><Upload size={15} />Sem {n} <span className="text-muted">· {classOfSem(n)}</span></MenuItem>)}
            </Menu>
            <Menu trigger={<button className={btn('ghost', 'h-11 rounded-xl')}><FileSpreadsheet size={16} />Templates<ChevronDown size={15} className="text-muted" /></button>}>
              <MenuLabel>To fill in Excel</MenuLabel>
              <MenuItem onSelect={() => saving('the sample file', () => downloadProgram(sampleState(), 'sample'))}><Sparkles size={15} />Sample file, filled in</MenuItem>
              <MenuItem onSelect={() => saving('the blank template', () => downloadProgram(s, 'blank'))}><FileSpreadsheet size={15} />Blank template</MenuItem>
              <MenuSep /><MenuLabel>Programme structure</MenuLabel>
              <MenuItem onSelect={() => structPicker.open()}><ListTree size={15} />Upload university structure</MenuItem>
              <MenuItem onSelect={() => saving('the structure template', () => downloadStructure(s, 'blank'))}><FileSpreadsheet size={15} />Blank structure template</MenuItem>
              {!empty && <><MenuSep /><MenuLabel>Your data</MenuLabel>
                <MenuItem onSelect={() => saving('the export', () => downloadProgram(s, 'filled'))}><Download size={15} />Export with results</MenuItem>
                <MenuItem onSelect={() => saving('the PO attainment export', () => downloadAttainment(s))}><Download size={15} />Export PO attainment, all years</MenuItem></>}
            </Menu>
            {s.sample
              ? <Button kind="quiet" className="h-11" onClick={() => withUndo('Sample data cleared', () => setNba(blankState()))}><X size={16} />Clear sample data</Button>
              : empty && <Button kind="quiet" className="h-11" onClick={() => { setNba({ ...sampleState(), config: s.config }); toast.success('Sample data loaded', { description: 'Seven made-up courses and survey results. C211 follows the worked example.' }); }}><Sparkles size={16} className="text-accent" />Try with sample data</Button>}
            {s.sample && <Pill tone="info" dot>Showing sample data</Pill>}
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }} className="text-center">
          <Gauge level={p.overall} cfg={s.config} caption="average PO & PSO attainment" />
          {p.overall != null && <div className="mt-3"><StatusPill status={statusOf(p.overall, s.config)} /></div>}
        </motion.div>
      </section>

      <AnimatePresence>
        {notes && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-5 flex items-start gap-3 rounded-xl bg-warn-bg px-4 py-3 text-[13.5px] text-warn">
              <AlertTriangle size={17} className="mt-0.5 shrink-0" />
              <details className="min-w-0 flex-1 text-ink/85"><summary className="cursor-pointer"><b className="text-ink">{notes.name}</b>: {notes.list.length} thing{notes.list.length === 1 ? '' : 's'} to check</summary>
                <ul className="mt-2 max-h-48 list-disc space-y-0.5 overflow-auto pl-5 font-mono text-[12px]">{notes.list.slice(0, 80).map((n, i) => <li key={i}>{n}</li>)}</ul></details>
              <button onClick={() => setNotes(null)} className="rounded-md p-0.5 hover:bg-black/5" aria-label="Dismiss"><X size={15} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HowItAddsUp cfg={s.config} />

      {empty
        ? <EmptyStart onUpload={picker.open} onAdd={addCourse} onSample={() => { setNba({ ...sampleState(), config: s.config }); toast.success('Sample data loaded'); }} />
        : <>
            <OutcomeBoard s={s} outcomes={p.outcomes} />
            <Courses courses={p.courses} cfg={s.config} onAdd={addCourse} onUploadSem={uploadSem} />
          </>}

      <SarStrip s={s} p={p} />
    </>
  );
}

/* The percentages, drawn as they combine. */
function HowItAddsUp({ cfg }: { cfg: Config }) {
  return (
    <Card className="mt-10" title="How the percentages add up" sub="Every weight is a setting; change them under Setup & weightages and everything recalculates."
      aside={<Link to="/nba/setup" className="group flex items-center gap-1.5 text-[13px] font-medium text-brand-ink">Change weightages <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></Link>}>
      <div className="grid gap-6 p-5 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-baseline justify-between"><span className="text-[13.5px] font-semibold text-ink">CO attainment, per course</span><span className="font-mono text-[11.5px] text-muted">of 3 · and as %</span></div>
          <Split parts={[{ label: 'Direct (DA)', short: 'DA', pct: cfg.daW }, { label: 'Indirect (IA)', short: 'IA', pct: cfg.iaW, tone: 'accent' }]} />
          <div className="mt-1.5 grid gap-1.5" style={{ gridTemplateColumns: `${cfg.daW || 1}fr ${cfg.iaW || 1}fr` }}>
            <Split className="h-7 text-[11.5px]" parts={[{ label: 'Internal', short: 'IS', pct: cfg.isW, tone: 'faint' }, { label: 'External', short: 'ES', pct: cfg.esW, tone: 'faint' }]} />
            <div className="flex h-7 items-center justify-center rounded-lg bg-sunk px-2 text-[11.5px] font-semibold text-soft"><span className="truncate">Course exit feedback</span></div>
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">Internal: class tests, prelims, progressive assessment, mock oral. External: university theory, term work, practical, oral. Each assessment scores <span className="font-mono text-body">(3A + 2B + C) ÷ 3T</span>.</p>
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between"><span className="text-[13.5px] font-semibold text-ink">PO &amp; PSO attainment, programme</span><span className="font-mono text-[11.5px] text-muted">of 3 · and as %</span></div>
          <Split parts={[{ label: 'Direct: course COs', short: 'Direct', pct: cfg.daW }, { label: 'Indirect: surveys', short: 'IA', pct: cfg.iaW, tone: 'accent' }]} />
          <div className="mt-1.5 flex h-7 gap-1.5 text-[11.5px] font-semibold text-soft">
            {[['A', `≥ ${cfg.critA}%`], ['B', band(cfg.critB, cfg.critA)], ['C', band(cfg.critC, cfg.critB)], ['D', `< ${cfg.critC}%, AB`]].map(([k, v]) => (
              <span key={k} className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-sunk px-2"><b className="font-mono text-ink">{k}</b><span className="truncate">{v}</span></span>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">Status: up to {cfg.low.toFixed(2)} low, up to {cfg.partial.toFixed(2)} partially attained, above that almost attained. A CO meets its target at {cfg.coTarget}% of its mapping average (or the course’s own target); a PO at {cfg.poTarget}%.</p>
        </div>
      </div>
    </Card>
  );
}

function EmptyStart({ onUpload, onAdd, onSample }: { onUpload: () => void; onAdd: (t: 'theory' | 'lab') => void; onSample: () => void }) {
  const items = [
    { icon: Upload, title: 'Upload your CO–PO workbook', body: 'One sheet per course with the mark sheet, COs and CO–PO mapping. The department’s attainment workbook reads as it is.', act: onUpload, cta: 'Choose file' },
    { icon: BookOpen, title: 'Add a theory course', body: 'Prelims, class tests, progressive assessment, theory exam and course exit feedback are set up for you.', act: () => onAdd('theory'), cta: 'Add course' },
    { icon: FlaskConical, title: 'Add a lab course', body: 'Mock oral, progressive assessment, term work, practical exam and feedback.', act: () => onAdd('lab'), cta: 'Add lab' },
    { icon: Sparkles, title: 'See it filled in', body: 'Seven made-up courses and survey results, with C211 following the worked example.', act: onSample, cta: 'Load sample' },
  ];
  return (
    <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it, i) => (
        <motion.button key={it.title} variants={rise} initial="hidden" animate="show" custom={i} onClick={it.act} onPointerMove={glowMove}
          className="glow group flex flex-col rounded-2xl border border-hairline bg-raised p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="grid size-10 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] text-brand-ink"><it.icon size={19} /></span>
          <span className="mt-4 font-serif text-[18px] font-bold leading-tight text-ink">{it.title}</span>
          <span className="mt-1.5 flex-1 text-[13px] leading-relaxed text-soft">{it.body}</span>
          <span className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-brand-ink">{it.cta}<ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></span>
        </motion.button>
      ))}
    </section>
  );
}

/* PO & PSO attainment: the chart and the record the SAR asks for. */
function OutcomeBoard({ s, outcomes }: { s: NbaState; outcomes: OutcomeResult[] }) {
  const cfg = s.config;
  const [hover, setHover] = useState<number | null>(null);
  const rows: { label: string; get: (o: OutcomeResult) => string; strong?: boolean; muted?: boolean }[] = [
    { label: 'Direct (of 3)', get: o => f2(o.direct) },
    { label: 'Courses mapped', get: o => (o.courses ? String(o.courses) : '—'), muted: true },
    { label: 'Indirect %', get: o => pctText(o.indirectPct), muted: true },
    { label: 'Indirect (of 3)', get: o => f2(o.indirect) },
    { label: `Direct × ${cfg.daW}%`, get: o => (o.direct == null ? '—' : (o.direct * cfg.daW / 100).toFixed(2)), muted: true },
    { label: `Indirect × ${cfg.iaW}%`, get: o => (o.indirect == null ? '—' : (o.indirect * cfg.iaW / 100).toFixed(2)), muted: true },
    { label: 'Overall (of 3)', get: o => f2(o.overall), strong: true },
    { label: 'Overall %', get: o => pctText(o.pct, 2), strong: true },
  ];
  return (
    <Card className="mt-8" title="PO & PSO attainment" sub={`Direct from ${s.courses.length} course${s.courses.length === 1 ? '' : 's'}, indirect from ${s.surveys.length} surveys. Hover a column to read it.`}
      aside={<div className="flex flex-wrap gap-3 text-[12px] text-soft">
        <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-[3px] bg-[var(--brand-ink)]" />Direct</span>
        <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-[3px] bg-accent" />Indirect</span>
        <span className="flex items-center gap-1.5"><i className="h-0.5 w-3 bg-ink" />Overall</span>
        <span className="flex items-center gap-1.5"><i className="w-3 border-t-2 border-dashed border-warn" />{cfg.low.toFixed(2)}</span>
        <span className="flex items-center gap-1.5"><i className="w-3 border-t-2 border-dashed border-good" />{cfg.partial.toFixed(2)}</span>
      </div>}>
      <div className="px-3 pt-4 sm:px-5"><OutcomeChart outcomes={outcomes} cfg={cfg} hover={hover} onHover={setHover} /></div>
      <div className="mt-2 overflow-x-auto border-t border-divider">
        <table className="w-full min-w-[920px] border-collapse text-[12.5px]">
          <thead>
            <tr className="text-muted">
              <th className="sticky left-0 z-10 bg-raised px-4 py-2.5 text-left font-medium">Assessment</th>
              {OUT_CODES.map((c, o) => <th key={c} onMouseEnter={() => setHover(o)} onMouseLeave={() => setHover(null)} title={s.outcomes[o].title}
                className={cn('px-1.5 py-2.5 text-center font-mono text-[11.5px] font-medium transition-colors', hover === o && 'bg-sunk text-ink', o === 12 && 'border-l border-divider')}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.label} className={cn('border-t border-divider', r.strong && 'bg-[color-mix(in_srgb,var(--brand)_4%,transparent)]')}>
                <td className={cn('sticky left-0 z-10 whitespace-nowrap bg-raised px-4 py-2', r.strong ? 'font-semibold text-ink' : r.muted ? 'text-muted' : 'text-body')}>{r.label}</td>
                {outcomes.map((o, i) => <td key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                  className={cn('px-1.5 py-2 text-center font-mono tabular transition-colors', hover === i && 'bg-sunk', i === 12 && 'border-l border-divider', r.strong ? 'font-semibold ' + statusText(o.status) : r.muted ? 'text-muted' : 'text-ink')}>{r.get(o)}</td>)}
              </tr>
            ))}
            <tr className="border-t border-divider">
              <td className="sticky left-0 z-10 bg-raised px-4 py-2.5 text-body">Status</td>
              {outcomes.map((o, i) => <td key={i} className={cn('px-1 py-2.5 text-center', i === 12 && 'border-l border-divider')}><StatusPill status={o.status} short /></td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function OutcomeChart({ outcomes, cfg, hover, onHover }: { outcomes: OutcomeResult[]; cfg: Config; hover: number | null; onHover: (i: number | null) => void }) {
  const W = 960, H = 250, L = 40, B = 30, T = 12, n = outcomes.length, gw = (W - L) / n, bw = Math.min(16, gw / 3.4);
  const y = (v: number) => T + (H - T - B) * (1 - Math.max(0, Math.min(3, v)) / 3);
  const h = hover == null ? null : outcomes[hover];
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-visible" role="img" aria-label="PO and PSO attainment out of 3">
        {[0, 1, 2, 3].map(v => <g key={v}><line x1={L} x2={W} y1={y(v)} y2={y(v)} stroke="var(--divider)" strokeDasharray={v ? '3 4' : undefined} /><text x={L - 8} y={y(v) + 4} textAnchor="end" className="fill-muted font-mono text-[10.5px]">{v}</text></g>)}
        {[cfg.low, cfg.partial].map((v, i) => <line key={i} x1={L} x2={W} y1={y(v)} y2={y(v)} stroke={i ? 'var(--good)' : 'var(--warn)'} strokeOpacity=".6" strokeDasharray="6 4" />)}
        {outcomes.map((o, j) => {
          const cx = L + j * gw + gw / 2;
          return (
            <g key={j} onMouseEnter={() => onHover(j)} onMouseLeave={() => onHover(null)}>
              <rect x={L + j * gw} y={T} width={gw} height={H - T - B + 4} fill={hover === j ? 'var(--surface-sunk)' : 'transparent'} rx="6" />
              {[[o.direct, 'var(--brand-ink)', -1], [o.indirect, 'var(--accent)', 0]].map(([v, fill, k], i) => v == null ? null : (
                <motion.rect key={i} x={cx + (k as number) * bw - 1 + (k === 0 ? 2 : 0)} width={bw - 1} rx="3" fill={fill as string}
                  initial={{ height: 0, y: y(0) }} animate={{ height: y(0) - y(v as number), y: y(v as number) }} transition={{ type: 'spring', stiffness: 160, damping: 24, delay: j * .03 }} />
              ))}
              {o.overall != null && <motion.line x1={cx - bw - 4} x2={cx + bw + 4} stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round"
                initial={{ y1: y(0), y2: y(0) }} animate={{ y1: y(o.overall), y2: y(o.overall) }} transition={{ type: 'spring', stiffness: 160, damping: 24, delay: .2 + j * .03 }} />}
              <text x={cx} y={H - 9} textAnchor="middle" className={cn('font-mono text-[10.5px]', hover === j ? 'fill-ink' : 'fill-muted')}>{OUT_CODES[j]}</text>
            </g>
          );
        })}
      </svg>
      <AnimatePresence>
        {h && hover != null && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .12 }}
            className="pointer-events-none absolute top-0 z-10 w-[190px] rounded-xl border border-hairline bg-raised p-3 text-[12px] shadow-md"
            style={{ left: `clamp(0px, calc(${(L + hover * gw + gw / 2) / W * 100}% - 95px), calc(100% - 190px))` }}>
            <div className="font-mono text-[11.5px] font-semibold text-brand-ink">{OUT_CODES[hover]}</div>
            <div className="mt-1.5 space-y-1">
              <div className="flex justify-between"><span className="text-muted">Direct</span><span className="font-mono text-ink">{f2(h.direct)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Indirect</span><span className="font-mono text-ink">{f2(h.indirect)}</span></div>
              <div className="flex justify-between border-t border-divider pt-1"><span className="font-medium text-ink">Overall</span><span className="font-mono font-semibold text-ink">{f2(h.overall)} · {pctText(h.pct)}</span></div>
            </div>
            <div className="mt-2"><StatusPill status={h.status} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Courses({ courses, cfg, onAdd, onUploadSem }: { courses: { course: Course; r: CourseResult }[]; cfg: Config; onAdd: (t: 'theory' | 'lab') => void; onUploadSem: (n: number) => void }) {
  const groups = new Map<number, typeof courses>();
  for (const x of courses) { const n = semNo(x.course) ?? 0; groups.set(n, [...(groups.get(n) ?? []), x]); }
  const order = [...groups.keys()].sort((a, b) => (a || 99) - (b || 99));
  const grouped = order.some(n => n > 0);
  let at = 0;
  return (
    <section id="courses" className="mt-12 scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-[24px] font-bold text-ink">Courses</h2>
          <p className="mt-1 text-[13.5px] text-soft">CO attainment per course, out of 3 and as a percentage. Open one to fill or check it.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onAdd('theory')}><Plus size={15} />Theory course</Button>
          <Button onClick={() => onAdd('lab')}><Plus size={15} />Lab course</Button>
        </div>
      </div>
      {order.map(n => (
      <div key={n} className={grouped ? 'mt-7 first:mt-0' : ''}>
        {grouped && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-divider pb-2">
            <h3 className="font-serif text-[18px] font-bold text-ink">{n ? <>Semester {n} <span className="text-muted">· {CLASSES[Math.floor((n - 1) / 2)]}</span></> : 'Semester not set'}</h3>
            {n > 0 && <Button onClick={() => onUploadSem(n)}><Upload size={14} />Upload Sem {n} marks</Button>}
          </div>
        )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.get(n)!.map(({ course: c, r }) => {
          const i = at++;
          const steps = courseSteps(c, r), done = steps.filter(x => x.done).length, st = statusOf(r.level, cfg);
          return (
            <motion.div key={c.id} variants={rise} initial="hidden" animate="show" custom={Math.min(i, 8)}>
              <Link to={`/nba/c/${c.id}`} onPointerMove={glowMove} className="glow group flex h-full flex-col rounded-2xl border border-hairline bg-raised p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[12.5px] font-medium text-brand-ink">{c.code || 'New course'}</span>
                  <span className="flex items-center gap-1.5">
                    {c.cls && <Pill>{c.cls}{c.sem && ` · Sem ${c.sem}`}</Pill>}
                    <Pill tone={c.type === 'lab' ? 'info' : 'brand'}>{c.type === 'lab' ? 'Lab' : 'Theory'}</Pill>
                  </span>
                </div>
                <h3 className="mt-1.5 line-clamp-2 font-serif text-[19px] font-bold leading-tight text-ink">{c.name || 'Untitled course'}</h3>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[12px] text-muted">CO attainment</div>
                    <div className="mt-0.5 flex items-baseline gap-2">
                      <span className={cn('font-serif text-[30px] font-bold leading-none tabular', r.level == null ? 'text-faint' : 'text-ink')}>{r.level == null ? '—' : r.level.toFixed(2)}</span>
                      {r.pct != null && <span className={cn('font-mono text-[13px]', statusText(st))}>{r.pct.toFixed(1)}%</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] text-muted">COs on target</div>
                    <div className="mt-0.5 font-mono text-[15px] text-ink">{r.coCount ? `${r.coMet}/${r.coCount}` : '—'}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-1">
                  {r.cos.map((x, k) => <span key={k} title={`CO${k + 1}: ${f2(x.level)}`} className={cn('h-1.5 flex-1 rounded-full', x.met == null ? 'bg-sunk' : x.met ? 'bg-good' : 'bg-bad')} />)}
                </div>
                <div className="mt-auto flex items-center gap-2 border-t border-divider pt-3.5 text-[12px] text-muted" style={{ marginTop: 16 }}>
                  <span className="flex gap-0.5">{steps.map(x => <span key={x.key} title={x.label}><StatusMark s={x.done ? 'done' : 'empty'} /></span>)}</span>
                  <span className="flex-1">{done === steps.length ? 'Complete' : `${done} of ${steps.length} steps`}{c.students.length ? ` · ${c.students.length} students` : ''}</span>
                  <ArrowUpRight size={17} className="text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-ink" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      </div>
      ))}
    </section>
  );
}

/* Where Criterion 3 of the SAR stands, item by item. */
function SarStrip({ s, p }: { s: NbaState; p: ReturnType<typeof programResult> }) {
  const n = s.courses.length;
  const mapped = s.courses.filter(c => c.cos.length && c.cos.every(co => co.map.some(m => m && m > 0))).length;
  const attained = p.courses.filter(x => x.r.level != null).length;
  const direct = p.outcomes.filter(o => o.direct != null).length, indirect = p.outcomes.filter(o => o.indirect != null).length;
  const items = [
    { code: '3.1', title: 'Correlation between courses and POs & PSOs', marks: 20, have: n ? `${mapped} of ${n} courses mapped` : 'No courses yet', done: n > 0 && mapped === n, to: '#courses' },
    { code: '3.2', title: 'Attainment of course outcomes', marks: 40, have: n ? `${attained} of ${n} courses with CO attainment` : 'No courses yet', done: n > 0 && attained === n, to: '#courses' },
    { code: '3.3', title: 'Attainment of POs & PSOs', marks: 60, have: `Direct for ${direct} of 15 · indirect for ${indirect} of 15`, done: direct === 15 && indirect === 15, to: '/nba/indirect' },
  ];
  return (
    <section className="mt-14 rounded-2xl border border-hairline bg-raised p-5 shadow-sm sm:p-7">
      <Eyebrow>Self-assessment report</Eyebrow>
      <h2 className="mt-1.5 font-serif text-[24px] font-bold text-ink">Criterion 3, item by item</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {items.map(it => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12.5px] font-medium text-brand-ink">{it.code}</span>
                <span className="font-mono text-[12px] text-muted">{it.marks} marks</span>
              </div>
              <div className="mt-1 text-[15px] font-semibold leading-snug text-ink">{it.title}</div>
              <div className="mt-3 flex items-center gap-2 text-[12.5px] text-soft"><StatusMark s={it.done ? 'done' : it.have.startsWith('No') ? 'empty' : 'partial'} />{it.have}</div>
            </>
          );
          const cls = 'block rounded-xl border border-divider bg-surface/40 p-4 transition hover:border-hairline hover:bg-sunk';
          return it.to.startsWith('#') ? <a key={it.code} href={it.to} className={cls}>{inner}</a> : <Link key={it.code} to={it.to} className={cls}>{inner}</Link>;
        })}
      </div>
      <p className="mt-4 text-[12px] text-muted">Marks as in the NBA SAR for Tier II UG engineering programmes (120 for Criterion 3). Check them against the SAR format your programme files under.</p>
    </section>
  );
}
