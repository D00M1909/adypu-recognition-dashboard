/* University branding: name, logo and colours, set on the Customise page and
   saved in this browser. Also fills the [University Name] placeholders that
   the NAAC templates carry. */

const THEME_KEY = 'uni-theme';
const THEME_DEFAULT = {name: '', short: '', city: '', logo: '', primary: '#0d2350', accent: '#e9b824'};
let THEME = {...THEME_DEFAULT};
try { THEME = {...THEME_DEFAULT, ...JSON.parse(localStorage.getItem(THEME_KEY) || '{}')}; } catch(e){}

function brandText(s, xml){
  const x = t => xml ? t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : t;
  return s.replace(/\[UNIVERSITY NAME\]/g, THEME.name ? x(THEME.name.toUpperCase()) : '[UNIVERSITY NAME]')
    .replace(/\[University Name\]/g, THEME.name ? x(THEME.name) : '[University Name]')
    .replace(/\[City\]/g, THEME.city ? x(THEME.city) : '[City]');
}

/* ---------- colour helpers ---------- */
const hexRgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const rgbHex = a => '#' + a.map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
const mix = (h, to, t) => rgbHex(hexRgb(h).map((x, i) => x + (hexRgb(to)[i] - x) * t));
function luminance(h){
  const [r, g, b] = hexRgb(h).map(x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); });
  return .2126 * r + .7152 * g + .0722 * b;
}
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };

function applyTheme(t = THEME){
  const root = document.documentElement.style;
  root.setProperty('--navy', t.primary);
  root.setProperty('--navy2', mix(t.primary, '#ffffff', .18));
  root.setProperty('--gold', t.accent);
  root.setProperty('--gold-ink', luminance(t.accent) > .35 ? mix(t.accent, '#000000', .78) : '#ffffff');
  const mark = document.getElementById('brand-mark');
  mark.innerHTML = t.logo ? `<img src="${t.logo}" alt="">` : esc((t.short || 'IQAC').slice(0, 6));
  mark.classList.toggle('logo', !!t.logo);
  document.getElementById('brand-name').textContent = t.name || 'Recognition Dashboard';
  document.getElementById('brand-sub').textContent = 'NAAC readiness · IQAC';
  document.title = (t.short || t.name ? (t.short || t.name) + ' · ' : '') + 'Recognition Dashboard';
}

/* ---------- Customise page ---------- */
function renderBrand(){
  const t = THEME;
  const field = (id, label, val, extra = '') => `<label>${label}<input id="${id}" value="${esc(val)}" ${extra}></label>`;
  return `<section class="intro"><div class="eyebrow">Branding</div><h1>Customise for your university</h1>
    <p>Your name, logo and colours appear across the site and in every NAAC workbook you download.</p></section>
  <div class="brandgrid">
    <section class="card">
      <h3>University</h3>
      <div class="fields">
        ${field('b-name', 'Full name', t.name, 'placeholder="e.g. Sunrise University" maxlength="90"')}
        ${field('b-short', 'Short name (shown when there is no logo)', t.short, 'placeholder="e.g. SU" maxlength="6"')}
        ${field('b-city', 'City (used on CA certificates)', t.city, 'placeholder="e.g. Pune" maxlength="40"')}
      </div>
      <h3>Logo</h3>
      <div class="logorow">
        <div class="mark big ${t.logo ? 'logo' : ''}" id="b-logo-prev">${t.logo ? `<img src="${t.logo}" alt="">` : esc(t.short || 'IQAC')}</div>
        <div>
          <label class="btn"><input type="file" id="b-logo" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden>Upload logo</label>
          <button class="btn ghost" id="b-logo-x" type="button" ${t.logo ? '' : 'hidden'}>Remove</button>
          <p class="fine">PNG, JPG, SVG or WebP. Large images are scaled down to fit.</p>
        </div>
      </div>
      <h3>Colours</h3>
      <div class="fields">
        <label>Primary (header, headings)<span class="swatch"><input type="color" id="b-primary" value="${t.primary}"><code>${t.primary}</code></span></label>
        <label>Accent (highlights, badges)<span class="swatch"><input type="color" id="b-accent" value="${t.accent}"><code>${t.accent}</code></span></label>
      </div>
      <div class="msg warn" id="b-warn" hidden></div>
      <div class="brandact"><button class="btn" id="b-save" type="button">Save</button><button class="btn ghost" id="b-reset" type="button">Reset to default</button><span id="b-msg" class="fine"></span></div>
    </section>
    <section class="card">
      <h3>Preview</h3>
      <div class="bprev" id="b-prev"></div>
      <p class="fine">Saved in this browser only. Each person who uses the site sets their own.</p>
    </section>
  </div>`;
}

