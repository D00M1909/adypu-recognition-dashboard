import { useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Download, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Eyebrow, Pill, cn } from '../../components/ui';
import {
  OUT_CODES, STATUS_LABEL, addYear, f2, mean, normYear, pctText, programResult, removeYear, stateForYear, statusOf, switchYear, useNba, yearsOf, type OutcomeResult,
} from '../../nba/model';
import { downloadAttainment } from '../../nba/excel';
import { Card, NbaNav, StatusPill, saving, statusText, withUndo } from '../../nba/parts';

const MODES = [['overall', 'Overall'], ['direct', 'Direct'], ['indirect', 'Indirect']] as const;
type Mode = (typeof MODES)[number][0];
const WANT = 3;

export function NbaYears() {
  const s = useNba(), cfg = s.config;
  const years = yearsOf(s);
  const per = years.map(y => ({ y, st: stateForYear(s, y), p: programResult(stateForYear(s, y)) }));
  const [text, setText] = useState('');
  const [copy, setCopy] = useState(true);
  const [mode, setMode] = useState<Mode>('overall');
  const norm = normYear(text), taken = norm != null && years.includes(norm);
  const err = text.trim() && !norm ? 'Use two consecutive years, like 2024–25.' : taken ? `${norm} is already there.` : '';
  const missing = WANT - years.length;

  function add() {
    if (!norm || taken) return;
    withUndo(`${norm} added`, () => addYear(norm, copy), copy ? `Courses, COs and mapping copied from ${s.year}; marks left empty.` : 'Empty year; add courses or upload marks after switching to it.');
    setText('');
  }
  const val = (o: OutcomeResult) => mode === 'overall' ? o.overall : mode === 'direct' ? o.direct : o.indirect;

  return (
    <>
      <NbaNav />
      <header className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-[680px]">
          <Eyebrow>NBA · Criterion 3 · Academic years</Eyebrow>
          <h1 className="mt-2 font-serif text-[clamp(28px,4vw,40px)] font-bold leading-tight text-ink">Three years of attainment</h1>
          <p className="mt-2 text-[14.5px] text-soft">The SAR compares PO and PSO attainment across the last three academic years. Switch year to enter its courses and marks; every page shows the year in the corner of the bar above.</p>
        </div>
        <Button kind="solid" className="h-11 rounded-xl px-5" onClick={() => saving('the PO attainment export', () => downloadAttainment(s))}><Download size={16} />Export PO attainment</Button>
      </header>

      {missing > 0 && (
        <div className="mt-6 rounded-xl bg-warn-bg px-4 py-3 text-[13.5px] text-warn">
          NBA asks for three years; add {missing} more{years.length === 1 ? '' : ' to complete the comparison'}.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {per.map(({ y, st, p }) => {
          const active = y === s.year, status = statusOf(p.overall, cfg);
          return (
            <section key={y} className={cn('flex flex-col rounded-2xl border bg-raised p-5 shadow-sm', active ? 'border-[var(--brand-ink)]' : 'border-hairline')}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-[24px] font-bold leading-none text-ink">{y}</span>
                {active ? <Pill tone="brand" dot>Active</Pill> : <StatusPill status={status} short />}
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <div className="text-[12px] text-muted">Average PO &amp; PSO attainment</div>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className={cn('font-serif text-[30px] font-bold leading-none tabular', p.overall == null ? 'text-faint' : 'text-ink')}>{f2(p.overall)}</span>
                    {p.pct != null && <span className={cn('font-mono text-[13px]', statusText(status))}>{pctText(p.pct)}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] text-muted">Courses</div>
                  <div className="mt-0.5 font-mono text-[15px] text-ink">{st.courses.length}</div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[12.5px] text-muted">{status ? STATUS_LABEL[status] : 'No data yet'}{active && status && <StatusPill status={status} short />}</div>
              <div className="mt-auto flex items-center gap-2 pt-4">
                {!active && <Button onClick={() => { switchYear(y); toast.success(`Now working in ${y}`); }}>Switch to {y}<ArrowRight size={14} /></Button>}
                <Button kind="quiet" className="ml-auto" disabled={years.length < 2} title={years.length < 2 ? 'Keep at least one year' : `Remove ${y}`}
                  onClick={() => withUndo(`${y} removed`, () => removeYear(y), `${st.courses.length} course${st.courses.length === 1 ? '' : 's'} removed with it.`)}><Trash2 size={15} />Remove</Button>
              </div>
            </section>
          );
        })}
      </div>

      <Card className="mt-6" title="Add a year" sub="Years are academic years running June to May, written like 2024–25.">
        <div className="flex flex-wrap items-start gap-4 p-5">
          <div className="w-full max-w-[220px]">
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="2024–25" aria-label="Academic year"
              className="w-full rounded-lg border border-hairline bg-raised px-3 py-2 font-mono text-[14px] text-ink outline-none transition placeholder:text-faint focus:border-[var(--brand-ink)]" />
            {err && <p className="mt-1.5 text-[12px] text-bad">{err}</p>}
          </div>
          <label className="flex min-w-[240px] flex-1 items-start gap-2.5 pt-2 text-[13.5px] text-soft">
            <input type="checkbox" checked={copy} onChange={e => setCopy(e.target.checked)} className="mt-0.5 size-4 accent-[var(--brand)]" />
            <span>Copy courses, COs and mapping from {s.year}<span className="block text-[12px] text-muted">Marks, result counts, students and survey responses start empty.</span></span>
          </label>
          <Button kind="solid" disabled={!norm || taken} onClick={add}><Plus size={15} />Add year</Button>
        </div>
      </Card>

      <Card className="mt-6" title="PO &amp; PSO attainment across the years" sub="Out of 3, coloured by status. Trend compares the latest year with the earliest that has data."
        aside={<div className="flex rounded-lg bg-sunk p-0.5 text-[12.5px]" role="group" aria-label="Show">
          {MODES.map(([k, l]) => <button key={k} onClick={() => setMode(k)} aria-pressed={mode === k}
            className={cn('rounded-md px-3 py-1 transition', mode === k ? 'bg-raised font-medium text-ink shadow-sm' : 'text-soft hover:text-ink')}>{l}</button>)}
        </div>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[13px]">
            <thead>
              <tr className="text-muted">
                <th className="px-5 py-2.5 text-left font-medium">Outcome</th>
                {years.map(y => <th key={y} className={cn('px-3 py-2.5 text-center font-mono text-[12px] font-medium', y === s.year && 'text-ink')}>{y}</th>)}
                <th className="px-3 py-2.5 text-center font-medium">Average</th>
                <th className="px-3 py-2.5 text-center font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {OUT_CODES.map((code, o) => {
                const vals = per.map(x => val(x.p.outcomes[o])), avg = mean(vals);
                const got = vals.filter((v): v is number => v != null), delta = got.length > 1 ? got[got.length - 1] - got[0] : null;
                return (
                  <tr key={code} className={cn('border-t border-divider', o === 12 && 'border-t-2 border-hairline')}>
                    <td className="px-5 py-2"><span className="font-mono text-[12.5px] font-medium text-brand-ink">{code}</span><span className="ml-2 text-soft">{s.outcomes[o]?.title}</span></td>
                    {vals.map((v, i) => <td key={i} className={cn('px-3 py-2 text-center font-mono tabular', statusText(statusOf(v, cfg)))}>{f2(v)}</td>)}
                    <td className={cn('px-3 py-2 text-center font-mono font-semibold tabular', statusText(statusOf(avg, cfg)))}>{f2(avg)}</td>
                    <td className="px-3 py-2 text-center">
                      {delta == null ? <span className="text-faint">—</span>
                        : Math.abs(delta) < .05 ? <span className="inline-flex items-center gap-1 text-muted"><ArrowRight size={14} /></span>
                        : delta > 0 ? <span className="inline-flex items-center gap-1 text-good" title={`+${delta.toFixed(2)}`}><ArrowUpRight size={15} /><span className="font-mono text-[11.5px]">+{delta.toFixed(2)}</span></span>
                        : <span className="inline-flex items-center gap-1 text-bad" title={delta.toFixed(2)}><ArrowDownRight size={15} /><span className="font-mono text-[11.5px]">{delta.toFixed(2)}</span></span>}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-hairline bg-[color-mix(in_srgb,var(--brand)_4%,transparent)]">
                <td className="px-5 py-2.5 font-semibold text-ink">Average of all</td>
                {per.map(x => <td key={x.y} className="px-3 py-2.5 text-center font-mono font-semibold tabular text-ink">{f2(mode === 'overall' ? x.p.overall : mean(x.p.outcomes.map(val2(mode))))}</td>)}
                <td className="px-3 py-2.5 text-center font-mono font-semibold tabular text-ink">{f2(mean(per.map(x => mean(x.p.outcomes.map(val2(mode))))))}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

const val2 = (m: Mode) => (o: OutcomeResult) => m === 'overall' ? o.overall : m === 'direct' ? o.direct : o.indirect;
