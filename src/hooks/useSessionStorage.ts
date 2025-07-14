import { useCallback } from 'react';

interface SessionData {
  id: string;
  timestamp: number;
  duration: number;
  totalRolls: number;
  playerCount: number;
  randomType: string;
  rollStats: { [key: number]: number };
}

export const useSessionStorage = () => {
  const saveSession = useCallback((sessionData: {
    sessionTime: number;
    rollStats: { [key: number]: number; totalRolls: number };
    playerCount: number;
    randomType: string;
  }) => {
    const session: SessionData = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      duration: sessionData.sessionTime,
      totalRolls: sessionData.rollStats.totalRolls,
      playerCount: sessionData.playerCount,
      randomType: sessionData.randomType,
      rollStats: { ...sessionData.rollStats }
    };

    const existingSessions = getSavedSessions();
    const updatedSessions = [...existingSessions, session];
    
    // Keep only last 50 sessions
    if (updatedSessions.length > 50) {
      updatedSessions.splice(0, updatedSessions.length - 50);
    }
    
    localStorage.setItem('catan-dice-sessions', JSON.stringify(updatedSessions));
  }, []);

  const getSavedSessions = useCallback((): SessionData[] => {
    try {
      const stored = localStorage.getItem('catan-dice-sessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  return {
    saveSession,
    getSavedSessions
  };
};
