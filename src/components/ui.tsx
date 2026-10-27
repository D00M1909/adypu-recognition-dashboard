/* Small shared pieces: buttons, pills, numbers that count, the pointer glow. */

import { useEffect, useRef, type ComponentProps, type PointerEvent, type ReactNode } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import clsx from 'clsx';
import type { Tone } from '../lib/naac';

export const cn = clsx;

const BTN = {
  solid: 'bg-brand text-white shadow-sm hover:brightness-110 active:brightness-95',
  ghost: 'bg-raised text-ink border border-hairline shadow-sm hover:border-faint hover:bg-sunk',
  quiet: 'text-soft hover:text-ink hover:bg-sunk',
};
export function btn(kind: keyof typeof BTN = 'ghost', extra?: string) {
  return cn('inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-lg text-[13.5px] font-medium whitespace-nowrap',
    'transition-[background,border-color,filter,transform] duration-150 active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none', BTN[kind], extra);
}
export const Button = ({ kind = 'ghost', className, ...p }: ComponentProps<'button'> & { kind?: keyof typeof BTN }) =>
  <button type="button" className={btn(kind, className)} {...p} />;

const TONE: Record<string, string> = {
  good: 'bg-good-bg text-good', warn: 'bg-warn-bg text-warn', bad: 'bg-bad-bg text-bad', info: 'bg-info-bg text-info',
  mute: 'bg-sunk text-soft', brand: 'bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] text-brand-ink',
};
export function Pill({ tone, children, className, dot }: { tone?: Tone | 'info' | 'mute' | 'brand'; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[12px] font-semibold leading-none', TONE[tone || 'mute'], className)}>
      {dot && <i className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export const Dot = ({ tone }: { tone: Tone }) =>
  <i className={cn('inline-block size-2 rounded-full', tone === 'good' ? 'bg-good' : tone === 'warn' ? 'bg-warn' : tone === 'bad' ? 'bg-bad' : 'bg-faint/50')} />;

/** A number that rolls to its new value; keeps the text's own format (₹ grouping, "x", "%"). */
export function CountUp({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null), prev = useRef(0), reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current!;
    const m = /^(.*?)(-?[\d,]*\.?\d+)(.*)$/.exec(text);
    if (!m || reduce) { el.textContent = text; return; }
    const [, pre, numText, post] = m;
    const target = Number(numText.replace(/,/g, '')), dec = (numText.split('.')[1] || '').length, grouped = numText.includes(',');
    const fmt = (v: number) => pre + (grouped ? v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec)) + post;
    // Start from whatever is showing, so an interrupted roll carries on rather than jumping.
    const ctl = animate(prev.current, target, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: v => { prev.current = v; el.textContent = fmt(v); } });
    return () => ctl.stop();
  }, [text, reduce]);
  return <span ref={ref} className={cn('tabular', className)}>{text}</span>;
}

export function glowMove(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) =>
  <div className={cn('font-mono text-[11.5px] font-medium uppercase tracking-[.14em] text-muted', className)}>{children}</div>;
