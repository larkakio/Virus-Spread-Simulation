'use client';

import { useCallback, useRef } from 'react';
import type { Cell, Direction } from '@/lib/game/types';

type Props = {
  w: number;
  h: number;
  cells: Cell[];
  onSwipe: (d: Direction) => void;
  lastPulse: Direction | null;
  reduceMotion: boolean;
};

const MIN = 32;

function detectDirection(
  dx: number,
  dy: number,
): Direction | null {
  const m = Math.hypot(dx, dy);
  if (m < MIN) return null;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
}

export function VirusField({
  w,
  h,
  cells,
  onSwipe,
  lastPulse,
  reduceMotion,
}: Props) {
  const sx = useRef(0);
  const sy = useRef(0);
  const active = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    sx.current = e.touches[0].clientX;
    sy.current = e.touches[0].clientY;
    active.current = true;
  }, []);

  const endSwipe = useCallback(
    (clientX: number, clientY: number) => {
      if (!active.current) return;
      active.current = false;
      const dx = clientX - sx.current;
      const dy = clientY - sy.current;
      const d = detectDirection(dx, dy);
      if (d) onSwipe(d);
    },
    [onSwipe],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t) return;
      endSwipe(t.clientX, t.clientY);
    },
    [endSwipe],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      sx.current = e.clientX;
      sy.current = e.clientY;
      active.current = true;
    },
    [],
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!active.current) return;
      endSwipe(e.clientX, e.clientY);
    },
    [endSwipe],
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      if (active.current) {
        endSwipe(e.clientX, e.clientY);
      }
    },
    [endSwipe],
  );

  const bar =
    !reduceMotion && lastPulse
      ? lastPulse === 'up'
        ? 'absolute left-0 right-0 top-0 h-1.5 origin-top animate-pulseLine bg-gradient-to-b from-cyan-300/90 to-transparent'
        : lastPulse === 'down'
          ? 'absolute bottom-0 left-0 right-0 h-1.5 origin-bottom animate-pulseLine bg-gradient-to-t from-cyan-300/90 to-transparent'
          : lastPulse === 'left'
            ? 'absolute bottom-0 left-0 top-0 w-1.5 animate-pulseLine bg-gradient-to-r from-cyan-300/90 to-transparent'
            : 'absolute bottom-0 right-0 top-0 w-1.5 animate-pulseLine bg-gradient-to-l from-cyan-300/90 to-transparent'
      : null;

  return (
    <div
      className="relative w-full max-w-[min(96vw,420px)] select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{ touchAction: 'none' }}
    >
      <div
        className="relative aspect-square w-full"
      >
        {bar && <div className={bar} aria-hidden />}
        <div
          className="grid h-full w-full gap-0.5 sm:gap-1"
          style={{
            gridTemplateRows: `repeat(${h}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${w}, minmax(0, 1fr))`,
          }}
          role="img"
          aria-label="Infection field. Swipe in a direction to send a treatment pulse from that side."
        >
          {cells.map((cell, i) => {
            return (
              <div
                key={i}
                className={[
                  'cell-neon',
                  cell === 'I'
                    ? 'cell-infected'
                    : cell === 'Q'
                      ? 'cell-quarantine'
                      : 'cell-healthy',
                  !reduceMotion && cell === 'I' ? 'animate-cellPulse' : '',
                ].join(' ')}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
