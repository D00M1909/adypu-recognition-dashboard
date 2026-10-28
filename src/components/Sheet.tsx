/* One workbook sheet drawn as its grid: the template's fills, merges and
   number formats, cream cells to type in, and formula cells that flash when
   their result changes. */

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as XL from '../engine/formula';
import { Workbook, chartData, useWorkbook, type CellDef, type WorkbookDef } from '../engine/workbook';
import { coerce, parseDate, serialToISO } from '../engine/io';
import { brandText, luminance, mix } from '../lib/brand';
import { Bars } from './Bars';
import { cn } from './ui';

// The templates' navy and gold become the college's own colours.
const THEMED: Record<string, [string, string]> = { '1F3864': ['var(--header-from)', 'var(--brand-ink)'], 'C9A227': ['var(--accent)', 'var(--accent)'] };

function workbookCss(def: WorkbookDef) {
  const scope = `.xl-${def.id.replace('.', '')}`, pt = (sz?: number) => Math.round(8.5 + (sz || 10) * 0.45);
  const light: string[] = [], dark: string[] = [];
  def.styles.forEach((s, i) => {
    const l: string[] = [], d: string[] = [];
    if (s.b) l.push('font-weight:600');
    if (s.i) l.push('font-style:italic');
    if (s.sz && s.sz !== 10 && s.sz !== 11) l.push(`font-size:${pt(s.sz)}px`);
    if (s.al) l.push('text-align:' + (s.al === 'centerContinuous' ? 'center' : s.al === 'general' ? 'left' : s.al));
    if (s.bg) {
      const t = THEMED[s.bg];
      if (t) l.push(`background:${t[0]}`);
      else {
        l.push(`background:#${s.bg}`);
        // Pale fills sink into the dark surface; deep ones keep their colour.
        d.push(`background:${luminance('#' + s.bg) > .45 ? mix('#' + s.bg, '#131a23', .86) : mix('#' + s.bg, '#131a23', .35)}`);
      }
    }
    if (s.fg && s.fg !== '000000') {
      const t = THEMED[s.fg];
      if (t) l.push(`color:${t[1]}`);
      else {
        l.push(`color:#${s.fg}`);
        if (luminance('#' + s.fg) < .25) d.push(`color:${mix('#' + s.fg, '#ffffff', .62)}`);
      }
    }
    if (l.length) light.push(`${scope} .s${i}{${l.join(';')}}`);
    if (d.length) dark.push(`[data-theme="dark"] ${scope} .s${i}{${d.join(';')}}`);
  });
  return light.join('\n') + '\n' + dark.join('\n');
}

