import { useCallback, useRef, useState } from 'react';
import type { RandomType } from '@/types';

type RollResult = {
  dice1: number;
  dice2: number;
  total: number;
};

type HistoryRoll = RollResult & {
  player: number;
};

type RollStats = {
  totalRolls: number;
  distribution: number[];
  sevensByPlayer: number[];
};

const DICE_PAIRS: ReadonlyArray<readonly [number, number]> = Array.from(
  { length: 6 },
  (_, first) =>
    Array.from({ length: 6 }, (_, second) => [first + 1, second + 1] as const),
).flat();

const WEIGHTED_TOTALS: ReadonlyArray<readonly [number, number]> = [
  [2, 1],
  [3, 2],
  [4, 3],
  [5, 4],
  [6, 5],
  [7, 6],
  [8, 5],
  [9, 4],
  [10, 3],
  [11, 2],
  [12, 1],
] as const;

const WITHOUT_SEVEN_TOTALS: ReadonlyArray<readonly [number, number]> = WEIGHTED_TOTALS.filter(
  ([total]) => total !== 7,
);

const createEmptyStats = (): RollStats => ({
  totalRolls: 0,
  distribution: Array(11).fill(0),
  sevensByPlayer: [],
});

const toRollResult = (dice1: number, dice2: number): RollResult => ({
  dice1,
  dice2,
  total: dice1 + dice2,
});

const getPairsForTotal = (total: number): RollResult[] =>
  DICE_PAIRS
    .filter(([dice1, dice2]) => dice1 + dice2 === total)
    .map(([dice1, dice2]) => toRollResult(dice1, dice2));

const shufflePairs = (pairs: ReadonlyArray<readonly [number, number]>, random: () => number) => {
  const next = pairs.map(([dice1, dice2]) => [dice1, dice2] as [number, number]);

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
};

const createCryptoRandom = () => {
  const buffer = new Uint32Array(1);

  return () => {
    window.crypto.getRandomValues(buffer);
    return buffer[0] / 0x100000000;
  };
};

const getRandomDie = (random: () => number) => Math.floor(random() * 6) + 1;

const getRandomItem = <T,>(items: readonly T[], random: () => number): T =>
  items[Math.floor(random() * items.length)];

const rollFromTotalWeights = (
  weights: ReadonlyArray<readonly [number, number]>,
  random: () => number,
): RollResult => {
  const totalWeight = weights.reduce((sum, [, weight]) => sum + weight, 0);
  let threshold = Math.floor(random() * totalWeight);

  for (const [total, weight] of weights) {
    if (threshold < weight) {
      return getRandomItem(getPairsForTotal(total), random);
    }

    threshold -= weight;
  }

  return getRandomItem(getPairsForTotal(7), random);
};

const rollByType = (
  randomType: RandomType,
  visualPoolRef: React.MutableRefObject<[number, number][]>,
): RollResult => {
  switch (randomType) {
    case 'crypto': {
      const random = createCryptoRandom();
      return toRollResult(getRandomDie(random), getRandomDie(random));
    }
    case 'uniform': {
      const total = Math.floor(Math.random() * 11) + 2;
      return getRandomItem(getPairsForTotal(total), Math.random);
    }
    case 'weighted': {
      return rollFromTotalWeights(WEIGHTED_TOTALS, Math.random);
    }
    case 'without7': {
      return rollFromTotalWeights(WITHOUT_SEVEN_TOTALS, Math.random);
    }
    case 'visual': {
      if (visualPoolRef.current.length === 0) {
        visualPoolRef.current = shufflePairs(DICE_PAIRS, Math.random);
      }

      const nextPair = visualPoolRef.current.pop() ?? [1, 1];
      return toRollResult(nextPair[0], nextPair[1]);
    }
    case 'standard':
    default:
      return toRollResult(getRandomDie(Math.random), getRandomDie(Math.random));
  }
};

export const useDiceRoller = (
  resetRollTimer: () => void,
  playerCount: number,
  randomType: RandomType,
) => {
  const [history, setHistory] = useState<HistoryRoll[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [rollStats, setRollStats] = useState<RollStats>(createEmptyStats);
  const [undoCount, setUndoCount] = useState(0);
  const visualPoolRef = useRef<[number, number][]>([]);

  const updateStats = useCallback((currentHistory: HistoryRoll[]) => {
    const distribution = Array(11).fill(0);
    const sevensByPlayer = Array(playerCount).fill(0);

    currentHistory.forEach((roll) => {
      distribution[roll.total - 2] += 1;

      if (roll.total === 7 && roll.player >= 1 && roll.player <= playerCount) {
        sevensByPlayer[roll.player - 1] += 1;
      }
    });

    setRollStats({
      totalRolls: currentHistory.length,
      distribution,
      sevensByPlayer,
    });
  }, [playerCount]);

  const generateRoll = useCallback(() => {
    return rollByType(randomType, visualPoolRef);
  }, [randomType]);

  const rollDiceFree = useCallback(() => {
    return generateRoll();
  }, [generateRoll]);

  const rollDiceForSession = useCallback(() => {
    const result = generateRoll();
    const newRoll: HistoryRoll = { ...result, player: currentPlayer };
    const newHistory = [...history.slice(0, currentIndex + 1), newRoll];

    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    updateStats(newHistory);
    setCurrentPlayer((prev) => (prev % playerCount) + 1);

    return result;
  }, [currentIndex, currentPlayer, generateRoll, history, playerCount, updateStats]);

  const undo = useCallback(() => {
    if (currentIndex < 0) {
      return null;
    }

    const rollToUndo = history[currentIndex];
    const newIndex = currentIndex - 1;

    setCurrentPlayer(rollToUndo.player);
    setCurrentIndex(newIndex);
    updateStats(history.slice(0, newIndex + 1));
    setUndoCount((prev) => prev + 1);
    resetRollTimer();

    return newIndex >= 0 ? history[newIndex] : null;
  }, [currentIndex, history, resetRollTimer, updateStats]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) {
      return null;
    }

    const nextIndex = currentIndex + 1;
    const nextRoll = history[nextIndex];

    setCurrentIndex(nextIndex);
    updateStats(history.slice(0, nextIndex + 1));
    setCurrentPlayer((nextRoll.player % playerCount) + 1);
    resetRollTimer();

    return nextRoll;
  }, [currentIndex, history, playerCount, resetRollTimer, updateStats]);

  const startSession = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    setCurrentPlayer(1);
    setRollStats(createEmptyStats());
    setUndoCount(0);
    visualPoolRef.current = [];
    resetRollTimer();
  }, [resetRollTimer]);

  return {
    rollStats,
    currentPlayer,
    rollDiceForSession,
    rollDiceFree,
    startSession,
    undo,
    redo,
    undoCount,
    canUndo: currentIndex >= 0,
    canRedo: currentIndex < history.length - 1,
  };
};
