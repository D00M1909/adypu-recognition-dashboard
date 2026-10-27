import type { Workbook } from '../engine/workbook';

/* A metric's sheets as tabs. The cover, the guidelines and the worked example
   are merged into one "How to fill this" tab at the end. */
export type SheetTab = { key: string; label: string; sheets: number[]; input: boolean };

const HELP = /cover|guidelines|worked example/i;
export const sheetLabel = (name: string) => name.replace(/^\d+\.\s*/, '');

export function sheetTabs(wb: Workbook): SheetTab[] {
  const s = wb.def.sheets, help = s.map((_, i) => i).filter(i => HELP.test(s[i].name));
  return [
    ...s.map((sh, i) => ({ key: String(i), label: sheetLabel(sh.name), sheets: [i], input: wb.inputs.some(x => x.si === i) }))
      .filter(t => !help.includes(t.sheets[0])),
    { key: 'help', label: 'How to fill this', sheets: help, input: false },
  ];
}
export const findTab = (wb: Workbook, key?: string) => {
  const tabs = sheetTabs(wb);
  return tabs.find(t => t.key === key) || tabs.find(t => t.input)!;
};
