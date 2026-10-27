import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ImagePlus, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { BRAND_DEFAULT, contrast, inkOn, setBrand, useBrand, type Brand } from '../lib/brand';
import { Button, Eyebrow, cn } from '../components/ui';

const SWATCHES = ['#C21B27', '#0d2350', '#14532d', '#5b21b6', '#9a3412', '#0f766e', '#1e293b'];
const ACCENTS = ['#C9A227', '#e9b824', '#f59e0b', '#38bdf8', '#a3e635', '#f472b6', '#e2e8f0'];

export function Customise() {
  const saved = useBrand();
  const [d, setD] = useState<Brand>(saved);
  const set = (p: Partial<Brand>) => setD(x => ({ ...x, ...p }));
  const file = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(d) !== JSON.stringify(saved);
  const ratio = contrast(d.primary, '#ffffff');

  return (
    <>
      <section className="pt-10 pb-2 lg:pt-14">
        <Eyebrow>Branding</Eyebrow>
        <h1 className="mt-3 font-serif text-[clamp(32px,4.6vw,48px)] font-bold leading-[1.06] text-ink">Make it your college’s</h1>
        <p className="mt-3 max-w-[560px] text-[16px] text-soft">Your name, crest and colours appear across the dashboard and in every NAAC workbook you download.</p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_440px]">
        <div className="space-y-6 rounded-2xl border border-hairline bg-raised p-6 shadow-sm">
          <Group title="College">
            <Field label="Full name" value={d.name} onChange={v => set({ name: v })} placeholder="e.g. Sunrise University" max={90} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Short name" hint="Shown when there is no logo" value={d.short} onChange={v => set({ short: v })} placeholder="e.g. SU" max={8} />
              <Field label="City" hint="Used on CA certificates" value={d.city} onChange={v => set({ city: v })} placeholder="e.g. Pune" max={40} />
            </div>
          </Group>

          <Group title="Crest or logo">
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid h-16 min-w-16 place-items-center rounded-xl border border-hairline bg-white px-3">
                {d.logo ? <img src={d.logo} alt="" className="h-12 w-auto max-w-[160px] object-contain" /> : <span className="font-serif text-[18px] font-bold text-slate-400">{d.short || '—'}</span>}
              </div>
              <input ref={file} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden
                onChange={async e => { const f = e.target.files?.[0]; e.target.value = ''; if (!f) return; try { set({ logo: await shrinkImage(f) }); } catch (err) { toast.error((err as Error).message); } }} />
              <Button onClick={() => file.current?.click()}><ImagePlus size={16} />Upload</Button>
              {d.logo && <Button kind="quiet" onClick={() => set({ logo: '' })}><Trash2 size={15} />Remove</Button>}
              <p className="basis-full text-[12.5px] text-muted">PNG, JPG, SVG or WebP. Large images are scaled down.</p>
            </div>
          </Group>

          <Group title="Colours">
            <ColourRow label="Primary" hint="Header, buttons, highlights" value={d.primary} options={SWATCHES} onChange={v => set({ primary: v })} />
            <ColourRow label="Accent" hint="Partly-met marks, chart second series" value={d.accent} options={ACCENTS} onChange={v => set({ accent: v })} />
            {ratio < 4.5 && (
              <div className="flex items-start gap-2.5 rounded-xl bg-warn-bg px-4 py-3 text-[13px] text-warn">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span className="text-ink/85">White text on this primary has a contrast of {ratio.toFixed(1)}:1. Pick a darker shade (4.5:1 or more) so header text stays readable.</span>
              </div>
            )}
          </Group>

          <div className="flex flex-wrap items-center gap-2 border-t border-divider pt-5">
            <Button kind="solid" disabled={!dirty} onClick={() => { if (setBrand(d)) toast.success('Branding saved'); else toast.error('Could not save in this browser', { description: 'Storage is full or blocked. The logo may be too large.' }); }}>Save changes</Button>
            {dirty && <Button kind="quiet" onClick={() => setD(saved)}>Discard</Button>}
            <Button kind="quiet" className="ml-auto" onClick={() => { setBrand(null); setD({ ...BRAND_DEFAULT }); toast('Reset to the default branding'); }}><RotateCcw size={15} />Reset</Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-2 px-1 font-mono text-[11.5px] uppercase tracking-[.14em] text-muted">Live preview</div>
          <Preview b={d} />
        </div>
      </div>
    </>
  );
}

