import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileSpreadsheet, RotateCcw, Sparkles, Upload } from 'lucide-react';
import { Button, Eyebrow, cn } from '../../components/ui';
import { DEFAULT_CONFIG, OUT_CODES, edit, useNba, type Config } from '../../nba/model';
import { Card, Field, NbaNav, NumInput, Split, TextInput, saving, useFilePicker, withUndo } from '../../nba/parts';
import { downloadStructure } from '../../nba/excel';
import { importStructure } from '../../nba/actions';

/** Two weights that always make 100%: moving one moves the other. */
function Pair({ title, hint, a, b, la, lb, onChange }: { title: string; hint: string; a: number; b: number; la: string; lb: string; onChange: (a: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3"><span className="text-[14px] font-semibold text-ink">{title}</span><span className="text-[12px] text-muted">{hint}</span></div>
      <Split className="mt-2" parts={[{ label: la, pct: a }, { label: lb, pct: b, tone: 'accent' }]} />
      <div className="mt-2 flex items-center gap-3">
        <input type="range" min={0} max={100} step={5} value={a} onChange={e => onChange(+e.target.value)} className="flex-1 accent-[var(--brand)]" aria-label={`${la} %`} />
        <div className="w-20"><NumInput value={a} min={0} max={100} onChange={v => typeof v === 'number' && onChange(Math.max(0, Math.min(100, v)))} label={`${la} %`} /></div>
      </div>
    </div>
  );
}

export function NbaSetup() {
  const s = useNba(), cfg = s.config;
  const setCfg = (patch: Partial<Config>) => edit(st => ({ ...st, config: { ...st.config, ...patch } }));
  const setProg = (patch: Partial<typeof s.program>) => edit(st => ({ ...st, program: { ...st.program, ...patch } }));
  const changed = (Object.keys(DEFAULT_CONFIG) as (keyof Config)[]).some(k => cfg[k] !== DEFAULT_CONFIG[k]);
  const [allYears, setAllYears] = useState(false);
  const picker = useFilePicker(f => importStructure(f, allYears));
  const bandsOk = cfg.critA > cfg.critB && cfg.critB > cfg.critC, statusOk = cfg.partial > cfg.low;

  return (
    <>
      <NbaNav />
      <header className="mt-8 max-w-[680px]">
        <Eyebrow>NBA · Criterion 3 · Setup</Eyebrow>
        <h1 className="mt-2 font-serif text-[clamp(28px,4vw,40px)] font-bold leading-tight text-ink">Programme, weightages &amp; targets</h1>
        <p className="mt-2 text-[14.5px] text-soft">The defaults follow the worked example. Change any of them and every course and outcome recalculates at once.</p>
      </header>

      <Card className="mt-6" title="Programme">
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Programme" className="sm:col-span-2"><TextInput value={s.program.name} onChange={v => setProg({ name: v })} placeholder="B.Tech Computer Engineering" /></Field>
          <Field label="Department" className="sm:col-span-2"><TextInput value={s.program.dept} onChange={v => setProg({ dept: v })} placeholder="Computer Engineering" /></Field>
          <Field label="Batch"><TextInput value={s.program.batch} onChange={v => setProg({ batch: v })} placeholder="2017–21" /></Field>
          <Field label="Assessment year"><div className="flex h-[42px] items-center gap-2 text-[14px]"><span className="font-mono text-ink">{s.year}</span><Link to="/nba/years" className="text-[12.5px] font-medium text-brand-ink hover:underline">Manage years</Link></div></Field>
        </div>
      </Card>

      {picker.input}
      <Card className="mt-6" title="Programme structure from the university" sub="One workbook with every course's COs, statements and CO–PO/PSO mapping. Courses are matched by code; marks and assessment links stay.">
        <div className="flex flex-wrap items-center gap-2.5 p-5">
          <Button kind="solid" onClick={picker.open}><Upload size={15} />Upload structure</Button>
          <Button onClick={() => saving('the blank structure template', () => downloadStructure(s, 'blank'))}><FileSpreadsheet size={15} />Blank template</Button>
          <Button onClick={() => saving('the sample structure', () => downloadStructure(s, 'sample'))}><Sparkles size={15} />Sample</Button>
          <Button onClick={() => saving('the current structure', () => downloadStructure(s, 'filled'))} disabled={!s.courses.length}><Download size={15} />Export current</Button>
          <label className="flex items-center gap-2 text-[13px] text-soft sm:ml-3">
            <input type="checkbox" checked={allYears} onChange={e => setAllYears(e.target.checked)} className="size-4 accent-[var(--brand)]" />
            Also apply to the other years{Object.keys(s.years).length ? ` (${Object.keys(s.years).join(', ')})` : ''}
          </label>
        </div>
      </Card>

      <Card className="mt-6" title="Weightages" sub="Each pair adds up to 100%."
        aside={changed && <Button kind="quiet" onClick={() => withUndo('Weightages and targets reset', () => setCfg({ ...DEFAULT_CONFIG }))}><RotateCcw size={15} />Reset to the example</Button>}>
        <div className="grid gap-8 p-5 lg:grid-cols-2">
          <Pair title="Direct vs indirect" hint="CO and PO attainment both" a={cfg.daW} b={cfg.iaW} la="Direct" lb="Indirect" onChange={a => setCfg({ daW: a, iaW: 100 - a })} />
          <Pair title="Internal vs external" hint="inside the direct part" a={cfg.isW} b={cfg.esW} la="Internal" lb="External" onChange={a => setCfg({ isW: a, esW: 100 - a })} />
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Marks bands" sub="Share of an assessment’s maximum marks.">
          <div className="space-y-3 p-5">
            {([['critA', 'A', 'counts 3'], ['critB', 'B', 'counts 2'], ['critC', 'C', 'counts 1']] as const).map(([k, l, w]) => (
              <div key={k} className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-sunk font-mono text-[13px] font-semibold text-ink">{l}</span>
                <span className="flex-1 text-[13.5px] text-soft">At least <span className="text-[12px] text-muted">({w})</span></span>
                <div className="w-24"><NumInput value={cfg[k]} min={0} max={100} onChange={v => typeof v === 'number' && setCfg({ [k]: v })} label={`Band ${l} %`} /></div>
                <span className="w-4 text-[13px] text-muted">%</span>
              </div>
            ))}
            <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-sunk font-mono text-[13px] font-semibold text-ink">D</span><span className="flex-1 text-[13.5px] text-soft">Below C, or absent <span className="text-[12px] text-muted">(counts 0)</span></span></div>
            {!bandsOk && <p className="rounded-lg bg-warn-bg px-3 py-2 text-[12.5px] text-warn">A should be above B, and B above C.</p>}
          </div>
        </Card>

        <Card title="Targets & status" sub="What counts as attained.">
          <div className="space-y-4 p-5">
            <Row label="CO target" hint="% of a CO’s mapping average it must reach. A course can set its own."><NumInput value={cfg.coTarget} min={0} max={100} onChange={v => typeof v === 'number' && setCfg({ coTarget: v })} label="CO target %" /><span className="w-4 text-[13px] text-muted">%</span></Row>
            <Row label="PO target" hint="% of a PO’s mapping average a course must beat."><NumInput value={cfg.poTarget} min={0} max={100} onChange={v => typeof v === 'number' && setCfg({ poTarget: v })} label="PO target %" /><span className="w-4 text-[13px] text-muted">%</span></Row>
            <Row label="Low attained up to" hint={`Out of 3, i.e. ${(cfg.low / 3 * 100).toFixed(0)}%`}><NumInput value={cfg.low} min={0} max={3} onChange={v => typeof v === 'number' && setCfg({ low: v })} label="Low attained up to" /><span className="w-4" /></Row>
            <Row label="Partially attained up to" hint={`Out of 3, i.e. ${(cfg.partial / 3 * 100).toFixed(0)}%. Above it: almost attained.`}><NumInput value={cfg.partial} min={0} max={3} onChange={v => typeof v === 'number' && setCfg({ partial: v })} label="Partially attained up to" /><span className="w-4" /></Row>
            <div className="flex h-3 overflow-hidden rounded-full">
              <span className="bg-bad" style={{ flex: cfg.low }} /><span className="bg-accent" style={{ flex: Math.max(0, cfg.partial - cfg.low) }} /><span className="bg-good" style={{ flex: Math.max(0, 3 - cfg.partial) }} />
            </div>
            {!statusOk && <p className="rounded-lg bg-warn-bg px-3 py-2 text-[12.5px] text-warn">“Partially” should be above “Low”.</p>}
          </div>
        </Card>
      </div>

      <Card className="mt-6" title="Programme outcomes and programme-specific outcomes" sub="The twelve POs are NBA’s graduate attributes; write your three PSOs.">
        <div className="divide-y divide-divider">
          {s.outcomes.map((o, i) => (
            <div key={o.code} className={cn('grid gap-2 px-5 py-3 sm:grid-cols-[64px_220px_1fr] sm:items-start', i === 12 && 'border-t-2 border-hairline')}>
              <span className="pt-2 font-mono text-[12.5px] font-medium text-brand-ink">{OUT_CODES[i]}</span>
              <TextInput value={o.title} onChange={v => edit(st => ({ ...st, outcomes: st.outcomes.map((x, j) => j === i ? { ...x, title: v } : x) }))} placeholder="Short title" label={`${o.code} title`} />
              <TextInput area value={o.text} onChange={v => edit(st => ({ ...st, outcomes: st.outcomes.map((x, j) => j === i ? { ...x, text: v } : x) }))} placeholder={i < 12 ? 'Statement (optional)' : 'Statement'} label={`${o.code} statement`} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Row({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1"><div className="text-[13.5px] font-medium text-ink">{label}</div><div className="text-[12px] text-muted">{hint}</div></div>
      <div className="w-24">{Array.isArray(children) ? children[0] : children}</div>
      {Array.isArray(children) && children[1]}
    </div>
  );
}
