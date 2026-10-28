/* Ctrl K (or /): jump to any page, metric or sheet, or run an action. */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, FileSpreadsheet, LayoutGrid, Moon, Palette, Sparkles, Table2, Trash2, Landmark } from 'lucide-react';
import { WORKBOOK_LIST } from '../engine/workbook';
import { SHORT } from '../lib/naac';
import { toggleMode } from '../lib/mode';
import { sheetTabs } from './sheetTabs';
import { toast } from 'sonner';
import { downloadWorkbook } from '../lib/download';

const OPEN = 'palette:open';
export const openPalette = () => window.dispatchEvent(new Event(OPEN));

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const show = () => setOpen(true);
    const key = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); setOpen(o => !o); }
    };
    window.addEventListener(OPEN, show);
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener(OPEN, show); window.removeEventListener('keydown', key); };
  }, []);

  const go = (fn: () => void) => { setOpen(false); fn(); };
  const item = 'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-body data-[selected=true]:bg-sunk data-[selected=true]:text-ink';
  const group = 'px-1 pb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[.14em] [&_[cmdk-group-heading]]:text-muted';

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center bg-black/35 px-4 pt-[12vh] backdrop-blur-[3px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}
          onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <motion.div initial={{ opacity: 0, y: -12, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .98 }}
            transition={{ type: 'spring', stiffness: 520, damping: 36 }}
            className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-hairline bg-raised shadow-lg">
            <Command label="Jump to" loop onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}>
              <Command.Input autoFocus placeholder="Jump to a metric, sheet or action…"
                className="h-14 w-full border-b border-divider bg-transparent px-5 text-[15px] text-ink outline-none placeholder:text-faint" />
              <Command.List className="max-h-[min(60vh,440px)] overflow-y-auto overscroll-contain py-1">
                <Command.Empty className="px-5 py-8 text-center text-[14px] text-muted">Nothing matches.</Command.Empty>
                <Command.Group heading="Go to" className={group}>
                  <Command.Item className={item} onSelect={() => go(() => nav('/'))}><LayoutGrid size={16} className="text-muted" />Overview</Command.Item>
                  <Command.Item className={item} onSelect={() => go(() => nav('/naac'))}><Landmark size={16} className="text-muted" />NAAC framework</Command.Item>
                  <Command.Item className={item} onSelect={() => go(() => nav('/brand'))}><Palette size={16} className="text-muted" />Customise branding</Command.Item>
                </Command.Group>
                <Command.Group heading="Attribute 4 metrics" className={group}>
                  {WORKBOOK_LIST.map(wb => (
                    <Command.Item key={wb.def.id} value={`${wb.def.id} ${SHORT[wb.def.id]}`} className={item} onSelect={() => go(() => nav(`/a4/${wb.def.id}`))}>
                      <span className="w-8 font-mono text-[12px] text-brand-ink">{wb.def.id}</span>{SHORT[wb.def.id]}
                      <ArrowRight size={14} className="ml-auto text-faint" />
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="Sheets" className={group}>
                  {WORKBOOK_LIST.flatMap(wb => sheetTabs(wb).map(t => (
                    <Command.Item key={wb.def.id + t.key} value={`${wb.def.id} ${t.label} ${SHORT[wb.def.id]}`} className={item}
                      onSelect={() => go(() => nav(`/a4/${wb.def.id}/${t.key}`))}>
                      <Table2 size={16} className="text-muted" /><span className="w-8 font-mono text-[12px] text-muted">{wb.def.id}</span>{t.label}
                    </Command.Item>
                  )))}
                </Command.Group>
                <Command.Group heading="Actions" className={group}>
                  <Command.Item className={item} onSelect={() => go(() => { WORKBOOK_LIST.forEach(w => w.loadSample()); toast.success('Sample data loaded in all four metrics'); })}>
                    <Sparkles size={16} className="text-muted" />Load sample data
                  </Command.Item>
                  <Command.Item className={item} onSelect={() => go(() => {
                    const on = WORKBOOK_LIST.filter(w => w.isSample);
                    on.forEach(w => w.clear());
                    toast(on.length ? 'Sample data cleared' : 'No sample data to clear');
                  })}>
                    <Trash2 size={16} className="text-muted" />Clear sample data
                  </Command.Item>
                  <Command.Item className={item} onSelect={() => go(() => toggleMode())}><Moon size={16} className="text-muted" />Switch light / dark</Command.Item>
                  {WORKBOOK_LIST.map(wb => (
                    <Command.Item key={'t' + wb.def.id} value={`blank template ${wb.def.id} ${SHORT[wb.def.id]}`} className={item}
                      onSelect={() => go(() => downloadWorkbook(wb, true))}>
                      <FileSpreadsheet size={16} className="text-muted" />Blank template · {wb.def.id}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
