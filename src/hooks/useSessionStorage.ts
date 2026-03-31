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

export const useSessionStorage = () => { // Название хука остается useSessionStorage, но функционал будет useLocalStorage
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
      console.error("Failed to parse sessions from localStorage. Returning empty array.");
      return [];
    }
  }, []);

  // Новая функция для сохранения отдельных настроек в localStorage
  const saveSetting = useCallback(<T>(key: string, value: T) => {
    try {
      localStorage.setItem(`catan-dice-setting-${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save setting ${key} to localStorage:`, error);
    }
  }, []);

  // Новая функция для загрузки отдельных настроек из localStorage
  const loadSetting = useCallback(<T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(`catan-dice-setting-${key}`);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch (error) {
      console.error(`Failed to load setting ${key} from localStorage:`, error);
      return defaultValue;
    }
  }, []);

  return {
    saveSession,
    getSavedSessions,
    saveSetting,   // Добавляем новую функцию
    loadSetting    // Добавляем новую функцию
  };
};