function mountBrand(){
  let draft = {...THEME};
  const $ = id => document.getElementById(id);
  const preview = () => {
    $('b-prev').innerHTML = `<div class="bp-top" style="background:${draft.primary}"><div class="mark ${draft.logo ? 'logo' : ''}" style="background:${draft.logo ? '#fff' : draft.accent};color:${draft.primary}">${draft.logo ? `<img src="${draft.logo}" alt="">` : esc(draft.short || 'IQAC')}</div>
      <div><b>${esc(draft.name || 'Recognition Dashboard')}</b><small>NAAC readiness · IQAC</small></div></div>
      <div class="bp-body"><span class="bp-chip" style="background:${draft.accent};color:${luminance(draft.accent) > .35 ? mix(draft.accent, '#000000', .78) : '#fff'}">Accent</span>
      <div class="bp-head" style="background:${draft.primary}">${esc(draft.name ? draft.name.toUpperCase() : '[UNIVERSITY NAME]')} · NAAC workbook cover</div></div>`;
    const c = contrast(draft.primary, '#ffffff');
    $('b-warn').hidden = c >= 4.5;
    $('b-warn').textContent = `White text on this primary colour has a contrast of ${c.toFixed(1)}:1. Pick a darker colour (4.5:1 or more) so header text stays readable.`;
    $('b-logo-prev').innerHTML = draft.logo ? `<img src="${draft.logo}" alt="">` : esc(draft.short || 'IQAC');
    $('b-logo-prev').classList.toggle('logo', !!draft.logo);
    $('b-logo-x').hidden = !draft.logo;
  };
  [['b-name', 'name'], ['b-short', 'short'], ['b-city', 'city']].forEach(([id, k]) => $(id).oninput = e => { draft[k] = e.target.value.trim(); preview(); });
  [['b-primary', 'primary'], ['b-accent', 'accent']].forEach(([id, k]) => $(id).oninput = e => { draft[k] = e.target.value; e.target.nextElementSibling.textContent = e.target.value; preview(); });
  $('b-logo').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    try { draft.logo = await shrinkImage(f); preview(); } catch(err) { $('b-msg').textContent = err.message; }
  };
  $('b-logo-x').onclick = () => { draft.logo = ''; preview(); };
  $('b-save').onclick = () => {
    THEME = {...draft};
    try { localStorage.setItem(THEME_KEY, JSON.stringify(THEME)); $('b-msg').textContent = 'Saved.'; }
    catch(e) { $('b-msg').textContent = 'Could not save in this browser (storage is full or blocked). The logo may be too large.'; }
    applyTheme();
  };
  $('b-reset').onclick = () => {
    draft = {...THEME_DEFAULT}; THEME = {...draft};
    try { localStorage.removeItem(THEME_KEY); } catch(e){}
    applyTheme(); render();
  };
  preview();
}

// Logos are stored as data URLs, so keep them small: at most 240px tall.
function shrinkImage(file){
  return new Promise((ok, fail) => {
    const rd = new FileReader();
    rd.onerror = () => fail(new Error('Could not read that file.'));
    rd.onload = () => {
      if (file.type === 'image/svg+xml' && rd.result.length < 150000) return ok(rd.result);
      const img = new Image();
      img.onerror = () => fail(new Error('That file is not an image the browser can open.'));
      img.onload = () => {
        const s = Math.min(1, 240 / img.height, 480 / img.width);
        const cv = Object.assign(document.createElement('canvas'), {width: Math.round(img.width * s), height: Math.round(img.height * s)});
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        ok(cv.toDataURL('image/png'));
      };
      img.src = rd.result;
    };
    rd.readAsDataURL(file);
  });
}
