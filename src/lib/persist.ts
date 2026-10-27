/* Where a college's data lives. Today that is this browser's localStorage;
   a hosted backend replaces these two functions and nothing else changes. */

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw) as T;
  } catch { return fallback; }
}

export function write(key: string, value: unknown): boolean {
  try {
    if (value === undefined || value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch { return false; }
}
