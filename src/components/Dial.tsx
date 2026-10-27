/* The readiness dial: a bezel like the Compass's, with one arc per metric,
   sized by its marks and coloured by where it stands. */

import { motion } from 'motion/react';
import type { Tone } from '../lib/naac';
import { cn } from './ui';

export type DialPart = { id: string; marks: number; tone: Tone; started: boolean };

const C = 160, R = 118;
const pt = (a: number, r: number) => [C + r * Math.sin(a), C - r * Math.cos(a)];
function arc(a0: number, a1: number, r: number) {
  const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r);
  return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`;
}
const STROKE: Record<string, string> = { good: 'var(--brand-ink)', warn: 'var(--accent)', bad: 'var(--bad)', none: 'var(--ink-faint)' };

export function Dial({ parts, hover, onHover, children }: { parts: DialPart[]; hover?: string | null; onHover?: (id: string | null) => void; children?: React.ReactNode }) {
  const total = parts.reduce((s, p) => s + p.marks, 0), gap = 0.06;
  let at = 0;
  const segs = parts.map(p => {
    const a0 = at / total * Math.PI * 2 + gap / 2, a1 = (at + p.marks) / total * Math.PI * 2 - gap / 2;
    at += p.marks;
    return { ...p, a0, a1, mid: (a0 + a1) / 2 };
  });
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      <svg viewBox="-22 -10 364 340" className="size-full overflow-visible" role="img" aria-label="Attribute 4 readiness by metric">
        {/* bezel ticks */}
        {Array.from({ length: 72 }, (_, i) => {
          const a = i / 72 * Math.PI * 2, long = i % 6 === 0;
          const [x0, y0] = pt(a, 150), [x1, y1] = pt(a, long ? 140 : 145);
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--ink-faint)" strokeOpacity={long ? .8 : .4} strokeWidth={long ? 1.4 : 1} />;
        })}
        <circle cx={C} cy={C} r={R} fill="none" stroke="var(--hairline)" strokeWidth={14} />
        <circle cx={C} cy={C} r={92} fill="var(--surface-raised)" stroke="var(--divider)" />
        {segs.map((s, i) => {
          const on = hover === s.id, dim = hover && !on;
          return (
            <g key={s.id} onPointerEnter={() => onHover?.(s.id)} onPointerLeave={() => onHover?.(null)} className="cursor-default">
              {/* wide invisible hit area */}
              <path d={arc(s.a0, s.a1, R)} stroke="transparent" strokeWidth={34} fill="none" />
              {s.started
                ? <motion.path d={arc(s.a0, s.a1, R)} fill="none" stroke={STROKE[s.tone || 'none']} strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1, strokeWidth: on ? 20 : 14, opacity: dim ? .35 : 1 }}
                    transition={{ pathLength: { duration: 1.1, delay: .15 + i * .12, ease: [0.22, 1, 0.36, 1] }, default: { duration: .2 } }} />
                : <motion.path d={arc(s.a0, s.a1, R)} fill="none" stroke="var(--ink-faint)" strokeDasharray="2 6" strokeLinecap="round"
                    animate={{ strokeWidth: on ? 6 : 3, opacity: dim ? .3 : .8 }} />}
              <Label s={s} on={on} />
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-[30%] grid place-items-center text-center">{children}</div>
    </div>
  );
}

function Label({ s, on }: { s: { id: string; mid: number }; on: boolean }) {
  const [x, y] = pt(s.mid, 166);
  return (
    <text x={x} y={y + 4} textAnchor={Math.abs(Math.sin(s.mid)) < .3 ? 'middle' : Math.sin(s.mid) > 0 ? 'start' : 'end'}
      className={cn('font-mono text-[11px] font-medium transition-[fill]', on ? 'fill-ink' : 'fill-muted')}>{s.id}</text>
  );
}
