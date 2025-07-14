import { useState, useCallback } from 'react';

// Добавляем 'crypto' в список типов
type RandomType = 'standard' | 'uniform' | 'visual' | 'crypto';

interface RollStats {
  [key: number]: number; // Для сумм 2-12
  totalRolls: number;
}

export const useDiceRoller = () => {
  const [sessionActive, setSessionActive] = useState(false);
  // ИНИЦИАЛИЗАЦИЯ: rollStats с нулями для всех сумм
  const [rollStats, setRollStats] = useState<RollStats>(() => {
    const initialStats: RollStats = { totalRolls: 0 };
    for (let i = 2; i <= 12; i++) {
      initialStats[i] = 0;
    }
    return initialStats;
  });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerCount, setPlayerCount] = useState(4);
  const [randomType, setRandomType] = useState<RandomType>('standard');

  // ИЗМЕНЕНИЕ: rollDice теперь принимает аргумент shouldUpdateStats
  const rollDice = useCallback((shouldUpdateStats: boolean) => {
    let dice1: number, dice2: number, total: number;

    switch (randomType) {
      case 'uniform':
        // Улучшенная логика для равномерного распределения, чтобы dice1 и dice2 были корректными
        total = Math.floor(Math.random() * 11) + 2; // 2-12
        const possibleDice1ForTotal = [];
        for (let i = 1; i <= 6; i++) {
            if (total - i >= 1 && total - i <= 6) {
                possibleDice1ForTotal.push(i);
            }
        }
        dice1 = possibleDice1ForTotal[Math.floor(Math.random() * possibleDice1ForTotal.length)];
        dice2 = total - dice1;
        break;
          
      case 'visual':
        const visualWeights = [2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 11, 11, 12];
        total = visualWeights[Math.floor(Math.random() * visualWeights.length)];
        // Улучшенная логика для распределения total на dice1 и dice2
        const possibleVisualDice1ForTotal = [];
        for (let i = 1; i <= 6; i++) {
            if (total - i >= 1 && total - i <= 6) {
                possibleVisualDice1ForTotal.push(i);
            }
        }
        dice1 = possibleVisualDice1ForTotal[Math.floor(Math.random() * possibleVisualDice1ForTotal.length)];
        dice2 = total - dice1;
        break;
        
      case 'crypto': // НОВЫЙ РЕЖИМ: Crypto Random
        // Используем window.crypto.getRandomValues()
        const cryptoRandomBytes = new Uint8Array(2);
        window.crypto.getRandomValues(cryptoRandomBytes);
        dice1 = (cryptoRandomBytes[0] % 6) + 1; // Число от 1 до 6
        dice2 = (cryptoRandomBytes[1] % 6) + 1; // Число от 1 до 6
        total = dice1 + dice2;
        break;

      default: // 'standard' (Теперь Standard Dice использует Crypto RNG)
        // Используем window.crypto.getRandomValues() для Standard Dice
        const standardRandomBytes = new Uint8Array(2);
        window.crypto.getRandomValues(standardRandomBytes);
        dice1 = (standardRandomBytes[0] % 6) + 1;
        dice2 = (standardRandomBytes[1] % 6) + 1;
        total = dice1 + dice2;
        break;
    }

    // ИЗМЕНЕНИЕ: Обновляем статистику и игрока только если shouldUpdateStats равно true
    if (shouldUpdateStats) {
      setRollStats(prev => ({
        ...prev,
        [total]: (prev[total] || 0) + 1,
        totalRolls: prev.totalRolls + 1
      }));

      setCurrentPlayer(prev => (prev % playerCount) + 1);
    }

    return { dice1, dice2, total };
  }, [randomType, playerCount]);

  const startSession = useCallback(() => {
    setSessionActive(true);
    // СБРОС СТАТИСТИКИ при старте новой сессии
    const initialStats: RollStats = { totalRolls: 0 };
    for (let i = 2; i <= 12; i++) {
      initialStats[i] = 0;
    }
    setRollStats(initialStats);
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
