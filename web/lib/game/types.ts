export type Cell = 'H' | 'I' | 'Q';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'playing' | 'win' | 'lose';

export interface LevelConfig {
  id: number;
  title: string;
  width: number;
  height: number;
  maxRounds: number;
  /** new infections per spread phase */
  spreadPerTurn: number;
  /** 0.92 = 92% of cells infected = lose */
  criticalInfectionRatio: number;
  /** (r,c) starting infected */
  initialInfected: { r: number; c: number }[];
  /** (r,c) quarantine (never infected; pulse skips clearing Q as “immune wall”) */
  quarantine: { r: number; c: number }[];
}

export interface GameState {
  w: number;
  h: number;
  /** row-major, index = r * w + c */
  cells: Cell[];
  turns: number;
  level: LevelConfig;
  status: GameStatus;
  loseReason: 'rounds' | 'threshold' | null;
}
