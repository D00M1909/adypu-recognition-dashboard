import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Download, FileSpreadsheet, Plus, Sparkles, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Eyebrow, Pill, btn, cn } from '../../components/ui';
import { N_OUT, OUT_CODES, edit, emptyRow, f2, getNba, pctText, programResult, rowPct, setNba, uid, useNba, type Survey, type SurveyRow } from '../../nba/model';
import { downloadSurveys, mergeSurveys, readWorkbook } from '../../nba/excel';
import { sampleState } from '../../nba/sample';
import { Card, Menu, MenuItem, MenuLabel, MenuSep, NbaNav, NumInput, StatusPill, TextInput, saving, statusText, useFilePicker, withUndo } from '../../nba/parts';

async function importSurveys(f: File) {
  const id = toast.loading(`Reading ${f.name}…`);
  try {
    const r = await readWorkbook(f);
    if (!r.surveys.length) throw new Error('No survey table found: it needs a header row reading PO1 … PO12, PSO1 … PSO3 on a sheet named “Indirect surveys”.');
    const before = getNba();
    setNba(s => ({ ...s, sample: false, surveys: mergeSurveys(s.surveys, r.surveys) }));
    toast.success(`${f.name} loaded`, { id, description: `${r.surveys.length} surveys`, action: { label: 'Undo', onClick: () => setNba(before) } });
  } catch (e) { toast.error('Could not read that file', { id, description: (e as Error).message }); }
}

