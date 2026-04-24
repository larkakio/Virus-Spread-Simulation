import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState, playTurn } from './engine';
import { getLevel } from './levels';
import type { Cell } from './types';
import {
  getUnlockedMaxLevel,
  onLevelCleared,
} from './progress';

const rng = () => 0.55;

describe('progress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('unlocks next level after clear', () => {
    expect(getUnlockedMaxLevel()).toBe(1);
    onLevelCleared(1);
    expect(getUnlockedMaxLevel()).toBe(2);
    onLevelCleared(2);
    expect(getUnlockedMaxLevel()).toBe(3);
  });
});

describe('engine', () => {
  it('wins when infection sits on treated edge and pulse clears it', () => {
    const l = getLevel(1);
    const st = createInitialState(l);
    const cells: Cell[] = st.cells.slice();
    for (let i = 0; i < cells.length; i += 1) {
      cells[i] = 'H';
    }
    const w = l.width;
    cells[0 * w + 2] = 'I';
    const s0 = { ...st, cells },
      after = playTurn(s0, 'up', rng);
    expect(after.status).toBe('win');
  });
});
