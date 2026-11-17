/* Pieces shared by the NBA pages: the section switch, inputs that hold a
   number while it's being typed, the attainment gauge and level chips. */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarRange, Check, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import { cn } from '../components/ui';
import { STATUS_LABEL, STATUS_TONE, getNba, setNba, switchYear, useNba, yearsOf, type Config, type NbaState, type Status } from './model';

export function NbaNav() {
  const s = useNba(), { pathname } = useLocation(), nav = useNavigate();
  const items = [
    { to: '/nba', label: 'Overview', on: pathname === '/nba' },
    { to: s.courses[0] ? `/nba/c/${s.courses[0].id}` : '/nba#courses', label: 'Courses', count: s.courses.length, on: pathname.startsWith('/nba/c/') },
    { to: '/nba/indirect', label: 'Indirect assessment', on: pathname.startsWith('/nba/indirect') },
    { to: '/nba/years', label: 'Years', count: yearsOf(s).length, on: pathname.startsWith('/nba/years') },
    { to: '/nba/setup', label: 'Setup & weightages', on: pathname.startsWith('/nba/setup') },
  ];
  return (
    <div className="no-scrollbar -mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex w-max items-center gap-1 rounded-xl border border-hairline bg-raised p-1 shadow-sm">
        <span className="px-2.5 font-mono text-[11.5px] font-medium uppercase tracking-[.12em] text-muted">NBA · C3</span>
        {items.map(n => (
          <Link key={n.label} to={n.to} className={cn('relative rounded-lg px-3 py-1.5 text-[13px] transition-colors', n.on ? 'text-white' : 'text-soft hover:text-ink')}>
            {n.on && <motion.span layoutId="nba-pill" className="absolute inset-0 rounded-lg bg-brand shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <span className="relative">{n.label}{n.count != null && <span className={cn('ml-1.5 font-mono text-[11px]', n.on ? 'text-white/75' : 'text-muted')}>{n.count}</span>}</span>
          </Link>
        ))}
        <Menu trigger={<button className="ml-1 flex items-center gap-1.5 rounded-lg border-l border-divider px-3 py-1.5 text-[13px] text-ink hover:bg-sunk" aria-label="Academic year"><CalendarRange size={14} className="text-muted" /><span className="font-mono text-[12.5px]">{s.year}</span><ChevronDown size={13} className="text-muted" /></button>}>
          <MenuLabel>Academic year</MenuLabel>
          {yearsOf(s).map(y => (
            <MenuItem key={y} onSelect={() => { if (y !== s.year) { switchYear(y); if (pathname.startsWith('/nba/c/')) nav('/nba'); } }}>
              <Check size={14} className={y === s.year ? 'text-brand-ink' : 'opacity-0'} /><span className="font-mono">{y}</span>
            </MenuItem>
          ))}
          <MenuSep />
          <MenuItem onSelect={() => nav('/nba/years')}><CalendarRange size={14} />Manage years</MenuItem>
        </Menu>
      </div>
    </div>
  );
}

/** A number box that lets you type "2." or "" without fighting you, and hands back a number or null. */
export function NumInput({ value, onChange, className, placeholder, min, max, step, allowAB, label, ...rest }: {
  value: number | 'AB' | null | undefined; onChange: (v: number | 'AB' | null) => void; className?: string; placeholder?: string;
  min?: number; max?: number; step?: number; allowAB?: boolean; label?: string; onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>; 'data-r'?: number; 'data-c'?: number;
}) {
  const show = value == null ? '' : String(value);
  const [text, setText] = useState(show);
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setText(show); }, [show]);
  const over = typeof value === 'number' && ((max != null && value > max) || (min != null && value < min));
  return (
    <input
      {...rest}
      aria-label={label}
      inputMode="decimal"
      value={text}
      placeholder={placeholder}
      title={over ? `Outside ${min ?? '–'}–${max ?? '–'}` : undefined}
      onFocus={e => { focused.current = true; e.currentTarget.select(); }}
      onBlur={() => { focused.current = false; setText(show); }}
      onChange={e => {
        const t = e.target.value;
        setText(t);
        const clean = t.trim();
        if (!clean) return onChange(null);
        if (allowAB && /^a(b)?$/i.test(clean)) { if (/^ab$/i.test(clean)) onChange('AB'); return; }
        const n = Number(clean.replace(/,/g, ''));
        if (!isNaN(n)) onChange(step === 1 ? Math.round(n) : n);
      }}
      className={cn('tabular w-full rounded-md border border-transparent bg-[var(--cream)] px-2 py-1.5 text-right text-[13px] text-ink shadow-[inset_0_0_0_1px_var(--cream-edge)] outline-none transition placeholder:text-faint focus:bg-raised focus:shadow-[inset_0_0_0_2px_var(--brand-ink)]',
        over && 'shadow-[inset_0_0_0_2px_var(--bad)]', className)}
    />
  );
}

