import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Moon, Search, Sun } from 'lucide-react';
import { useBrand } from '../lib/brand';
import { toggleMode, useMode } from '../lib/mode';
import { openPalette } from './CommandPalette';
import { cn } from './ui';

const NAV = [
  { to: '/', label: 'Overview', match: (p: string) => p === '/' || p.startsWith('/a4') },
  { to: '/naac', label: 'Framework', match: (p: string) => p.startsWith('/naac') },
  { to: '/brand', label: 'Customise', match: (p: string) => p.startsWith('/brand') },
];

export function Header() {
  const b = useBrand(), mode = useMode(), { pathname } = useLocation();
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-[linear-gradient(120deg,var(--header-from),var(--header-to))] text-white">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3 rounded-lg" aria-label="Overview">
          {b.logo
            ? <span className="flex h-11 shrink-0 items-center rounded-[10px] bg-white px-2 shadow-sm"><img src={b.logo} alt="" className="h-9 w-auto max-w-[120px] object-contain" /></span>
            : <span className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-accent font-serif text-[15px] font-bold text-accent-ink">{(b.short || 'IQ').slice(0, 4)}</span>}
          <span className="hidden min-w-0 border-l border-white/25 pl-3 sm:block">
            <span className="block truncate font-serif text-[17px] font-bold leading-tight">Recognition Dashboard</span>
            <span className="block truncate text-[11.5px] text-white/70">{b.short || b.name || 'Your college'} · NAAC readiness</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 rounded-xl bg-black/15 p-1 sm:flex" aria-label="Main">
          {NAV.map(n => {
            const on = n.match(pathname);
            return (
              <NavLink key={n.to} to={n.to} className={cn('relative rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors', on ? 'text-white' : 'text-white/70 hover:text-white')}>
                {on && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-lg bg-white/18 shadow-[inset_0_0_0_1px_rgba(255,255,255,.18)]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                <span className="relative">{n.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button onClick={openPalette} className="hidden h-9 items-center gap-2 rounded-lg bg-black/15 px-3 text-[13px] text-white/75 transition hover:bg-black/25 hover:text-white md:flex" aria-label="Search">
          <Search size={15} /> Jump to…
          <kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10.5px]">{mac ? '⌘' : 'Ctrl'} K</kbd>
        </button>
        <button onClick={openPalette} className="ml-auto grid size-9 place-items-center rounded-lg bg-black/15 sm:ml-0 md:hidden" aria-label="Search"><Search size={16} /></button>
        <button
          onClick={e => toggleMode({ x: e.clientX, y: e.clientY })}
          className="grid size-9 place-items-center rounded-lg bg-black/15 transition hover:bg-black/25"
          aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <motion.span key={mode} initial={{ rotate: -90, scale: .5, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
            {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </motion.span>
        </button>
      </div>
    </header>
  );
}

/* On a phone the main links sit in a floating bar at the bottom, in reach of a thumb. */
export function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(12px,env(safe-area-inset-bottom))] sm:hidden" aria-label="Main">
      <div className="flex gap-1 rounded-2xl border border-hairline bg-raised/90 p-1.5 shadow-lg backdrop-blur-md">
        {NAV.map(n => {
          const on = n.match(pathname);
          return (
            <NavLink key={n.to} to={n.to} className={cn('relative rounded-xl px-4 py-2 text-[13.5px] font-medium transition-colors', on ? 'text-white' : 'text-soft')}>
              {on && <motion.span layoutId="mnav-pill" className="absolute inset-0 rounded-xl bg-brand" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              <span className="relative">{n.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