function Preview({ b }: { b: Brand }) {
  const deep = `color-mix(in srgb, ${b.primary} 72%, black)`;
  return (
    <motion.div layout className="overflow-hidden rounded-2xl border border-hairline bg-surface shadow-md">
      <div className="flex items-center gap-3 px-4 py-3 text-white transition-[background] duration-500" style={{ background: `linear-gradient(120deg, ${b.primary}, ${deep})` }}>
        {b.logo ? <span className="flex h-9 items-center rounded-lg bg-white px-1.5"><img src={b.logo} alt="" className="h-7 w-auto max-w-[90px] object-contain" /></span>
          : <span className="grid size-9 place-items-center rounded-lg font-serif text-[13px] font-bold" style={{ background: b.accent, color: inkOn(b.accent) }}>{(b.short || 'IQ').slice(0, 4)}</span>}
        <div className="min-w-0 border-l border-white/25 pl-3">
          <div className="truncate font-serif text-[14px] font-bold">Recognition Dashboard</div>
          <div className="truncate text-[10.5px] text-white/70">{b.short || b.name || 'Your college'} · NAAC readiness</div>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="font-serif text-[22px] font-bold leading-tight text-ink">{b.name || 'Your college'}</div>
        <div className="flex gap-2">
          <span className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white" style={{ background: b.primary }}>Upload Excel</span>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: b.accent, color: inkOn(b.accent) }}>Partly met</span>
        </div>
        <div className="overflow-hidden rounded-lg border border-hairline text-[10.5px]">
          <div className="px-3 py-1.5 text-center font-semibold text-white" style={{ background: b.primary }}>{(b.name || '[University Name]').toUpperCase()} · NAAC METRIC 4.1</div>
          <div className="grid grid-cols-[1fr_70px_70px] bg-raised text-body">
            {['Capital income', 'Capital expenditure'].map((l, i) => (
              <div key={l} className="contents"><span className="border-t border-divider px-3 py-1.5">{l}</span>
                <span className="border-t border-l border-divider bg-[var(--cream)] px-2 py-1.5 text-right tabular">{['1,120', '1,050'][i]}</span>
                <span className="border-t border-l border-divider px-2 py-1.5 text-right tabular">{['1,380', '1,410'][i]}</span></div>
            ))}
          </div>
        </div>
        <div className="flex h-14 items-end gap-1.5 px-1">
          {[.5, .45, .62, .58, .8, .84, .95, .9].map((h, i) => <motion.span key={i} animate={{ height: `${h * 100}%` }} className="flex-1 rounded-t-[3px]" style={{ background: i % 2 ? b.accent : b.primary }} />)}
        </div>
      </div>
    </motion.div>
  );
}

const Group = ({ title, children }: { title: string; children: React.ReactNode }) =>
  <fieldset className="space-y-4"><legend className="mb-3 text-[14px] font-semibold text-ink">{title}</legend>{children}</fieldset>;

function Field({ label, hint, value, onChange, placeholder, max }: { label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string; max?: number }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-body">{label}</span>{hint && <span className="ml-2 text-[12px] text-muted">{hint}</span>}
      <input value={value} maxLength={max} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        className="mt-1.5 h-10 w-full rounded-lg border border-hairline bg-surface px-3 text-[14px] text-ink outline-none transition placeholder:text-faint focus:border-[var(--brand-ink)] focus:bg-raised focus:ring-4 focus:ring-[color-mix(in_srgb,var(--brand)_14%,transparent)]" />
    </label>
  );
}

function ColourRow({ label, hint, value, options, onChange }: { label: string; hint: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="text-[13px] font-medium text-body">{label}<span className="ml-2 text-[12px] font-normal text-muted">{hint}</span></div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {options.map(c => (
          <button key={c} onClick={() => onChange(c)} aria-label={c}
            className={cn('size-8 rounded-full transition hover:scale-110', value.toLowerCase() === c.toLowerCase() && 'outline-2 outline-offset-2 outline-ink')}
            style={{ background: c, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)' }} />
        ))}
        <label className="relative ml-1 flex h-8 cursor-pointer items-center gap-2 rounded-full border border-hairline pl-1 pr-3 text-[12px] text-soft">
          <span className="size-6 rounded-full" style={{ background: value }} />
          <span className="font-mono">{value}</span>
          <input type="color" value={value} onChange={e => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
        </label>
      </div>
    </div>
  );
}

// Logos are stored as data URLs, so keep them small: at most 240px tall.
function shrinkImage(file: File): Promise<string> {
  return new Promise((ok, fail) => {
    const rd = new FileReader();
    rd.onerror = () => fail(new Error('Could not read that file.'));
    rd.onload = () => {
      const src = rd.result as string;
      if (file.type === 'image/svg+xml' && src.length < 150000) return ok(src);
      const img = new Image();
      img.onerror = () => fail(new Error('That file is not an image the browser can open.'));
      img.onload = () => {
        const s = Math.min(1, 240 / img.height, 480 / img.width);
        const cv = Object.assign(document.createElement('canvas'), { width: Math.round(img.width * s), height: Math.round(img.height * s) });
        cv.getContext('2d')!.drawImage(img, 0, 0, cv.width, cv.height);
        ok(cv.toDataURL('image/png'));
      };
      img.src = src;
    };
    rd.readAsDataURL(file);
  });
}
