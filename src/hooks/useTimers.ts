
import { useState, useEffect, useCallback } from 'react';

export const useTimers = (sessionActive: boolean) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [rollIntervalTime, setRollIntervalTime] = useState(0);
  const [autoRollActive, setAutoRollActive] = useState(false);
  const [autoRollInterval, setAutoRollInterval] = useState(2); // minutes

  // Session timer
  useEffect(() => {
    if (!sessionActive) {
      setSessionTime(0);
      setRollIntervalTime(0);
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
