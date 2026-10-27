import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'motion/react';
import { ArrowRight, ArrowUpRight, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { WORKBOOK_LIST, summaryChart, useAllWorkbooks, type Workbook } from '../engine/workbook';
import { COMING, NAAC_ATTRIBUTES, NAAC_TOTAL, SHORT, results, splitVerdict, standing } from '../lib/naac';
import { useBrand } from '../lib/brand';
import { Dial } from '../components/Dial';
import { Bars } from '../components/Bars';
import { Button, CountUp, Dot, Eyebrow, Pill, cn, glowMove } from '../components/ui';

const A4_TOTAL = WORKBOOK_LIST.reduce((s, w) => s + w.def.marks, 0);
const rise: Variants = { hidden: { opacity: 0, y: 16 }, show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: .6, delay: i * .07, ease: [0.22, 1, 0.36, 1] } }) };

export function Home() {
  useAllWorkbooks();
  const b = useBrand();
  const [hover, setHover] = useState<string | null>(null);
  const status = WORKBOOK_LIST.map(wb => ({ wb, tone: standing(wb), started: wb.entered() > 0 }));
  const started = status.filter(s => s.started).length, good = status.filter(s => s.tone === 'good').length;
  const sample = WORKBOOK_LIST.some(w => w.isSample);

  return (
    <>
      <section className="grid items-center gap-8 pt-10 pb-6 lg:grid-cols-[1fr_380px] lg:gap-14 lg:pt-14">
        <motion.div initial="hidden" animate="show">
          <motion.div variants={rise} custom={0}><Eyebrow>NAAC Binary Accreditation · Attribute 4</Eyebrow></motion.div>
          <motion.h1 variants={rise} custom={1} className="mt-3 font-serif text-[clamp(34px,5.2vw,58px)] font-bold leading-[1.04] tracking-[-.01em] text-ink text-balance">
            {b.name || 'Your college'}
          </motion.h1>
          <motion.p variants={rise} custom={2} className="mt-4 max-w-[560px] text-[16.5px] leading-relaxed text-soft">
            Financial Resources &amp; Management, {A4_TOTAL} marks. Fill each metric here or drop in its Excel workbook, and see where you stand.
          </motion.p>
          <motion.div variants={rise} custom={3} className="mt-7 flex flex-wrap items-center gap-3">
            <Link to={`/a4/${WORKBOOK_LIST[0].def.id}`} className="group inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-[14.5px] font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[.98]">
              {started ? 'Continue' : 'Start with 4.1'} <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            {sample
              ? <Button kind="quiet" className="h-11" onClick={() => { WORKBOOK_LIST.filter(w => w.isSample).forEach(w => w.clear()); toast('Sample data cleared'); }}><X size={16} />Clear sample data</Button>
              : !started && <Button kind="ghost" className="h-11 rounded-xl" onClick={() => { WORKBOOK_LIST.forEach(w => w.loadSample()); toast.success('Sample data loaded', { description: 'Made-up figures, to show how filled workbooks look.' }); }}><Sparkles size={16} className="text-accent" />Try with sample data</Button>}
            {sample && <Pill tone="info" dot>Showing sample data</Pill>}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: .94, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <Dial parts={status.map(s => ({ id: s.wb.def.id, marks: s.wb.def.marks, tone: s.tone, started: s.started }))} hover={hover} onHover={setHover}>
            {hover
              ? <HoverReadout wb={WORKBOOK_LIST.find(w => w.def.id === hover)!} />
              : <div>
                  <div className="font-serif text-[46px] font-bold leading-none text-ink tabular"><CountUp text={String(started ? good : 0)} /><span className="text-faint">/4</span></div>
                  <div className="mt-2 text-[12px] leading-snug text-muted">{started ? 'metrics in good standing' : 'metrics not started'}</div>
                </div>}
          </Dial>
        </motion.div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-serif text-[24px] font-bold text-ink">The four metrics</h2>
          <span className="font-mono text-[12px] text-muted">{A4_TOTAL} marks</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {WORKBOOK_LIST.map((wb, i) => <MetricCard key={wb.def.id} wb={wb} i={i} hot={hover === wb.def.id} onHover={setHover} />)}
        </div>
        <p className="mt-4 text-[12.5px] text-muted">NAAC’s draft names the ratios for 4.1 and 4.2 without publishing how they are scored. Bands are the workbooks’ indicative guidance.</p>
      </section>

      <FrameworkStrip />
    </>
  );
}

function HoverReadout({ wb }: { wb: Workbook }) {
  const head = results(wb)[0], [v] = splitVerdict(head.text);
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="px-1">
      <div className="font-mono text-[11px] text-brand-ink">{wb.def.id} · {wb.def.marks} marks</div>
      <div className="mt-1 font-serif text-[26px] font-bold leading-tight text-ink">{v}</div>
      <div className="mt-1 text-[11.5px] leading-snug text-muted">{SHORT[wb.def.id]}</div>
    </motion.div>
  );
}

