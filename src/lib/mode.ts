/* Light and dark. The choice is remembered; until then the system setting
   wins. Switching spreads the new theme out from the point that was clicked. */

import { useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { write } from './persist';

export type Mode = 'light' | 'dark';
const subs = new Set<() => void>();
const get = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light') as Mode;

export const useMode = () => useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f); }, get);

export function toggleMode(from?: { x: number; y: number }) {
  const next: Mode = get() === 'dark' ? 'light' : 'dark';
  const apply = () => {
    document.documentElement.dataset.theme = next;
    write('mode', next);
    flushSync(() => subs.forEach(f => f()));
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) return apply();
  const x = from?.x ?? innerWidth - 40, y = from?.y ?? 40;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' },
    );
  });
}
