import type { Cell, Direction, GameState, LevelConfig } from './types';

const idx = (w: number, r: number, c: number) => r * w + c;
const inBounds = (h: number, w: number, r: number, c: number) =>
  r >= 0 && c >= 0 && r < h && c < w;

const NEI = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function shuffleInPlace<T>(a: T[], random: () => number) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

export function makeGridFromLevel(level: LevelConfig): Cell[] {
  const n = level.width * level.height;
  const cells: Cell[] = new Array(n).fill('H');
  for (const { r, c } of level.quarantine) {
    if (inBounds(level.height, level.width, r, c)) {
      cells[idx(level.width, r, c)] = 'Q';
    }
  }
  for (const { r, c } of level.initialInfected) {
    if (inBounds(level.height, level.width, r, c)) {
      const i = idx(level.width, r, c);
      if (cells[i] === 'H') cells[i] = 'I';
    }
  }
  return cells;
}

export function createInitialState(level: LevelConfig): GameState {
  return {
    w: level.width,
    h: level.height,
    cells: makeGridFromLevel(level),
    turns: 0,
    level,
    status: 'playing',
    loseReason: null,
  };
}

function countInfected(cells: Cell[], w: number, h: number): number {
  let n = 0;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (cells[idx(w, r, c)] === 'I') n++;
    }
  }
  return n;
}

/** Treatment pulse: entire border strip on swipe side turns infected back to healthy (quarantine is untouched). */
export function applyPulse(
  cells: Cell[],
  w: number,
  h: number,
  dir: Direction,
): Cell[] {
  const out = cells.slice();
  if (dir === 'up') {
    for (let c = 0; c < w; c++) {
      const i = idx(w, 0, c);
      if (out[i] === 'I') out[i] = 'H';
    }
  } else if (dir === 'down') {
    for (let c = 0; c < w; c++) {
      const i = idx(w, h - 1, c);
      if (out[i] === 'I') out[i] = 'H';
    }
  } else if (dir === 'left') {
    for (let r = 0; r < h; r++) {
      const i = idx(w, r, 0);
      if (out[i] === 'I') out[i] = 'H';
    }
  } else {
    for (let r = 0; r < h; r++) {
      const i = idx(w, r, w - 1);
      if (out[i] === 'I') out[i] = 'H';
    }
  }
  return out;
}

function spread(
  cells: Cell[],
  w: number,
  h: number,
  k: number,
  random: () => number,
): Cell[] {
  const out = cells.slice();
  const sources: { r: number; c: number }[] = [];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (out[idx(w, r, c)] === 'I') sources.push({ r, c });
    }
  }
  shuffleInPlace(sources, random);
  const candidates: { r: number; c: number }[] = [];
  for (const { r, c } of sources) {
    for (const [dr, dc] of NEI) {
      const r2 = r + dr;
      const c2 = c + dc;
      if (inBounds(h, w, r2, c2) && out[idx(w, r2, c2)] === 'H') {
        candidates.push({ r: r2, c: c2 });
      }
    }
  }
  shuffleInPlace(candidates, random);
  for (let i = 0; i < Math.min(k, candidates.length); i++) {
    const { r, c } = candidates[i];
    if (out[idx(w, r, c)] === 'H') {
      out[idx(w, r, c)] = 'I';
    }
  }
  return out;
}

function infectionRatio(cells: Cell[], w: number, h: number): number {
  const total = w * h;
  const q = cells.filter((x) => x === 'Q').length;
  const denom = total - q;
  if (denom <= 0) return 0;
  return countInfected(cells, w, h) / denom;
}

export function playTurn(
  state: GameState,
  dir: Direction,
  random: () => number = Math.random,
): GameState {
  if (state.status !== 'playing') return state;
  const { w, h, level } = state;
  let cells = applyPulse(state.cells, w, h, dir);
  if (countInfected(cells, w, h) === 0) {
    return { ...state, cells, status: 'win', loseReason: null };
  }
  cells = spread(cells, w, h, level.spreadPerTurn, random);
  const nextTurns = state.turns + 1;
  if (infectionRatio(cells, w, h) >= level.criticalInfectionRatio) {
    return {
      ...state,
      cells,
      turns: nextTurns,
      status: 'lose',
      loseReason: 'threshold',
    };
  }
  if (countInfected(cells, w, h) === 0) {
    return {
      ...state,
      cells,
      turns: nextTurns,
      status: 'win',
      loseReason: null,
    };
  }
  if (nextTurns >= level.maxRounds) {
    return {
      ...state,
      cells,
      turns: nextTurns,
      status: 'lose',
      loseReason: 'rounds',
    };
  }
  return { ...state, cells, turns: nextTurns };
}
