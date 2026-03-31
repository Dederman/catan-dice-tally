// src/types.ts

export type RollStats = {
  totalRolls: number;
  sumsCount: Record<number, number>;
  sessionHistory: {
    roll: { dice1: number; dice2: number; total: number };
    player: number;
  }[];
  doublesCount: number;
  triplesCount: number; 
  // ДОБАВЛЕНИЕ: playerRolls
  playerRolls: {
    totalRolls: number;
    rolls: { dice1: number; dice2: number; total: number }[];
  }[];
};

// ОБНОВЛЕННЫЙ ТИП RandomType
export type RandomType = 'standard' | 'visual' | 'crypto' | 'uniform' | 'weightedRandom';

// Определение для SavedSession
export type SavedSession = {
  sessionTime: number;
  rollStats: RollStats;
  playerCount: number;
  randomType: RandomType; // Используем обновленный RandomType
};