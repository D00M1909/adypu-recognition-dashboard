/* The college's branding: name, logo and colours. Drives the header, the
   accent colour across the app, the workbook headers, and the
   [University Name] placeholders the NAAC templates carry. */

import { useSyncExternalStore } from 'react';
import { read, write } from './persist';

export type Brand = { name: string; short: string; city: string; logo: string; primary: string; accent: string };

export const BRAND_DEFAULT: Brand = {
  name: 'Ajeenkya D Y Patil University', short: 'ADYPU', city: 'Pune',
  logo: `${import.meta.env.BASE_URL}crest.png`, primary: '#C21B27', accent: '#C9A227',
};
const KEY = 'brand';

let brand: Brand = { ...BRAND_DEFAULT, ...read<Partial<Brand>>(KEY, {}) };
const subs = new Set<() => void>();

export const getBrand = () => brand;
export function setBrand(next: Brand | null): boolean {
  brand = next ? { ...next } : { ...BRAND_DEFAULT };
  const ok = write(KEY, next);
  applyBrand(brand);
  subs.forEach(f => f());
  return ok;
}
export const useBrand = () => useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f); }, getBrand);

export function brandText(s: string, xml = false, b = brand) {
  const x = (t: string) => xml ? t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : t;
  return s.replace(/\[UNIVERSITY NAME\]/g, b.name ? x(b.name.toUpperCase()) : '[UNIVERSITY NAME]')
    .replace(/\[University Name\]/g, b.name ? x(b.name) : '[University Name]')
    .replace(/\[City\]/g, b.city ? x(b.city) : '[City]');
}

/* ---------- colour ---------- */
const hexRgb = (h: string) => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const rgbHex = (a: number[]) => '#' + a.map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
export const mix = (h: string, to: string, t: number) => rgbHex(hexRgb(h).map((x, i) => x + (hexRgb(to)[i] - x) * t));
export function luminance(h: string) {
  const [r, g, b] = hexRgb(h).map(x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); });
  return .2126 * r + .7152 * g + .0722 * b;
}
export const contrast = (a: string, b: string) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
export const inkOn = (bg: string) => luminance(bg) > .35 ? mix(bg, '#000000', .78) : '#ffffff';

export function applyBrand(b: Brand = brand) {
  const s = document.documentElement.style;
  s.setProperty('--brand', b.primary);
  s.setProperty('--brand-deep', mix(b.primary, '#000000', .28));
  s.setProperty('--brand-night', mix(b.primary, '#0b0f14', .55));
  s.setProperty('--brand-night-deep', mix(b.primary, '#0b0f14', .75));
  // Brand colour used as text or lines: darkened on light, lifted on dark, so it stays readable on both.
  s.setProperty('--brand-ink-light', contrast(b.primary, '#ffffff') >= 4.5 ? b.primary : mix(b.primary, '#000000', .35));
  s.setProperty('--brand-ink-dark', mix(b.primary, '#ffffff', .38));
  s.setProperty('--accent', b.accent);
  s.setProperty('--accent-ink', inkOn(b.accent));
  document.title = `${b.short || b.name ? (b.short || b.name) + ' · ' : ''}Recognition Dashboard`;
}
