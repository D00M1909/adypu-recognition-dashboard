import { toast } from 'sonner';
import { exportFile } from '../engine/io';
import type { Workbook } from '../engine/workbook';
import { getBrand } from './brand';

/** Download a metric's workbook, filled or blank, with the college's name written into it. */
export async function downloadWorkbook(wb: Workbook, blank = false) {
  const id = toast.loading(blank ? 'Preparing the blank template…' : 'Preparing the workbook…');
  const who = getBrand().name;
  try {
    await exportFile(wb, { blank });
    toast.success(blank ? `Blank ${wb.def.id} template downloaded` : 'Downloaded', {
      id,
      description: [who && `Made out to ${who}.`, !blank && 'Formulas recalculate when you open it in Excel or Google Sheets.'].filter(Boolean).join(' '),
    });
  } catch (e) { toast.error('Download failed', { id, description: (e as Error).message }); }
}
