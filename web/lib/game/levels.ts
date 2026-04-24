import type { LevelConfig } from './types';

export const LEVELS: readonly LevelConfig[] = [
  {
    id: 1,
    title: 'Outbreak',
    width: 5,
    height: 5,
    maxRounds: 30,
    spreadPerTurn: 1,
    criticalInfectionRatio: 0.9,
    initialInfected: [{ r: 2, c: 2 }],
    quarantine: [],
  },
  {
    id: 2,
    title: 'Double vector',
    width: 6,
    height: 6,
    maxRounds: 18,
    spreadPerTurn: 3,
    criticalInfectionRatio: 0.88,
    initialInfected: [
      { r: 1, c: 1 },
      { r: 4, c: 4 },
    ],
    quarantine: [],
  },
  {
    id: 3,
    title: 'Containment grid',
    width: 6,
    height: 6,
    maxRounds: 20,
    spreadPerTurn: 4,
    criticalInfectionRatio: 0.85,
    initialInfected: [
      { r: 0, c: 3 },
      { r: 3, c: 0 },
      { r: 5, c: 5 },
    ],
    quarantine: [
      { r: 2, c: 2 },
      { r: 2, c: 3 },
      { r: 3, c: 2 },
    ],
  },
] as const;

export function getLevel(id: number): LevelConfig {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}
