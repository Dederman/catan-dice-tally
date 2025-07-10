import { useState, useEffect, useCallback } from 'react';

export const useTimers = (sessionActive: boolean) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [rollIntervalTime, setRollIntervalTime] = useState(0);
  const [autoRollActive, setAutoRollActive] = useState(false);
  // ИЗМЕНЕНИЕ: Default 120 СЕКУНД (было 2 минуты, теперь явно секунды)
  const [autoRollInterval, setAutoRollInterval] = useState(120); 

  // Session timer and roll interval timer
  useEffect(() => {
    if (!sessionActive) {
      setSessionTime(0); // Сбрасываем время сессии при её остановке
      setRollIntervalTime(0); // Сбрасываем интервал ролла при её остановке
      return;
    }

    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
      setRollIntervalTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive]);

  const resetRollTimer = useCallback(() => {
    setRollIntervalTime(0);
  }, []);

  return {
    sessionTime,
    rollIntervalTime,
    autoRollActive,
    setAutoRollActive,
    autoRollInterval,
    setAutoRollInterval,
    resetRollTimer
  };
};