function MetricCard({ wb, i, hot, onHover }: { wb: Workbook; i: number; hot: boolean; onHover: (id: string | null) => void }) {
  const [head, ...rest] = results(wb), chart = summaryChart(wb);
  const n = wb.entered(), total = wb.inputCount(), [verdict, gloss] = splitVerdict(head.text);
  const ratio = /×$|%$/.test(head.text);
  const band = ratio ? rest.find(r => r.label.startsWith('Band')) : undefined;
  return (
    <motion.div variants={rise} initial="hidden" animate="show" custom={i + 2}>
      <Link to={`/a4/${wb.def.id}`} onPointerMove={glowMove} onPointerEnter={() => onHover(wb.def.id)} onPointerLeave={() => onHover(null)}
        className={cn('glow group flex h-full flex-col rounded-2xl border bg-raised p-5 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6',
          hot ? 'border-[color-mix(in_srgb,var(--brand)_45%,var(--hairline))]' : 'border-hairline')}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[12.5px] font-medium text-brand-ink">Metric {wb.def.id}</span>
          <span className="font-mono text-[12px] text-muted">{wb.def.marks} marks</span>
        </div>
        <h3 className="mt-1.5 font-serif text-[22px] font-bold leading-tight text-ink">{SHORT[wb.def.id]}</h3>

        <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4">
          <div className="min-w-0">
            <div className="text-[12px] text-muted">{head.label}</div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className={cn('font-serif text-[34px] font-bold leading-none', head.empty ? 'text-faint' : 'text-ink')}>
                {ratio ? <CountUp text={head.text} /> : verdict}
              </span>
              {band && !band.empty && <Pill tone={band.tone}>{splitVerdict(band.text)[0]}</Pill>}
              {!ratio && head.tone && <Pill tone={head.tone} dot>{head.tone === 'good' ? 'Met' : head.tone === 'warn' ? 'Partly met' : 'Not met'}</Pill>}
            </div>
            {gloss && !ratio && <div className="mt-1 truncate text-[12px] text-muted">{gloss}</div>}
          </div>
          {chart && <Bars data={chart} mini className="w-[150px] sm:w-[180px]" />}
        </div>

        <ul className="mt-5 space-y-2 border-t border-divider pt-4">
          {rest.filter(r => r !== band).map(r => (
            <li key={r.label} className="flex items-center justify-between gap-3 text-[13px]">
              <span className="truncate text-soft">{r.label}</span>
              {r.money
                ? <span className="font-mono text-[12.5px] text-ink tabular">{r.empty ? '—' : <>₹<CountUp text={r.text} /> L</>}</span>
                : r.empty ? <span className="text-faint">—</span> : <span className="flex items-center gap-2 text-[12.5px] font-medium text-body"><Dot tone={r.tone} />{splitVerdict(r.text)[0]}</span>}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center gap-3 pt-5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunk">
            <motion.div className="h-full rounded-full bg-brand" initial={{ width: 0 }} animate={{ width: `${n / total * 100}%` }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <span className="shrink-0 font-mono text-[11.5px] text-muted">{wb.isSample ? 'sample' : `${n}/${total}`}</span>
          <ArrowUpRight size={18} className="shrink-0 text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-ink" />
        </div>
      </Link>
    </motion.div>
  );
}

function FrameworkStrip() {
  return (
    <section className="mt-14 rounded-2xl border border-hairline bg-raised p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>The whole framework</Eyebrow>
          <h2 className="mt-1.5 font-serif text-[24px] font-bold text-ink">{NAAC_TOTAL} marks across ten attributes</h2>
        </div>
        <Link to="/naac" className="group flex items-center gap-1.5 text-[13.5px] font-medium text-brand-ink">All attributes <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></Link>
      </div>
      <div className="mt-6 flex h-11 gap-1">
        {NAAC_ATTRIBUTES.map((a, i) => (
          <motion.div key={a.n} title={`${a.n}. ${a.title} · ${a.marks} marks`}
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: i * .04, duration: .5, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: a.marks }}
            className={cn('relative grid origin-bottom place-items-center rounded-md font-mono text-[11px]', a.live ? 'bg-brand text-white shadow-sm' : 'bg-sunk text-muted')}>
            {a.n}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted">
        <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-[3px] bg-brand" />Open now: 4. Financial Resources &amp; Management</span>
        <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-[3px] bg-sunk ring-1 ring-hairline" />Coming</span>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-divider pt-5">
        <span className="mr-1 text-[12.5px] font-medium text-soft">Coming next</span>
        {COMING.map(c => <span key={c} className="rounded-full border border-hairline px-3 py-1 text-[12.5px] text-soft">{c}</span>)}
      </div>
    </section>
  );
}
