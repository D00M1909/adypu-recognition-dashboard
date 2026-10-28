/* Which fields are filled: every input row by its code and heading, with a
   mark for done, partly filled or empty. Clicking one opens its sheet at
   that row. */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { Workbook } from '../engine/workbook';
import { statusOf, type Field, type FieldStatus, type SheetFields } from '../lib/fields';
import { sheetLabel } from './sheetTabs';
import { cn } from './ui';

export type FieldFilter = 'all' | 'missing' | 'filled';
const keep = (f: Field, filter: FieldFilter) => filter === 'all' || (filter === 'filled' ? statusOf(f) === 'done' : statusOf(f) !== 'done');

export function StatusMark({ s }: { s: FieldStatus }) {
  if (s === 'done') return <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-good text-white dark:text-[#0b0f14]"><Check size={12} strokeWidth={3} /></span>;
  if (s === 'partial') return (
    <span className="relative size-[18px] shrink-0 overflow-hidden rounded-full border-2 border-accent" aria-hidden>
      <span className="absolute inset-y-0 left-0 w-1/2 bg-accent" />
    </span>
  );
  return <span className="size-[18px] shrink-0 rounded-full border-2 border-dashed border-faint" aria-hidden />;
}

const LABEL: Record<FieldStatus, string> = { done: 'Filled', partial: 'Partly filled', empty: 'Not filled' };

/** One sheet's fields, grouped by the sheet's own sections. */
export function FieldGroup({ wb, sheet, filter = 'all', columns }: { wb: Workbook; sheet: SheetFields; filter?: FieldFilter; columns?: boolean }) {
  const shown = sheet.fields.filter(f => keep(f, filter));
  if (!shown.length) return <p className="py-2 text-[13px] text-muted">{filter === 'missing' ? 'Everything on this sheet is filled.' : 'Nothing filled on this sheet yet.'}</p>;
  const sections = [...new Set(shown.map(f => f.section))];
  return (
    <div className={cn(columns && 'gap-x-6 lg:columns-2')}>
      {sections.map(sec => (
        <div key={sec || '_'} className="mb-3 break-inside-avoid">
          {sec && <div className="mb-1 px-2 pt-1 text-[11.5px] font-semibold uppercase tracking-[.06em] text-muted">{sec}</div>}
          <ul>
            {shown.filter(f => f.section === sec).map(f => {
              const s = statusOf(f);
              return (
                <li key={f.r}>
                  <Link to={`/a4/${wb.def.id}/${f.si}?row=${f.r}`} title={`${LABEL[s]} · ${f.filled} of ${f.total} cells`}
                    className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors hover:bg-sunk">
                    <StatusMark s={s} />
                    {f.code && <span className="w-9 shrink-0 font-mono text-[11.5px] text-muted">{f.code}</span>}
                    <span className={cn('min-w-0 flex-1 truncate', s === 'empty' ? 'text-soft' : 'text-ink')}>{f.label}</span>
                    {s === 'partial' && <span className="shrink-0 font-mono text-[11px] text-warn">{f.filled}/{f.total}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function SheetProgress({ sheet }: { sheet: SheetFields }) {
  const done = sheet.fields.filter(f => statusOf(f) === 'done').length, n = sheet.fields.length;
  return (
    <div className="flex items-center gap-3">
      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink">{sheetLabel(sheet.name)}</span>
      <span className="font-mono text-[11.5px] text-muted">{done}/{n}</span>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-sunk">
        <motion.span className={cn('block h-full rounded-full', done === n ? 'bg-good' : 'bg-brand')} animate={{ width: `${n ? done / n * 100 : 0}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} />
      </span>
    </div>
  );
}

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted">
      {(['done', 'partial', 'empty'] as FieldStatus[]).map(s => <span key={s} className="flex items-center gap-1.5"><StatusMark s={s} />{LABEL[s]}</span>)}
    </div>
  );
}

export function FilterSwitch({ value, onChange, counts }: { value: FieldFilter; onChange: (f: FieldFilter) => void; counts: Record<FieldFilter, number> }) {
  const opts: [FieldFilter, string][] = [['missing', 'Not filled'], ['filled', 'Filled'], ['all', 'All']];
  return (
    <div className="flex gap-0.5 rounded-lg bg-sunk p-0.5" role="tablist">
      {opts.map(([k, l]) => (
        <button key={k} role="tab" aria-selected={value === k} onClick={() => onChange(k)}
          className={cn('relative rounded-md px-2.5 py-1 text-[12.5px] font-medium transition-colors', value === k ? 'text-ink' : 'text-muted hover:text-ink')}>
          {value === k && <motion.span layoutId="field-filter" className="absolute inset-0 rounded-md bg-raised shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
          <span className="relative">{l} <span className="font-mono text-[11px] text-muted">{counts[k]}</span></span>
        </button>
      ))}
    </div>
  );
}
