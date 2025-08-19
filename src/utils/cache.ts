export function saveCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ ts: Date.now(), data })
    );
  } catch {}
}

export function loadCache<T>(key: string, maxAgeMs: number): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > maxAgeMs) return null;
    return data as T;
  } catch {
    return null;
  }
}