export function TextInput({ value, onChange, className, placeholder, area, label }: { value: string; onChange: (v: string) => void; className?: string; placeholder?: string; area?: boolean; label?: string }) {
  const cls = cn('w-full rounded-lg border border-hairline bg-raised px-3 py-2 text-[14px] text-ink outline-none transition placeholder:text-faint focus:border-[var(--brand-ink)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand)_14%,transparent)]', className);
  return area
    ? <textarea aria-label={label} value={value} placeholder={placeholder} rows={2} onChange={e => onChange(e.target.value)} className={cn(cls, 'resize-y leading-snug')} />
    : <input aria-label={label} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className={cls} />;
}

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-[12.5px] font-medium text-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11.5px] text-muted">{hint}</span>}
    </label>
  );
}

export function Card({ children, className, title, aside, sub }: { children: ReactNode; className?: string; title?: ReactNode; aside?: ReactNode; sub?: ReactNode }) {
  return (
    <section className={cn('rounded-2xl border border-hairline bg-raised shadow-sm', className)}>
      {title && (
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-divider px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-serif text-[20px] font-bold leading-tight text-ink">{title}</h2>
            {sub && <p className="mt-1 text-[13px] text-soft">{sub}</p>}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

const TONE_TEXT = { good: 'text-good', warn: 'text-warn', bad: 'text-bad' } as const;
const TONE_BG = { good: 'bg-good-bg text-good', warn: 'bg-warn-bg text-warn', bad: 'bg-bad-bg text-bad' } as const;

export function StatusPill({ status, short }: { status: Status; short?: boolean }) {
  if (!status) return <span className="text-[12px] text-faint">—</span>;
  const label = STATUS_LABEL[status];
  return <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11.5px] font-semibold leading-none', TONE_BG[STATUS_TONE[status]])}>
    <i className="size-1.5 rounded-full bg-current" />{short ? label.split(' ')[0] : label}
  </span>;
}
export function YesNo({ v }: { v: boolean | null }) {
  if (v == null) return <span className="text-faint">—</span>;
  return <span className={cn('inline-flex rounded-full px-2 py-[3px] text-[11.5px] font-semibold leading-none', v ? TONE_BG.good : TONE_BG.bad)}>{v ? 'Yes' : 'No'}</span>;
}
export const statusText = (s: Status) => (s ? TONE_TEXT[STATUS_TONE[s]] : 'text-faint');

/** A ring showing attainment out of 3, as a percentage. */
export function Gauge({ level, cfg, size = 220, caption }: { level: number | null; cfg: Config; size?: number; caption?: string }) {
  const R = 84, C = 2 * Math.PI * R, v = level == null ? 0 : Math.max(0, Math.min(1, level / 3));
  const tone = level == null ? 'var(--ink-faint)' : level > cfg.partial ? 'var(--good)' : level > cfg.low ? 'var(--accent)' : 'var(--bad)';
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="size-full -rotate-0" role="img" aria-label={level == null ? 'No attainment yet' : `Attainment ${level.toFixed(2)} of 3`}>
        <circle cx="100" cy="100" r={R} fill="none" stroke="var(--surface-sunk)" strokeWidth="16" />
        <motion.circle cx="100" cy="100" r={R} fill="none" stroke={tone} strokeWidth="16" strokeLinecap="round" transform="rotate(-90 100 100)"
          strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - v) }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-serif text-[44px] font-bold leading-none text-ink tabular">{level == null ? '—' : (level / 3 * 100).toFixed(1)}<span className="text-[22px] text-faint">{level == null ? '' : '%'}</span></div>
          <div className="mt-1.5 font-mono text-[12px] text-muted">{level == null ? 'no data yet' : `${level.toFixed(2)} of 3`}</div>
          {caption && <div className="mx-auto mt-1 max-w-[130px] text-[11.5px] leading-snug text-muted">{caption}</div>}
        </div>
      </div>
    </div>
  );
}