export function NbaIndirect() {
  const s = useNba(), p = programResult(s), cfg = s.config;
  const picker = useFilePicker(importSurveys);
  const [open, setOpen] = useState<string | null>(s.surveys[0]?.id ?? null);
  const setSurvey = (sid: string, fn: (x: Survey) => Survey) => edit(st => ({ ...st, surveys: st.surveys.map(x => x.id === sid ? fn(x) : x) }));

  return (
    <>
      <NbaNav />
      {picker.input}
      <header className="mt-8 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-[640px]">
          <Eyebrow>NBA · Criterion 3.3 · Indirect assessment · {cfg.iaW}% of PO attainment</Eyebrow>
          <h1 className="mt-2 font-serif text-[clamp(28px,4vw,40px)] font-bold leading-tight text-ink">Surveys &amp; activities</h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-soft">Each survey’s satisfactory response % for every PO and PSO, weighted by its multiplication factor (MF): indirect % = Σ(MF × %) ÷ Σ MF. Type the % directly, or the response counts and let it work the % out as (Excellent + 0.8 Good + 0.6 Satisfactory) ÷ responses.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button kind="solid" onClick={picker.open}><Upload size={16} />Upload survey results</Button>
          <Menu trigger={<button className={btn('ghost')}><FileSpreadsheet size={16} />Templates<ChevronDown size={15} className="text-muted" /></button>}>
            <MenuLabel>To fill in Excel</MenuLabel>
            <MenuItem onSelect={() => saving('the sample file', () => downloadSurveys(sampleState(), false))}><Sparkles size={15} />Sample file, filled in</MenuItem>
            <MenuItem onSelect={() => saving('the blank template', () => downloadSurveys(s, true))}><FileSpreadsheet size={15} />Blank template</MenuItem>
            <MenuSep />
            <MenuItem onSelect={() => saving('the survey results', () => downloadSurveys(s, false))}><Download size={15} />Export these results</MenuItem>
          </Menu>
        </div>
      </header>

      <Card className="mt-6" title="Indirect attainment" sub={`Out of 3 = indirect % × 3 ÷ 100. It carries ${cfg.iaW}% of each PO’s overall attainment.`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-[12.5px]">
            <thead><tr className="text-muted"><th className="sticky left-0 bg-raised px-5 py-2.5 text-left font-medium">Survey · MF</th>{OUT_CODES.map((o, i) => <th key={o} className={cn('px-1.5 py-2.5 text-center font-mono text-[11.5px] font-medium', i === 12 && 'border-l border-divider')}>{o}</th>)}</tr></thead>
            <tbody>
              {s.surveys.map(sv => (
                <tr key={sv.id} className="border-t border-divider">
                  <td className="sticky left-0 whitespace-nowrap bg-raised px-5 py-2 text-body">{sv.name}</td>
                  {sv.rows.map((r, o) => { const v = rowPct(r); return <td key={o} className={cn('px-1.5 py-2 text-center font-mono tabular', i12(o))}>{v == null || !r.mf ? <span className="text-faint">–</span> : <span className="text-ink" title={`MF ${r.mf}`}>{v.toFixed(0)}<sub className="ml-0.5 text-[9.5px] text-muted">×{r.mf}</sub></span>}</td>; })}
                </tr>
              ))}
              <tr className="border-t-2 border-hairline bg-[color-mix(in_srgb,var(--brand)_4%,transparent)]">
                <td className="sticky left-0 bg-raised px-5 py-2 font-semibold text-ink">Indirect %</td>
                {p.outcomes.map((o, i) => <td key={i} className={cn('px-1.5 py-2 text-center font-mono font-semibold text-ink tabular', i12(i))}>{o.indirectPct == null ? '—' : o.indirectPct.toFixed(1)}</td>)}
              </tr>
              <tr className="border-t border-divider">
                <td className="sticky left-0 bg-raised px-5 py-2 font-semibold text-ink">Indirect (of 3)</td>
                {p.outcomes.map((o, i) => <td key={i} className={cn('px-1.5 py-2 text-center font-mono font-semibold tabular', i12(i), statusText(o.indirect == null ? null : o.indirect > cfg.partial ? 'almost' : o.indirect > cfg.low ? 'partial' : 'low'))}>{f2(o.indirect)}</td>)}
              </tr>
              <tr className="border-t border-divider">
                <td className="sticky left-0 bg-raised px-5 py-2 text-muted">× {cfg.iaW}% contribution</td>
                {p.outcomes.map((o, i) => <td key={i} className={cn('px-1.5 py-2 text-center font-mono text-muted tabular', i12(i))}>{o.indirect == null ? '—' : (o.indirect * cfg.iaW / 100).toFixed(2)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-8 flex items-end justify-between gap-3">
        <h2 className="font-serif text-[22px] font-bold text-ink">Fill a survey</h2>
        <Button onClick={() => { const sv: Survey = { id: uid(), name: `Survey ${s.surveys.length + 1}`, activity: false, rows: Array.from({ length: N_OUT }, () => ({ ...emptyRow(), mf: 1 })) }; edit(st => ({ ...st, surveys: [...st.surveys, sv] })); setOpen(sv.id); }}><Plus size={15} />Add survey</Button>
      </div>
      <div className="mt-4 space-y-3">
        {s.surveys.map(sv => (
          <SurveyCard key={sv.id} sv={sv} open={open === sv.id} onToggle={() => setOpen(o => o === sv.id ? null : sv.id)} set={fn => setSurvey(sv.id, fn)}
            onRemove={() => withUndo(`${sv.name} removed`, () => edit(st => ({ ...st, surveys: st.surveys.filter(x => x.id !== sv.id) })))} />
        ))}
      </div>

      <Card className="mt-8" title="Where indirect lands" sub="Overall attainment and status per outcome, with the direct part from the courses.">
        <div className="grid gap-px overflow-hidden rounded-b-2xl bg-divider sm:grid-cols-3 lg:grid-cols-5">
          {p.outcomes.map((o, i) => (
            <div key={i} className="bg-raised p-4">
              <div className="flex items-center justify-between"><span className="font-mono text-[12px] font-medium text-brand-ink">{OUT_CODES[i]}</span><span className="font-mono text-[12px] text-muted">{pctText(o.pct)}</span></div>
              <div className="mt-1 font-serif text-[22px] font-bold text-ink tabular">{f2(o.overall)}</div>
              <div className="mt-1 text-[11.5px] text-muted">D {f2(o.direct)} · I {f2(o.indirect)}</div>
              <div className="mt-2"><StatusPill status={o.status} /></div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
const i12 = (i: number) => (i === 12 ? 'border-l border-divider' : '');

function SurveyCard({ sv, open, onToggle, set, onRemove }: { sv: Survey; open: boolean; onToggle: () => void; set: (fn: (x: Survey) => Survey) => void; onRemove: () => void }) {
  const filled = sv.rows.filter(r => rowPct(r) != null && r.mf).length;
  const setRow = (o: number, patch: Partial<SurveyRow>) => set(x => ({ ...x, rows: x.rows.map((r, j) => j === o ? { ...r, ...patch } : r) }));
  const avg = (() => { const v = sv.rows.map(rowPct).filter((x): x is number => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; })();
  return (
    <div className="rounded-2xl border border-hairline bg-raised shadow-sm">
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-3 px-5 py-4 text-left">
        <motion.span animate={{ rotate: open ? 0 : -90 }} className="text-muted"><ChevronDown size={17} /></motion.span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-ink">{sv.name}</span>
          <span className="text-[12.5px] text-muted">{filled} of 15 outcomes{avg != null && ` · average ${avg.toFixed(1)}% satisfactory`}</span>
        </span>
        {sv.activity && <Pill tone="info">Activity</Pill>}
        <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-sunk sm:block"><motion.span className={cn('block h-full rounded-full', filled === 15 ? 'bg-good' : 'bg-brand')} animate={{ width: `${filled / 15 * 100}%` }} /></span>
      </button>
      {open && (
        <div className="border-t border-divider">
          <div className="flex flex-wrap items-end gap-4 px-5 py-4">
            <label className="min-w-[220px] flex-1"><span className="mb-1.5 block text-[12.5px] font-medium text-soft">Name</span><TextInput value={sv.name} onChange={v => set(x => ({ ...x, name: v }))} /></label>
            <label className="flex items-center gap-2 pb-2 text-[13px] text-soft"><input type="checkbox" checked={sv.activity} onChange={e => set(x => ({ ...x, activity: e.target.checked }))} className="size-4 accent-[var(--brand)]" />Activity (students benefitted %, no response counts)</label>
            <Button kind="quiet" className="text-bad" onClick={onRemove}><Trash2 size={15} />Remove</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-[12.5px]">
              <thead>
                <tr className="text-[12px] text-muted">
                  <th className="px-5 py-2 text-left font-medium">Outcome</th>
                  {!sv.activity && <><th className="w-24 px-1.5 py-2 text-right font-medium">Responses</th><th className="w-24 px-1.5 py-2 text-right font-medium">Excellent ×1</th><th className="w-24 px-1.5 py-2 text-right font-medium">Good ×0.8</th><th className="w-28 px-1.5 py-2 text-right font-medium">Satisfactory ×0.6</th></>}
                  <th className="w-28 px-1.5 py-2 text-right font-medium">{sv.activity ? 'Benefitted %' : 'Satisfactory %'}</th>
                  <th className="w-24 px-1.5 py-2 text-right font-medium">MF</th>
                  <th className="w-28 px-5 py-2 text-right font-medium">MF × %</th>
                </tr>
              </thead>
              <tbody>
                {sv.rows.map((r, o) => {
                  const fromCounts = r.pct == null && rowPct(r) != null, v = rowPct(r);
                  return (
                    <tr key={o} className="border-t border-divider">
                      <td className="px-5 py-1.5 font-mono text-[12px] font-medium text-brand-ink">{OUT_CODES[o]}</td>
                      {!sv.activity && (['total', 'ex', 'good', 'sat'] as const).map(k => (
                        <td key={k} className="px-1.5 py-1"><NumInput value={r[k]} step={1} min={0} onChange={x => setRow(o, { [k]: typeof x === 'number' ? x : null, pct: null })} label={`${OUT_CODES[o]} ${k}`} /></td>
                      ))}
                      <td className="px-1.5 py-1">
                        {fromCounts
                          ? <div className="px-2 py-1.5 text-right font-mono text-ink tabular" title="From the response counts">{v!.toFixed(2)}</div>
                          : <NumInput value={r.pct} min={0} max={100} onChange={x => setRow(o, { pct: typeof x === 'number' ? x : null })} label={`${OUT_CODES[o]} %`} />}
                      </td>
                      <td className="px-1.5 py-1"><NumInput value={r.mf} min={0} max={1} onChange={x => setRow(o, { mf: typeof x === 'number' ? x : null })} label={`${OUT_CODES[o]} MF`} placeholder="–" /></td>
                      <td className="px-5 py-1.5 text-right font-mono text-muted tabular">{v != null && r.mf ? (v * r.mf).toFixed(2) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-divider px-5 py-3 text-[12px] text-muted">Leave MF blank where this survey doesn’t ask about an outcome. MF 0.5 halves a survey’s say, as the parent and exit surveys do in the worked example.</p>
        </div>
      )}
    </div>
  );
}
