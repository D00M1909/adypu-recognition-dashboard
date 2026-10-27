import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { NAAC_ATTRIBUTES, NAAC_TOTAL } from '../lib/naac';
import { Eyebrow, Pill, cn } from '../components/ui';

const GROUPS = ['Input', 'Process', 'Outcome'];
const max = Math.max(...NAAC_ATTRIBUTES.map(a => a.marks));

export function Framework() {
  let i = 0;
  return (
    <>
      <section className="pt-10 pb-4 lg:pt-14">
        <Eyebrow>NAAC Binary Accreditation Framework</Eyebrow>
        <h1 className="mt-3 font-serif text-[clamp(32px,4.6vw,50px)] font-bold leading-[1.06] text-ink">{NAAC_TOTAL} marks across ten attributes</h1>
        <p className="mt-3 max-w-[600px] text-[16px] text-soft">University weights from the draft manual. Each attribute opens here as it is built.</p>
      </section>
      <div className="mt-6 space-y-8">
        {GROUPS.map(g => {
          const rows = NAAC_ATTRIBUTES.filter(a => a.group === g), marks = rows.reduce((s, a) => s + a.marks, 0);
          return (
            <section key={g}>
              <div className="mb-2 flex items-baseline justify-between px-1">
                <h2 className="font-mono text-[12px] uppercase tracking-[.14em] text-muted">{g}</h2>
                <span className="font-mono text-[12px] text-muted">{marks} marks</span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-hairline bg-raised shadow-sm">
                {rows.map(a => {
                  const d = i++ * .04;
                  const inner = (
                    <>
                      <span className="w-7 font-mono text-[13px] text-muted">{a.n}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold text-ink">{a.title}</span>
                        <span className="text-[12px] text-muted">{a.metrics} metrics</span>
                      </span>
                      <span className="hidden w-[30%] sm:block">
                        <span className="block h-2 overflow-hidden rounded-full bg-sunk">
                          <motion.span className={cn('block h-full rounded-full', a.live ? 'bg-brand' : 'bg-faint/60')}
                            initial={{ width: 0 }} animate={{ width: `${a.marks / max * 100}%` }} transition={{ delay: .1 + d, duration: .8, ease: [0.22, 1, 0.36, 1] }} />
                        </span>
                      </span>
                      <span className="w-12 text-right font-mono text-[14px] text-ink tabular">{a.marks}</span>
                      <span className="w-20 text-right">{a.live ? <Pill tone="brand">Open <ArrowUpRight size={12} /></Pill> : <Pill>Coming</Pill>}</span>
                    </>
                  );
                  const cls = 'flex items-center gap-4 border-b border-divider px-5 py-4 last:border-b-0';
                  return (
                    <motion.div key={a.n} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d, duration: .4 }}>
                      {a.live ? <Link to="/a4/4.1" className={cn(cls, 'transition-colors hover:bg-sunk')}>{inner}</Link> : <div className={cls}>{inner}</div>}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
