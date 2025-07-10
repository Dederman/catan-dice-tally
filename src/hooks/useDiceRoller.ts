
import { useState, useCallback } from 'react';

type RandomType = 'standard' | 'uniform' | 'visual';

interface RollStats {
  [key: number]: number;
  totalRolls: number;
}

export const useDiceRoller = () => {
  const [sessionActive, setSessionActive] = useState(false);
  const [rollStats, setRollStats] = useState<RollStats>({ totalRolls: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerCount, setPlayerCount] = useState(4);
  const [randomType, setRandomType] = useState<RandomType>('standard');

  const rollDice = useCallback(() => {
    let dice1: number, dice2: number, total: number;

    switch (randomType) {
      case 'uniform':
        total = Math.floor(Math.random() * 11) + 2; // 2-12
        dice1 = Math.floor(Math.random() * 6) + 1;
        dice2 = total - dice1;
        if (dice2 < 1 || dice2 > 6) {
          dice1 = Math.floor(Math.random() * 6) + 1;
          dice2 = Math.floor(Math.random() * 6) + 1;
          total = dice1 + dice2;
        }
        break;
      
      case 'visual':
        const visualWeights = [2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 11, 11, 12];
        total = visualWeights[Math.floor(Math.random() * visualWeights.length)];
        dice1 = Math.floor(Math.random() * 6) + 1;
        dice2 = total - dice1;
        if (dice2 < 1 || dice2 > 6) {
          dice1 = Math.floor(Math.random() * 6) + 1;
          dice2 = Math.floor(Math.random() * 6) + 1;
          total = dice1 + dice2;
        }
        break;
      
      default: // standard
        dice1 = Math.floor(Math.random() * 6) + 1;
        dice2 = Math.floor(Math.random() * 6) + 1;
        total = dice1 + dice2;
    }

    // Update stats
    setRollStats(prev => ({
      ...prev,
      [total]: (prev[total] || 0) + 1,
      totalRolls: prev.totalRolls + 1
    }));

    // Update current player
    setCurrentPlayer(prev => (prev % playerCount) + 1);

    return { dice1, dice2, total };
  }, [randomType, playerCount]);

  const startSession = useCallback(() => {
    setSessionActive(true);
    setRollStats({ totalRolls: 0 });
    setCurrentPlayer(1);
  }, []);

  const stopSession = useCallback(() => {
    setSessionActive(false);
  }, []);

  return {
    sessionActive,
    startSession,
    stopSession,
    rollStats,
    currentPlayer,
    playerCount,
    setPlayerCount,
    randomType,
    setRandomType,
    rollDice
  };
};
