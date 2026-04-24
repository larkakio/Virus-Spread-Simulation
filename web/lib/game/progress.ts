const KEY = 'vss_max_level';

const MAX = 3;

export function getUnlockedMaxLevel(): number {
  if (typeof window === 'undefined') return 1;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return 1;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(MAX, n);
}

export function onLevelCleared(clearedId: number): void {
  if (typeof window === 'undefined') return;
  const next = Math.min(MAX, clearedId + 1);
  const top = getUnlockedMaxLevel();
  if (next > top) {
    window.localStorage.setItem(KEY, String(next));
  }
}

export function canPlayLevel(id: number): boolean {
  return id <= getUnlockedMaxLevel();
}

/** @internal for tests */
export function _setUnlockedForTest(n: number): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, String(n));
}
