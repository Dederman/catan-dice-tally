import { useState, useCallback } from 'react';

interface SavedSession {
  sessionTime: number;
  rollStats: { [key: number]: number; totalRolls: number; };
  playerCount: number;
  randomType: string;
}

export const useSessionStorage = () => {
  // Ключ, по которому хранятся сессии в localStorage
  const STORAGE_KEY = 'catanDiceSessions';

  const getSavedSessions = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Если что-то не так с JSON, возвращаем пустой массив
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing saved sessions from localStorage:", error);
      // В случае ошибки парсинга, очищаем хранилище и возвращаем пустой массив
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }, []);

  const saveSession = useCallback((sessionData: SavedSession) => {
    let sessions = getSavedSessions();
    sessions.push(sessionData);

    // ОГРАНИЧЕНИЕ КОЛИЧЕСТВА СЕССИЙ: Храним только 100 последних сессий
    // Это предотвратит переполнение квоты в будущем.
    if (sessions.length > 100) {
      sessions = sessions.slice(sessions.length - 100);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      // Это сработает, если квота будет превышена прямо сейчас
      console.error("Error saving session to localStorage (quota exceeded?):", error);
      alert("Warning: Storage limit reached! Old sessions will be cleared to save new data.");
      // Если квота превышена, попытаемся очистить и сохранить снова
      clearAllSessions(); // Очищаем все, чтобы освободить место
      localStorage.setItem(STORAGE_KEY, JSON.stringify([sessionData])); // Сохраняем только текущую
    }
  }, [getSavedSessions]);

  // НОВАЯ ФУНКЦИЯ: Очистка всех сохраненных сессий
  const clearAllSessions = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Можно добавить тост или другое уведомление об успешной очистке
      // toast({ title: "Session History Cleared", description: "All saved sessions have been removed." });
    } catch (error) {
      console.error("Error clearing sessions from localStorage:", error);
    }
  }, []);

  return { saveSession, getSavedSessions, clearAllSessions };
};
