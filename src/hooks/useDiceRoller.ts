import { useState, useCallback } from 'react';

export const useDiceRoller = (
  resetRollTimer: () => void,
  sessionActive: boolean,
  playerCount: number,
  randomType: string,
  setPlayerCount: (count: number) => void
) => {
  const [history, setHistory] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [rollStats, setRollStats] = useState({
    totalRolls: 0,
    distribution: Array(11).fill(0),
  });

  const updateStats = (currentHistory: any[]) => {
    const distribution = Array(11).fill(0);
    currentHistory.forEach(roll => {
      distribution[roll.total - 2]++;
    });
    setRollStats({
      totalRolls: currentHistory.length,
      distribution
    });
  };

  const rollDiceFree = useCallback(() => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    return { dice1: d1, dice2: d2, total: d1 + d2 };
  }, []);

  const rollDiceForSession = useCallback(() => {
    const result = rollDiceFree();
    const newRoll = { ...result, player: currentPlayer };
    const newHistory = [...history.slice(0, currentIndex + 1), newRoll];
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    updateStats(newHistory);
    setCurrentPlayer((prev) => (prev % playerCount) + 1);
    
    return result;
  }, [history, currentIndex, currentPlayer, playerCount, rollDiceFree]);

  const undo = useCallback(() => {
    if (currentIndex >= 0) {
      const rollToUndo = history[currentIndex];
      setCurrentPlayer(rollToUndo.player);
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      updateStats(history.slice(0, newIndex + 1));
      resetRollTimer();
      return newIndex >= 0 ? history[newIndex] : null;
    }
    return null;
  }, [currentIndex, history, resetRollTimer]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextRoll = history[nextIndex];
      setCurrentIndex(nextIndex);
      updateStats(history.slice(0, nextIndex + 1));
      setCurrentPlayer((nextRoll.player % playerCount) + 1);
      resetRollTimer();
      return nextRoll;
    }
    return null;
  }, [currentIndex, history, playerCount, resetRollTimer]);

  const startSession = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    setCurrentPlayer(1);
    setRollStats({ totalRolls: 0, distribution: Array(11).fill(0) });
    resetRollTimer();
  }, [resetRollTimer]);

  return {
    rollStats, currentPlayer, setCurrentPlayer,
    rollDiceForSession, rollDiceFree, startSession,
    undo, redo, canUndo: currentIndex >= 0, canRedo: currentIndex < history.length - 1
  };
};