/** A two-part bar showing how a weighting splits, e.g. Direct 80% · Indirect 20%. */
export function Split({ parts, className }: { parts: { label: string; short?: string; pct: number; tone?: 'brand' | 'accent' | 'faint' }[]; className?: string }) {
  const total = parts.reduce((s, p) => s + p.pct, 0) || 1;
  return (
    <div className={cn('flex h-9 overflow-hidden rounded-lg text-[12px] font-semibold', className)}>
      {parts.map(p => (
        <motion.div key={p.label} layout style={{ flex: p.pct / total }} title={`${p.label} ${p.pct}%`}
          className={cn('flex min-w-0 items-center justify-between gap-2 px-2.5 first:rounded-l-lg last:rounded-r-lg',
            p.tone === 'accent' ? 'bg-accent text-accent-ink' : p.tone === 'faint' ? 'bg-sunk text-soft' : 'bg-brand text-white')}>
          <span className="truncate">{p.short && p.pct / total < .3 ? p.short : p.label}</span><span className="shrink-0 font-mono tabular">{p.pct}%</span>
        </motion.div>
      ))}
    </div>
  );
}

export function MenuItem({ children, danger, ...p }: Dropdown.DropdownMenuItemProps & { danger?: boolean }) {
  return <Dropdown.Item {...p} className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-sunk', danger ? 'text-bad' : 'text-body')}>{children}</Dropdown.Item>;
}
export function Menu({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align="end" sideOffset={6} className="z-50 min-w-[240px] origin-[var(--radix-dropdown-menu-content-transform-origin)] rounded-xl border border-hairline bg-raised p-1.5 shadow-lg data-[state=open]:animate-[pop_.16s_ease-out]">
          {children}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
export const MenuSep = () => <Dropdown.Separator className="my-1 h-px bg-divider" />;
export const MenuLabel = ({ children }: { children: ReactNode }) => <Dropdown.Label className="px-2.5 pb-1 pt-2 font-mono text-[10.5px] uppercase tracking-[.12em] text-muted">{children}</Dropdown.Label>;

/** Do something to the NBA data with an Undo in the toast. */
export function withUndo(label: string, act: () => void, description?: string) {
  const before: NbaState = getNba();
  act();
  toast(label, { description, action: { label: 'Undo', onClick: () => setNba(before) } });
}

/** Run a download with a toast that says how it went. */
export async function saving(what: string, fn: () => Promise<void>) {
  const id = toast.loading(`Preparing ${what}…`);
  try { await fn(); toast.success(`${what[0].toUpperCase() + what.slice(1)} downloaded`, { id }); }
  catch (e) { toast.error('Download failed', { id, description: (e as Error).message }); }
}

/** A hidden file input and a function that opens it. */
export function useFilePicker(onFile: (f: File) => void | Promise<unknown>, multiple = false) {
  const ref = useRef<HTMLInputElement>(null);
  const input = <input ref={ref} type="file" multiple={multiple} accept=".xlsx,.xlsm,.xls,.ods,.csv" hidden onChange={async e => {
    const files = [...(e.target.files ?? [])].slice(0, multiple ? undefined : 1);
    e.target.value = '';
    for (const f of files) await onFile(f);
  }} />;
  return { input, open: () => ref.current?.click() };
}