export function Sheet({ wb, si }: { wb: Workbook; si: number }) {
  useWorkbook(wb);
  const S = wb.def.sheets[si], first = 2, last = S.maxCol, ncol = last - first + 1;
  const css = useMemo(() => workbookCss(wb.def), [wb]);
  const layout = useMemo(() => {
    const span = new Map<number, [number, number]>(), covered = new Set<number>();
    for (const [r1, c1, r2, c2] of S.merges) {
      span.set(r1 * 1000 + c1, [r2 - r1 + 1, Math.min(c2, last) - Math.max(c1, first) + 1]);
      for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) if (r !== r1 || c !== c1) covered.add(r * 1000 + c);
    }
    return { span, covered, charts: new Map(S.charts.map(ch => [ch.r1, ch])) };
  }, [S, last]);
  const px = (c: number) => Math.round((S.widths[XL.colName(c)] || 13) * 7 + 5);

  const rows = [];
  for (let r = 1; r <= S.maxRow; r++) {
    const ch = layout.charts.get(r);
    if (ch) {
      rows.push(<tr key={r}><td className="xchart" colSpan={ncol}><div className="max-w-[720px]"><Bars data={chartData(wb, si, ch)} /></div></td></tr>);
      r = ch.r2;
      continue;
    }
    const cells = [];
    let any = false;
    for (let c = first; c <= last; c++) {
      if (layout.covered.has(r * 1000 + c)) continue;
      const d = wb.cellDef(si, r, c), sp = layout.span.get(r * 1000 + c);
      const spanProps = sp ? { rowSpan: sp[0] > 1 ? sp[0] : undefined, colSpan: sp[1] > 1 ? sp[1] : undefined } : {};
      if (!d) { cells.push(<td key={c} {...spanProps} />); continue; }
      any = true;
      cells.push(<Cell key={c} wb={wb} si={si} d={d} spanProps={spanProps} v={wb.version} />);
    }
    rows.push(<tr key={r} data-r={r} className={any ? undefined : 'blank'}>{cells}</tr>);
  }

  return (
    <div className="xlwrap">
      <style>{css}</style>
      <table className={`xl xl-${wb.def.id.replace('.', '')}`} style={{ width: Array.from({ length: ncol }, (_, i) => px(first + i)).reduce((a, b) => a + b, 0) }}>
        <colgroup>{Array.from({ length: ncol }, (_, i) => <col key={i} style={{ width: px(first + i) }} />)}</colgroup>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

type SpanProps = { rowSpan?: number; colSpan?: number };
const Cell = memo(function Cell({ wb, si, d, spanProps }: { wb: Workbook; si: number; d: CellDef; spanProps: SpanProps; v: number }) {
  const [r, c, v, f, st, fm, spec] = d;
  if (spec) return <td className={`s${st} in`} {...spanProps}><InputCell wb={wb} si={si} d={d} /></td>;
  if (f != null) return <FxCell wb={wb} si={si} d={d} spanProps={spanProps} />;
  const text = typeof v === 'number' ? XL.format(v, wb.def.fmts[fm]) : brandText(String(v ?? ''));
  return <td className={cn(`s${st}`, typeof v === 'number' && 'n')} {...spanProps} data-rc={`${r},${c}`}>{text}</td>;
});

function FxCell({ wb, si, d, spanProps }: { wb: Workbook; si: number; d: CellDef; spanProps: SpanProps }) {
  const [r, c, , f, st] = d;
  const text = wb.display(si, r, c), val = wb.value(si, r, c);
  const ref = useRef<HTMLTableCellElement>(null), prev = useRef(text);
  useEffect(() => {
    if (prev.current !== text && ref.current) {
      ref.current.classList.remove('flash'); void ref.current.offsetWidth; ref.current.classList.add('flash');
    }
    prev.current = text;
  }, [text]);
  return <td ref={ref} className={cn(`s${st} fx`, typeof val === 'number' && 'n')} {...spanProps} title={`=${f}`}>{text}</td>;
}

function InputCell({ wb, si, d }: { wb: Workbook; si: number; d: CellDef }) {
  const [r, c, , , , fm, spec] = d, k = Workbook.k(si, r, c);
  const val = wb.value(si, r, c), label = `${wb.def.sheets[si].name} ${XL.colName(c)}${r}`;
  const [focus, setFocus] = useState(false), [draft, setDraft] = useState(''), [bad, setBad] = useState(false);

  if (spec!.t === 'list') {
    const opts = spec!.o || [];
    return (
      <select aria-label={label} value={XL.blank(val) ? '' : String(val)} onChange={e => wb.set(k, e.target.value || null)}>
        <option value="" />
        {opts.map(o => <option key={o}>{o}</option>)}
        {!XL.blank(val) && !opts.includes(String(val)) && <option>{String(val)}</option>}
      </select>
    );
  }
  if (spec!.t === 'date') {
    return <input type="date" aria-label={label} value={typeof val === 'number' ? serialToISO(val) : ''} onChange={e => wb.set(k, e.target.value ? parseDate(e.target.value) : null)} />;
  }
  const numeric = spec!.t !== 'text';
  // Numbers read formatted (₹ grouping) until the cell is being edited.
  const shown = focus ? draft : XL.blank(val) ? '' : numeric && typeof val === 'number' ? XL.format(val, wb.def.fmts[fm]) : String(val);
  return (
    <input
      type="text" aria-label={label} inputMode={numeric ? 'decimal' : undefined} value={shown}
      className={cn(bad && 'text-bad')}
      onFocus={e => { setDraft(XL.blank(val) ? '' : String(val)); setFocus(true); requestAnimationFrame(() => e.target.select()); }}
      onBlur={() => { setFocus(false); setBad(false); }}
      onKeyDown={e => { if (e.key === 'Enter') moveDown(e.currentTarget); }}
      onChange={e => {
        const text = e.target.value;
        setDraft(text);
        if (!numeric) { wb.set(k, text === '' ? null : text); return; }
        let wrong = false;
        const out = coerce(text, spec!, () => { wrong = true; });
        setBad(wrong && out === undefined);
        if (out !== undefined) wb.set(k, out);
      }}
    />
  );
}

// Enter moves to the next cream cell below, the way it does in Excel.
function moveDown(el: HTMLInputElement) {
  const all = [...el.closest('table')!.querySelectorAll<HTMLInputElement>('td.in input[type="text"]')];
  const me = el.getBoundingClientRect();
  const below = all.filter(x => x !== el).map(x => ({ x, r: x.getBoundingClientRect() }))
    .filter(o => o.r.top > me.top + 2 && Math.abs(o.r.left - me.left) < 4).sort((a, b) => a.r.top - b.r.top)[0];
  below?.x.focus();
}
