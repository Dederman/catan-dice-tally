export type RandomType =
  | 'standard'
  | 'weighted'
  | 'crypto'
  | 'visual'
  | 'uniform'
  | 'without7';

export type SavedSession = {
  id: string;
  timestamp: number;
  duration: number;
  totalRolls: number;
  playerCount: number;
  randomType: RandomType;
  distribution: number[];
  sevensByPlayer: number[];
  undoCount: number;
  autoRollEnabled: boolean;
  autoRollIntervalSeconds: number;
  randomTypeChanged: boolean;
};
