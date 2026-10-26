/* A small Excel formula evaluator: enough of the language for the NAAC
   workbooks (SUM, IF, COUNTIF, N, OR, AND, ABS, IFERROR, AVERAGE, MAX,
   SUMPRODUCT, DATE, LEFT, COUNT, cross-sheet references and & joins). */

const XL = (() => {
  class XlError { constructor(code){ this.code = code; } toString(){ return this.code; } }
  const ERR = { div0: new XlError('#DIV/0!'), value: new XlError('#VALUE!'), ref: new XlError('#REF!'), name: new XlError('#NAME?'), circ: new XlError('#CIRC!') };
  const isErr = x => x instanceof XlError;

  const colNum = s => [...s].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
  const colName = n => { let s = ''; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; } return s; };

  /* ---------- tokenizer ---------- */
  const REF = /^(?:'((?:[^']|'')+)'!|([A-Za-z_][\w.]*)!)?\$?([A-Z]{1,3})\$?(\d+)(?::\$?([A-Z]{1,3})\$?(\d+))?/;
  function tokenize(src){
    const out = []; let i = 0;
    while (i < src.length) {
      const ch = src[i], rest = src.slice(i);
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === '"') {
        let j = i + 1, s = '';
        while (j < src.length) { if (src[j] === '"') { if (src[j+1] === '"') { s += '"'; j += 2; continue; } break; } s += src[j++]; }
        out.push({t:'str', v:s}); i = j + 1; continue;
      }
      let m = REF.exec(rest);
      if (m && rest[m[0].length] !== '(') {
        const sheet = m[1] ? m[1].replace(/''/g, "'") : m[2] || null;
        out.push({t:'ref', sheet, c1: colNum(m[3]), r1: +m[4], c2: m[5] ? colNum(m[5]) : colNum(m[3]), r2: m[6] ? +m[6] : +m[4]});
        i += m[0].length; continue;
      }
      if ((m = /^\d+(\.\d+)?([eE][+-]?\d+)?/.exec(rest))) { out.push({t:'num', v: parseFloat(m[0])}); i += m[0].length; continue; }
      if ((m = /^([A-Za-z_][\w.]*)\s*\(/.exec(rest))) { out.push({t:'fn', v: m[1].toUpperCase()}); i += m[0].length; continue; }
      if ((m = /^(TRUE|FALSE)\b/i.exec(rest))) { out.push({t:'bool', v: m[1].toUpperCase() === 'TRUE'}); i += m[0].length; continue; }
      if ((m = /^(<=|>=|<>|[-+*/^&=<>(),%])/.exec(rest))) { out.push({t:'op', v: m[1]}); i += m[0].length; continue; }
      throw new Error('Cannot read formula at: ' + rest.slice(0, 20));
    }
    return out;
  }

  /* ---------- parser (precedence climbing) ---------- */
  function parse(src){
    const tk = tokenize(src); let p = 0;
    const peek = () => tk[p], next = () => tk[p++];
    const isOp = (...ops) => peek() && peek().t === 'op' && ops.includes(peek().v);
    function expect(v){ const t = next(); if (!t || t.v !== v) throw new Error('Expected ' + v); }
    function compare(){ let l = concat(); while (isOp('=','<>','<','>','<=','>=')) { const op = next().v; l = {k:'bin', op, l, r: concat()}; } return l; }
    function concat(){ let l = additive(); while (isOp('&')) { next(); l = {k:'bin', op:'&', l, r: additive()}; } return l; }
    function additive(){ let l = mult(); while (isOp('+','-')) { const op = next().v; l = {k:'bin', op, l, r: mult()}; } return l; }
    function mult(){ let l = power(); while (isOp('*','/')) { const op = next().v; l = {k:'bin', op, l, r: power()}; } return l; }
    function power(){ let l = unary(); while (isOp('^')) { next(); l = {k:'bin', op:'^', l, r: unary()}; } return l; }
    function unary(){
      if (isOp('-')) { next(); return {k:'neg', x: unary()}; }
      if (isOp('+')) { next(); return unary(); }
      let x = primary();
      while (isOp('%')) { next(); x = {k:'bin', op:'/', l:x, r:{k:'lit', v:100}}; }
      return x;
    }
    function primary(){
      const t = next();
      if (!t) throw new Error('Unexpected end of formula');
      if (t.t === 'num' || t.t === 'str' || t.t === 'bool') return {k:'lit', v: t.v};
      if (t.t === 'ref') return {k:'ref', ...t};
      if (t.t === 'fn') {
        const args = [];
        if (!isOp(')')) { do { args.push(isOp(',', ')') ? {k:'lit', v:null} : compare()); } while (isOp(',') && next()); }
        expect(')');
        return {k:'fn', name: t.v, args};
      }
      if (t.v === '(') { const x = compare(); expect(')'); return x; }
      throw new Error('Unexpected ' + t.v);
    }
    const ast = compare();
    if (p < tk.length) throw new Error('Unexpected ' + tk[p].v);
    return ast;
  }

  /* ---------- coercion ---------- */
  const blank = v => v === null || v === undefined || v === '';
  function num(v){
    if (isErr(v)) return v;
    if (blank(v)) return 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'boolean') return v ? 1 : 0;
    const n = Number(String(v).replace(/,/g, '').trim());
    return String(v).trim() !== '' && !isNaN(n) ? n : ERR.value;
  }
  function general(n){
    if (Number.isInteger(n)) return String(n);
    return String(parseFloat(n.toPrecision(10)));
  }
  function str(v){
    if (blank(v)) return '';
    if (typeof v === 'number') return general(v);
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    return String(v);
  }
  const truthy = v => typeof v === 'boolean' ? v : typeof v === 'number' ? v !== 0 : blank(v) ? false : ERR.value;

  function cmp(a, b){
    // Excel orders numbers < text < booleans; blanks match 0 and "".
    if (blank(a) && blank(b)) return 0;
    if (blank(a)) a = typeof b === 'string' ? '' : typeof b === 'boolean' ? false : 0;
    if (blank(b)) b = typeof a === 'string' ? '' : typeof a === 'boolean' ? false : 0;
    const rank = x => typeof x === 'number' ? 0 : typeof x === 'string' ? 1 : 2;
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    if (typeof a === 'string') { a = a.toLowerCase(); b = b.toLowerCase(); }
    return a < b ? -1 : a > b ? 1 : 0;
  }

  /* COUNTIF criteria: ">0", "Yes", "<>x", "=5" */
  function criterion(c){
    const m = /^(<=|>=|<>|<|>|=)?(.*)$/s.exec(str(c));
    const op = m[1] || '=', raw = m[2];
    const n = raw.trim() !== '' && !isNaN(Number(raw)) ? Number(raw) : null;
    return v => {
      if (n !== null && typeof v !== 'number') return op === '<>' ? true : false;
      const d = n !== null ? cmp(v, n) : (typeof v === 'number' && op === '=' ? 1 : cmp(blank(v) ? '' : str(v), raw));
      return {'=': d === 0, '<>': d !== 0, '<': d < 0, '>': d > 0, '<=': d <= 0, '>=': d >= 0}[op];
    };
  }

  /* ---------- evaluator ---------- */
  // ctx.cell(sheet, r, c) -> value; ctx.sheet = current sheet name
  function evaluate(ast, ctx){
    const ev = node => evaluate(node, ctx);
    switch (ast.k) {
      case 'lit': return ast.v;
      case 'ref': {
        const sheet = ast.sheet || ctx.sheet;
        if (ast.r1 === ast.r2 && ast.c1 === ast.c2) return ctx.cell(sheet, ast.r1, ast.c1);
        return {range: true, sheet, r1: ast.r1, c1: ast.c1, r2: ast.r2, c2: ast.c2};
      }
      case 'neg': { const x = num(scalar(ev(ast.x), ctx)); return isErr(x) ? x : -x; }
      case 'bin': {
        const a = scalar(ev(ast.l), ctx), b = scalar(ev(ast.r), ctx);
        if (isErr(a)) return a; if (isErr(b)) return b;
        if (ast.op === '&') return str(a) + str(b);
        if (['=','<>','<','>','<=','>='].includes(ast.op)) {
          const d = cmp(a, b);
          return {'=': d === 0, '<>': d !== 0, '<': d < 0, '>': d > 0, '<=': d <= 0, '>=': d >= 0}[ast.op];
        }
        const x = num(a), y = num(b);
        if (isErr(x)) return x; if (isErr(y)) return y;
        switch (ast.op) {
          case '+': return x + y; case '-': return x - y; case '*': return x * y;
          case '/': return y === 0 ? ERR.div0 : x / y; case '^': return Math.pow(x, y);
        }
      }
      case 'fn': {
        const f = FN[ast.name];
        if (!f) return ERR.name;
        return f(ast.args, ctx, ev);
      }
    }
    return ERR.value;
  }
  function scalar(v, ctx){
    if (v && v.range) return ctx.cell(v.sheet, v.r1, v.c1);
    return v;
  }
  function cellsOf(v, ctx){
    if (!(v && v.range)) return [v];
    const out = [];
    for (let r = v.r1; r <= v.r2; r++) for (let c = v.c1; c <= v.c2; c++) out.push(ctx.cell(v.sheet, r, c));
    return out;
  }
  // Numbers to aggregate: from ranges only real numbers count; direct arguments are coerced.
  function numbers(args, ctx, ev){
    const out = [];
    for (const a of args) {
      const v = ev(a);
      if (v && v.range) { for (const x of cellsOf(v, ctx)) { if (isErr(x)) return x; if (typeof x === 'number') out.push(x); } }
      else { const n = num(v); if (isErr(n)) return n; out.push(n); }
    }
    return out;
  }

  const FN = {
    SUM: (a, ctx, ev) => { const n = numbers(a, ctx, ev); return isErr(n) ? n : n.reduce((s, x) => s + x, 0); },
    AVERAGE: (a, ctx, ev) => { const n = numbers(a, ctx, ev); return isErr(n) ? n : n.length ? n.reduce((s, x) => s + x, 0) / n.length : ERR.div0; },
    MAX: (a, ctx, ev) => { const n = numbers(a, ctx, ev); return isErr(n) ? n : n.length ? Math.max(...n) : 0; },
    COUNT: (a, ctx, ev) => a.reduce((s, x) => s + cellsOf(ev(x), ctx).filter(v => typeof v === 'number').length, 0),
    COUNTIF: (a, ctx, ev) => { const test = criterion(scalar(ev(a[1]), ctx)); return cellsOf(ev(a[0]), ctx).filter(v => !isErr(v) && test(v)).length; },
    SUMPRODUCT: (a, ctx, ev) => {
      const cols = a.map(x => cellsOf(ev(x), ctx));
      let s = 0;
      for (let i = 0; i < cols[0].length; i++) s += cols.reduce((p, c) => p * (typeof c[i] === 'number' ? c[i] : 0), 1);
      return s;
    },
    IF: (a, ctx, ev) => {
      const t = truthy(scalar(ev(a[0]), ctx));
      if (isErr(t)) return t;
      return t ? scalar(ev(a[1]), ctx) : a.length > 2 ? scalar(ev(a[2]), ctx) : false;
    },
    IFERROR: (a, ctx, ev) => { const v = scalar(ev(a[0]), ctx); return isErr(v) ? scalar(ev(a[1]), ctx) : v; },
    AND: (a, ctx, ev) => { for (const x of a) { const t = truthy(scalar(ev(x), ctx)); if (isErr(t)) return t; if (!t) return false; } return true; },
    OR: (a, ctx, ev) => { for (const x of a) { const t = truthy(scalar(ev(x), ctx)); if (isErr(t)) return t; if (t) return true; } return false; },
    N: (a, ctx, ev) => { const v = scalar(ev(a[0]), ctx); return typeof v === 'number' ? v : typeof v === 'boolean' ? +v : isErr(v) ? v : 0; },
    ABS: (a, ctx, ev) => { const v = num(scalar(ev(a[0]), ctx)); return isErr(v) ? v : Math.abs(v); },
    LEFT: (a, ctx, ev) => { const v = scalar(ev(a[0]), ctx); if (isErr(v)) return v; const n = a.length > 1 ? num(scalar(ev(a[1]), ctx)) : 1; return str(v).slice(0, n); },
    DATE: (a, ctx, ev) => {
      const [y, m, d] = a.map(x => num(scalar(ev(x), ctx)));
      return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 864e5);
    },
  };

  /* ---------- number formats ---------- */
  function splitSections(fmt){
    const out = []; let cur = '', q = false;
    for (let i = 0; i < fmt.length; i++) {
      const ch = fmt[i];
      if (ch === '"') q = !q;
      if (ch === '\\' && !q) { cur += ch + fmt[++i]; continue; }
      if (ch === ';' && !q) { out.push(cur); cur = ''; continue; }
      cur += ch;
    }
    out.push(cur);
    return out;
  }
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function dateText(serial){
    const d = new Date(Date.UTC(1899, 11, 30) + Math.round(serial) * 864e5);
    return `${String(d.getUTCDate()).padStart(2,'0')}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
  }
  function format(v, fmt){
    if (isErr(v)) return v.code;
    if (blank(v)) return '';
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    if (typeof v !== 'number') return String(v);
    if (!fmt || fmt === 'General' || fmt === '@') return general(v);
    if (/yy/.test(fmt)) return dateText(v);
    const secs = splitSections(fmt);
    let sec = secs[0], x = v;
    if (v < 0 && secs.length > 1) { sec = secs[1]; x = -v; }
    else if (v === 0 && secs.length > 2) sec = secs[2];
    // literal text: quoted strings and backslash escapes
    let pre = '', post = '', body = '';
    const parts = sec.match(/"[^"]*"|\\.|[^"\\]+/g) || [];
    let seenDigit = false;
    for (const p of parts) {
      const lit = p[0] === '"' ? p.slice(1, -1) : p[0] === '\\' ? p[1] : null;
      if (lit !== null) { if (seenDigit) post += lit; else pre += lit; continue; }
      // a plain run may hold digits and wrapping punctuation like "(" ")"
      const m = /^([^#0.,%]*)([#0.,%]*)(.*)$/.exec(p);
      if (m[2]) { if (seenDigit) post += m[1]; else pre += m[1]; body += m[2]; seenDigit = true; post += m[3]; }
      else if (seenDigit) post += p; else pre += p;
    }
    if (!body) return pre + post;
    if (body.includes('%')) x *= 100;
    const dec = (/\.(0+)/.exec(body) || ['', ''])[1].length;
    const grouped = body.includes(',');
    const s = grouped ? x.toLocaleString('en-IN', {minimumFractionDigits: dec, maximumFractionDigits: dec}) : x.toFixed(dec);
    return pre + s + (body.includes('%') ? '%' : '') + post;
  }

  return { parse, evaluate, format, isErr, ERR, colNum, colName, str, num, blank };
})();
