/* Grouped bars for a workbook's chart, oldest year first. `mini` is the
   card-sized version without axes. */

import { motion } from 'motion/react';
import type { ChartData } from '../engine/workbook';
import { cn } from './ui';

const COLORS = ['var(--brand-ink)', 'var(--accent)', 'var(--ink-faint)'];

function niceMax(max: number) {
  const p = Math.pow(10, Math.floor(Math.log10(max))), f = max / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}

export function Bars({ data, mini, className }: { data: ChartData; mini?: boolean; className?: string }) {
  const W = mini ? 280 : 680, H = mini ? 92 : 280, L = mini ? 0 : 52, B = mini ? 4 : 34, T = mini ? 4 : 14;
  const n = data.cats.length || data.series[0]?.vals.length || 1;
  const max = Math.max(data.pct ? 1 : 0, ...data.series.flatMap(s => s.vals));
  const top = max > 0 ? niceMax(max) : 1;
  const y = (v: number) => T + (H - T - B) * (1 - Math.max(0, v) / top);
  const gw = (W - L - (mini ? 0 : 8)) / n, k = data.series.length;
  const bw = Math.min(mini ? 18 : 34, (gw - (mini ? 14 : 22)) / k);
  const fmtV = (v: number) => data.pct ? Math.round(v * 100) + '%' : v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k' : String(Math.round(v * 10) / 10);
  const empty = max <= 0;

  return (
    <figure className={cn('m-0', className)}>
      {!mini && (
        <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[13.5px] font-semibold text-ink">{data.title}</span>
          <span className="flex gap-4 text-[12px] text-soft">
            {data.series.map((s, i) => <span key={s.name} className="flex items-center gap-1.5"><i className="size-2.5 rounded-[3px]" style={{ background: COLORS[i] }} />{s.name}</span>)}
          </span>
        </figcaption>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-visible" role="img" aria-label={data.title}>
        {!mini && [0, 1, 2, 3, 4].map(i => {
          const v = top * i / 4;
          return (
            <g key={i}>
              <line x1={L} x2={W - 8} y1={y(v)} y2={y(v)} stroke="var(--divider)" strokeDasharray={i ? '3 4' : undefined} />
              <text x={L - 8} y={y(v) + 4} textAnchor="end" className="fill-muted font-mono text-[10.5px]">{fmtV(v)}</text>
            </g>
          );
        })}
        {mini && <line x1={0} x2={W} y1={y(0)} y2={y(0)} stroke="var(--divider)" />}
        {Array.from({ length: n }, (_, j) => {
          const x0 = L + j * gw + (gw - bw * k) / 2;
          return (
            <g key={j}>
              {data.series.map((s, i) => {
                const v = empty ? top * (.25 + .12 * ((j + i) % 3)) : s.vals[j];
                const h = Math.max(empty ? 0 : 1.5, y(0) - y(v));
                return (
                  <motion.rect key={i} x={x0 + i * bw} width={bw - (mini ? 3 : 4)} rx={mini ? 2.5 : 4}
                    fill={COLORS[i % 3]} fillOpacity={empty ? .12 : 1}
                    initial={{ height: 0, y: y(0) }} animate={{ height: h, y: y(0) - h }}
                    transition={{ type: 'spring', stiffness: 170, damping: 24, delay: .05 * j + .03 * i }}>
                    <title>{`${s.name} · ${data.cats[j] || ''}: ${data.pct ? (s.vals[j] * 100).toFixed(1) + '%' : s.vals[j].toLocaleString('en-IN')}`}</title>
                  </motion.rect>
                );
              })}
              {!mini && <text x={L + j * gw + gw / 2} y={H - 10} textAnchor="middle" className="fill-muted font-mono text-[10.5px]">{data.cats[j]}</text>}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
