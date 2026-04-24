'use client';

import { useCallback, useEffect, useSyncExternalStore, useState } from 'react';
import { createInitialState, playTurn } from '@/lib/game/engine';
import type { Direction, GameState } from '@/lib/game/types';
import { getLevel, LEVELS } from '@/lib/game/levels';
import { getUnlockedMaxLevel, onLevelCleared } from '@/lib/game/progress';
import { VirusField } from './VirusField';

function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === 'undefined') return () => {};
      const m = window.matchMedia('(prefers-reduced-motion: reduce)');
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    () => true,
  );
}

function infectedRatio(s: GameState) {
  const w = s.w;
  const h = s.h;
  let i = 0;
  const total = w * h;
  let qu = 0;
  s.cells.forEach((c) => {
    if (c === 'I') i += 1;
    if (c === 'Q') qu += 1;
  });
  const d = total - qu;
  return d > 0 ? (i / d) * 100 : 0;
}

export function VirusGame() {
  const reduceMotion = useReducedMotion();
  const [unlocked, setUnlocked] = useState(getUnlockedMaxLevel);
  const [levelId, setLevelId] = useState(1);
  const [state, setState] = useState<GameState>(() =>
    createInitialState(getLevel(1)),
  );
  const [lastPulse, setLastPulse] = useState<Direction | null>(null);

  const reset = useCallback((id: number) => {
    setState(createInitialState(getLevel(id)));
    setLastPulse(null);
  }, []);

  useEffect(() => {
    reset(levelId);
  }, [levelId, reset]);

  const onSwipe = (d: Direction) => {
    if (state.status !== 'playing') return;
    setLastPulse(d);
    setState((prev) => {
      const next = playTurn(prev, d, Math.random);
      if (next.status === 'win' && prev.level.id === levelId) {
        onLevelCleared(levelId);
        setUnlocked(getUnlockedMaxLevel());
      }
      return next;
    });
  };

  const l = getLevel(levelId);
  return (
    <div className="flex w-full max-w-4xl flex-col gap-4">
      <div className="grid gap-2 sm:grid-cols-3">
        {LEVELS.map((lv) => {
          const open = lv.id <= unlocked;
          return (
            <button
              key={lv.id}
              type="button"
              disabled={!open}
              onClick={() => {
                if (open) {
                  setLevelId(lv.id);
                }
              }}
              className={[
                'border px-2 py-2 text-left text-xs transition',
                levelId === lv.id
                  ? 'border-cyan-400/70 bg-cyan-500/10 text-cyan-100'
                  : 'border-zinc-700/80 bg-zinc-900/40 text-zinc-400',
                !open
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:border-cyan-500/50',
              ].join(' ')}
            >
              <span className="block text-[0.65rem] uppercase tracking-widest text-cyan-500/80">
                Level {lv.id}
              </span>
              <span className="block font-bold text-cyan-100/90">
                {lv.title}
              </span>
            </button>
          );
        })}
      </div>
      <div className="cyber-glass border border-cyan-500/20 p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 text-xs sm:text-sm">
          <div>
            <p className="text-[0.65rem] uppercase tracking-widest text-cyan-500/80">
              Level {l.id} — {l.title}
            </p>
            <p className="mt-1 font-mono text-cyan-200/90">
              Turn {state.turns} / {l.maxRounds}
            </p>
          </div>
          <p className="font-mono text-magenta-200/90">
            Infected {infectedRatio(state).toFixed(0)}% / crit cap{' '}
            {(l.criticalInfectionRatio * 100).toFixed(0)}%
          </p>
        </div>

        <VirusField
          w={state.w}
          h={state.h}
          cells={state.cells}
          onSwipe={onSwipe}
          lastPulse={lastPulse}
          reduceMotion={reduceMotion}
        />

        <p className="mt-3 text-center text-[0.7rem] uppercase tracking-[0.25em] text-zinc-500">
          Swipe on the field — treatment pulse from that edge
        </p>

        {state.status === 'win' && (
          <div className="mt-3 rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100/90">
            <p className="font-bold">Sector clear</p>
            {l.id < 3 && (
              <button
                type="button"
                onClick={() => {
                  setLevelId(l.id + 1);
                }}
                className="cyber-button mt-2 w-full py-1 text-sm"
              >
                Next level
              </button>
            )}
            {l.id >= 3 && (
              <p className="mt-1 text-xs text-zinc-400">All levels cleared.</p>
            )}
            <button
              type="button"
              onClick={() => reset(levelId)}
              className="mt-2 w-full border border-zinc-600 py-1 text-xs text-zinc-300"
            >
              Replay
            </button>
          </div>
        )}

        {state.status === 'lose' && (
          <div className="mt-3 rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100/90">
            <p className="font-bold">
              {state.loseReason === 'threshold'
                ? 'Critical infection threshold'
                : 'Time limit — rounds exhausted'}
            </p>
            <button
              type="button"
              onClick={() => reset(levelId)}
              className="cyber-button mt-2 w-full py-1 text-sm"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
