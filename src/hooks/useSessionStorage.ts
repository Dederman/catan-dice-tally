import { useCallback } from 'react';
import type { RandomType, SavedSession } from '@/types';

type SessionPayload = {
  sessionTime: number;
  rollStats: {
    totalRolls: number;
    distribution: number[];
    sevensByPlayer: number[];
  };
  playerCount: number;
  randomType: RandomType;
};

export const useSessionStorage = () => {
  const getSavedSessions = useCallback((): SavedSession[] => {
    try {
      const stored = localStorage.getItem('catan-dice-sessions');
      return stored ? (JSON.parse(stored) as SavedSession[]) : [];
    } catch {
      console.error('Failed to parse sessions from localStorage. Returning empty array.');
      return [];
    }
  }, []);

  const saveSession = useCallback(
    (sessionData: SessionPayload) => {
      const session: SavedSession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        duration: sessionData.sessionTime,
        totalRolls: sessionData.rollStats.totalRolls,
        playerCount: sessionData.playerCount,
        randomType: sessionData.randomType,
        distribution: [...sessionData.rollStats.distribution],
        sevensByPlayer: [...sessionData.rollStats.sevensByPlayer],
      };

      const existingSessions = getSavedSessions();
      const updatedSessions = [...existingSessions, session];

      if (updatedSessions.length > 50) {
        updatedSessions.splice(0, updatedSessions.length - 50);
      }

      localStorage.setItem('catan-dice-sessions', JSON.stringify(updatedSessions));
    },
    [getSavedSessions],
  );

  const saveSetting = useCallback(<T,>(key: string, value: T) => {
    try {
      localStorage.setItem(`catan-dice-setting-${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save setting ${key} to localStorage:`, error);
    }
  }, []);

  const loadSetting = useCallback(<T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(`catan-dice-setting-${key}`);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch (error) {
      console.error(`Failed to load setting ${key} from localStorage:`, error);
      return defaultValue;
    }
  }, []);

  const clearSavedSessions = useCallback(() => {
    localStorage.removeItem('catan-dice-sessions');
  }, []);

  return {
    saveSession,
    getSavedSessions,
    clearSavedSessions,
    saveSetting,
    loadSetting,
  };
};
