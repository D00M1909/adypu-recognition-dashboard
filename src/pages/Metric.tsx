import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { AlertTriangle, ChevronDown, Download, FileSpreadsheet, MoreHorizontal, Sparkles, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { WORKBOOK_LIST, useWorkbook, workbookById, type Workbook } from '../engine/workbook';
import { exportFile, importFile, type ImportReport } from '../engine/io';
import { SHORT, results, splitVerdict } from '../lib/naac';
import { Sheet } from '../components/Sheet';
import { findTab, sheetLabel, sheetTabs } from '../components/sheetTabs';
import { Button, CountUp, Eyebrow, Pill, btn, cn } from '../components/ui';

const A4_TOTAL = WORKBOOK_LIST.reduce((s, w) => s + w.def.marks, 0);

export function Metric() {
  const { id, tab } = useParams();
  const wb = workbookById(id);
  if (!wb) return <Navigate to="/" replace />;
  return <MetricPage key={wb.def.id} wb={wb} tabKey={tab} />;
}

function MetricPage({ wb, tabKey }: { wb: Workbook; tabKey?: string }) {
  useWorkbook(wb);
  const nav = useNavigate();
  const tabs = sheetTabs(wb), tab = findTab(tabs, tabKey);
  const [report, setReport] = useState<(ImportReport & { name: string }) | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const n = wb.entered(), total = wb.inputCount();
  const goTab = (key: string) => { nav(`/a4/${wb.def.id}/${key}`, { replace: true }); scrollTo({ top: 0, behavior: 'smooth' }); };

  async function upload(f: File) {
    const before = { ...wb.values }, wasSample = wb.isSample;
    const id = toast.loading(`Reading ${f.name}…`);
    try {
      const rep = await importFile(wb, f);
      setReport(rep.warnings.length || rep.missing.length ? { ...rep, name: f.name } : null);
      toast.success(`${f.name} loaded`, {
        id, description: `${rep.filled} cells filled${rep.warnings.length ? ` · ${rep.warnings.length} to check` : ''}`,
        action: { label: 'Undo', onClick: () => { wb.replace(before, wasSample); setReport(null); } },
      });
    } catch (e) { toast.error('Could not read that file', { id, description: (e as Error).message }); }
  }
  async function download() {
    const id = toast.loading('Preparing the workbook…');
    try { await exportFile(wb); toast.success('Downloaded', { id, description: 'Formulas recalculate when you open it in Excel or Google Sheets.' }); }
    catch (e) { toast.error('Download failed', { id, description: (e as Error).message }); }
  }
  function withUndo(label: string, act: () => void) {
    const before = { ...wb.values }, wasSample = wb.isSample;
    act();
    toast(label, { action: { label: 'Undo', onClick: () => wb.replace(before, wasSample) } });
  }

  return (
    <DropZone wb={wb} onFile={upload}>
      <MetricSwitch current={wb} />

      <header className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <Eyebrow>Metric {wb.def.id} · {wb.def.marks} of {A4_TOTAL} marks</Eyebrow>
          <h1 className="mt-2 font-serif text-[clamp(28px,4vw,40px)] font-bold leading-tight text-ink">{SHORT[wb.def.id]}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input ref={file} type="file" accept=".xlsx,.xlsm,.xls,.ods" hidden onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }} />
          <Button kind="solid" onClick={() => file.current?.click()}><Upload size={16} />Upload Excel</Button>
          <Button onClick={download}><Download size={16} />Download</Button>
          <Dropdown.Root>
            <Dropdown.Trigger className={btn('ghost', 'w-9 px-0')} aria-label="More actions"><MoreHorizontal size={17} /></Dropdown.Trigger>
            <Dropdown.Portal>
              <Dropdown.Content align="end" sideOffset={6} className="z-50 min-w-[220px] origin-[var(--radix-dropdown-menu-content-transform-origin)] rounded-xl border border-hairline bg-raised p-1.5 shadow-lg data-[state=open]:animate-[pop_.16s_ease-out]">
                <MenuItem onSelect={() => { location.href = import.meta.env.BASE_URL + wb.def.file; }}><FileSpreadsheet size={15} />Blank template</MenuItem>
                <MenuItem onSelect={() => withUndo(`Sample data loaded in ${wb.def.id}`, () => wb.loadSample())}><Sparkles size={15} />Load sample data</MenuItem>
                <Dropdown.Separator className="my-1 h-px bg-divider" />
                <MenuItem danger disabled={!n} onSelect={() => withUndo(`${wb.def.id} cleared`, () => { wb.clear(); setReport(null); })}><Trash2 size={15} />Clear all data</MenuItem>
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {wb.isSample && (
          <Banner key="sample" tone="info" onClose={() => withUndo('Sample data cleared', () => wb.clear())} closeLabel="Clear sample data">
            <b>Sample data.</b> Made-up figures to show how a filled workbook looks. Upload your Excel to replace them.
          </Banner>
        )}
        {report && (
          <Banner key="report" tone="warn" onClose={() => setReport(null)} closeLabel="Dismiss">
            <details>
              <summary className="cursor-pointer"><b>{report.name}</b>: {report.warnings.length} cell{report.warnings.length === 1 ? '' : 's'} to check{report.missing.length ? `, ${report.missing.length} sheet${report.missing.length === 1 ? '' : 's'} missing` : ''}</summary>
              <ul className="mt-2 max-h-48 list-disc space-y-0.5 overflow-auto pl-5 font-mono text-[12px]">
                {report.missing.map(m => <li key={m}>Sheet not found: {m}</li>)}
                {report.warnings.slice(0, 60).map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </details>
          </Banner>
        )}
      </AnimatePresence>

      <Kpis wb={wb} />

      <div className="mt-8 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-sunk">
          <motion.div className="h-full rounded-full bg-brand" animate={{ width: `${n / total * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} />
        </div>
        <span className="font-mono text-[11.5px] text-muted tabular"><CountUp text={String(n)} /> of {total} cells filled</span>
      </div>

      <nav className="no-scrollbar sticky top-16 z-30 -mx-4 mt-3 overflow-x-auto bg-surface/85 px-4 backdrop-blur-md sm:-mx-6 sm:px-6" aria-label="Workbook sheets">
        <div className="flex min-w-max gap-1 border-b border-hairline">
          {tabs.map(t => {
            const on = t === tab, done = t.input ? wb.entered(t.sheets[0]) / wb.inputCount(t.sheets[0]) : 0;
            return (
              <Link key={t.key} to={`/a4/${wb.def.id}/${t.key}`} replace
                className={cn('relative flex items-center gap-2 px-3 py-3 text-[13.5px] font-medium transition-colors', on ? 'text-ink' : 'text-muted hover:text-ink', t.key === 'help' && 'ml-auto')}>
                {t.input && <Ring v={done} />}
                {t.label}
                {on && <motion.span layoutId="sheet-tab" className="absolute inset-x-2 -bottom-px h-[2.5px] rounded-full bg-brand" transition={{ type: 'spring', stiffness: 520, damping: 40 }} />}
              </Link>
            );
          })}
        </div>
      </nav>

      {tab.input && <p className="mt-4 text-[13px] text-muted">Type in the <span className="rounded bg-[var(--cream)] px-1.5 py-0.5 text-ink ring-1 ring-[var(--cream-edge)]">cream</span> cells or upload the filled Excel. Everything else calculates itself: hover a cell to see its formula. Enter moves down.</p>}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .22, ease: [0.22, 1, 0.36, 1] }} className="mt-4 space-y-8">
          {tab.sheets.map(si => (
            <section key={si}>
              {tab.sheets.length > 1 && <h2 className="mb-3 font-serif text-[20px] font-bold text-ink">{sheetLabel(wb.def.sheets[si].name)}</h2>}
              <Sheet wb={wb} si={si} />
            </section>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex justify-between gap-3">
        {(() => {
          const i = tabs.indexOf(tab), prev = tabs[i - 1], next = tabs[i + 1];
          return <>
            {prev ? <Button onClick={() => goTab(prev.key)}>← {prev.label}</Button> : <span />}
            {next && <Button kind="solid" onClick={() => goTab(next.key)}>{next.label} →</Button>}
          </>;
        })()}
      </div>
    </DropZone>
  );
}

function MenuItem({ children, danger, ...p }: Dropdown.DropdownMenuItemProps & { danger?: boolean }) {
  return <Dropdown.Item {...p} className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-sunk', danger ? 'text-bad' : 'text-body')}>{children}</Dropdown.Item>;
}

function MetricSwitch({ current }: { current: Workbook }) {
  return (
    <div className="no-scrollbar -mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex w-max gap-1 rounded-xl border border-hairline bg-raised p-1 shadow-sm">
        <Link to="/" className="rounded-lg px-3 py-1.5 text-[13px] text-muted transition hover:bg-sunk hover:text-ink">← Overview</Link>
        {WORKBOOK_LIST.map(w => {
          const on = w === current;
          return (
            <Link key={w.def.id} to={`/a4/${w.def.id}`} className={cn('relative rounded-lg px-3 py-1.5 text-[13px] transition-colors', on ? 'text-white' : 'text-soft hover:text-ink')}>
              {on && <motion.span layoutId="metric-pill" className="absolute inset-0 rounded-lg bg-brand shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              <span className="relative"><span className="font-mono">{w.def.id}</span><span className="ml-2 hidden lg:inline">{SHORT[w.def.id]}</span></span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Kpis({ wb }: { wb: Workbook }) {
  const rs = results(wb);
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {rs.map((r, i) => {
        const [v, gloss] = splitVerdict(r.text), lead = i === 0;
        return (
          <motion.div key={r.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05, duration: .4 }}
            className={cn('rounded-2xl border p-4 shadow-sm', lead ? 'border-[color-mix(in_srgb,var(--brand)_30%,var(--hairline))] bg-raised' : 'border-hairline bg-raised')}>
            <div className="text-[12px] text-muted">{r.label}{r.money && ' · ₹ lakh'}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {r.empty ? <span className="font-serif text-[26px] font-bold text-faint">—</span>
                : r.tone && !lead ? <Pill tone={r.tone} dot>{v}</Pill>
                : <span className="font-serif text-[26px] font-bold leading-none text-ink"><CountUp text={v} /></span>}
              {lead && r.tone && <Pill tone={r.tone} dot>{r.tone === 'good' ? 'Met' : r.tone === 'warn' ? 'Partly' : 'Not met'}</Pill>}
            </div>
            {gloss && <div className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-muted">{gloss}</div>}
          </motion.div>
        );
      })}
    </div>
  );
}

function Ring({ v }: { v: number }) {
  const r = 6, c = 2 * Math.PI * r;
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="-rotate-90" aria-hidden>
      <circle cx="8" cy="8" r={r} fill="none" stroke="var(--hairline)" strokeWidth="2.2" />
      <motion.circle cx="8" cy="8" r={r} fill="none" stroke={v >= 1 ? 'var(--good)' : 'var(--brand-ink)'} strokeWidth="2.2" strokeLinecap="round"
        strokeDasharray={c} animate={{ strokeDashoffset: c * (1 - Math.min(1, v)) }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
    </svg>
  );
}

function Banner({ tone, children, onClose, closeLabel }: { tone: 'info' | 'warn'; children: React.ReactNode; onClose: () => void; closeLabel: string }) {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .25 }} className="overflow-hidden">
      <div className={cn('mt-5 flex items-start gap-3 rounded-xl px-4 py-3 text-[13.5px]', tone === 'info' ? 'bg-info-bg text-info' : 'bg-warn-bg text-warn')}>
        {tone === 'warn' ? <AlertTriangle size={17} className="mt-0.5 shrink-0" /> : <Sparkles size={17} className="mt-0.5 shrink-0" />}
        <div className="min-w-0 flex-1 text-ink/85 [&_b]:text-ink">{children}</div>
        <button onClick={onClose} className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[12.5px] font-medium hover:bg-black/5" aria-label={closeLabel}>
          {tone === 'info' ? closeLabel : <X size={15} />}
        </button>
      </div>
    </motion.div>
  );
}

/* Drop an Excel file anywhere on the page to upload it. */
function DropZone({ wb, onFile, children }: { wb: Workbook; onFile: (f: File) => void; children: React.ReactNode }) {
  const [over, setOver] = useState(false), depth = useRef(0);
  useEffect(() => {
    const has = (e: DragEvent) => [...(e.dataTransfer?.types || [])].includes('Files');
    const enter = (e: DragEvent) => { if (!has(e)) return; e.preventDefault(); depth.current++; setOver(true); };
    const leave = (e: DragEvent) => { if (!has(e)) return; if (--depth.current <= 0) { depth.current = 0; setOver(false); } };
    const overFn = (e: DragEvent) => { if (has(e)) e.preventDefault(); };
    const drop = (e: DragEvent) => {
      if (!has(e)) return;
      e.preventDefault(); depth.current = 0; setOver(false);
      const f = e.dataTransfer!.files[0];
      if (f) onFile(f);
    };
    window.addEventListener('dragenter', enter); window.addEventListener('dragleave', leave);
    window.addEventListener('dragover', overFn); window.addEventListener('drop', drop);
    return () => {
      window.removeEventListener('dragenter', enter); window.removeEventListener('dragleave', leave);
      window.removeEventListener('dragover', overFn); window.removeEventListener('drop', drop);
    };
  }, [onFile]);
  return (
    <>
      {children}
      <AnimatePresence>
        {over && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-[color-mix(in_srgb,var(--brand)_14%,rgba(0,0,0,.35))] p-6 backdrop-blur-sm">
            <motion.div initial={{ scale: .92, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className="rounded-3xl border-2 border-dashed border-white/70 bg-raised/95 px-12 py-10 text-center shadow-lg">
              <ChevronDown size={30} className="mx-auto animate-bounce text-brand-ink" />
              <div className="mt-3 font-serif text-[24px] font-bold text-ink">Drop the {wb.def.id} workbook</div>
              <div className="mt-1 text-[13.5px] text-muted">Every sheet is read; rows are matched by their code.</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
