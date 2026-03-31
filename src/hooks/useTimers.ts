// src/hooks/useTimers.ts
import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimers = (
  sessionActive: boolean,
  autoRollInterval: number, // Интервал авто-прокрутки (в секундах)
  autoRollActive: boolean // Флаг активности авто-прокрутки
) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [rollIntervalTime, setRollIntervalTime] = useState(0); 
  const [countdownValue, setCountdownValue] = useState(autoRollInterval); 
  const [isCountingDownForDisplay, setIsCountingDownForDisplay] = useState(false); 

  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rollIntervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeSinceLastRollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // console.log("useTimers (render): Initializing/Re-rendering with props:", { sessionActive, autoRollInterval, autoRollActive });
  // console.log("useTimers (render): Current internal states:", { sessionTime, rollIntervalTime, countdownValue, isCountingDownForDisplay });


  const resetRollTimer = useCallback(() => {
    setRollIntervalTime(0); 
    setCountdownValue(autoRollInterval); 
    // isCountingDownForDisplay должен быть true ТОЛЬКО если autoRollActive УЖЕ true
    // Мы не должны здесь изменять isCountingDownForDisplay в зависимости от того, что передается в autoRollActive
    // isCountingDownForDisplay должен управляться только useEffect ниже
    // Поэтому убираем setIsCountingDownForDisplay отсюда.
    // console.log("useTimers: resetRollTimer called.");
    // console.log(`useTimers: resetRollTimer -> rollIntervalTime reset to 0, countdownValue reset to ${autoRollInterval}, isCountingDownForDisplay set to ${autoRollActive}`);
  }, [autoRollInterval]); // autoRollActive УДАЛЕНО из зависимостей

  // Эффект для таймера общей продолжительности сессии
  useEffect(() => {
    // console.log("useTimers: useEffect [sessionActive] triggered. sessionActive:", sessionActive);
    if (sessionActive) {
      sessionTimerRef.current = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
      // console.log("useTimers: Session timer STARTED.");
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
        // console.log("useTimers: Session timer CLEARED.");
      }
      setSessionTime(0); 
    }
    return () => { 
      // console.log("useTimers: Session timer CLEANUP function called.");
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
    };
  }, [sessionActive]);

  // Эффект для таймера интервала авто-прокрутки ИЛИ времени с последнего броска
  useEffect(() => {
    // console.log("useTimers: useEffect [sessionActive, autoRollActive, autoRollInterval] triggered.");
    // console.log("useTimers: Current state inside effect:", { sessionActive, autoRollActive, autoRollInterval });

    // Всегда очищаем оба предыдущих интервала перед потенциальной установкой нового
    if (rollIntervalTimerRef.current) {
      clearInterval(rollIntervalTimerRef.current);
      rollIntervalTimerRef.current = null;
      // console.log("useTimers: Cleared previous rollIntervalTimerRef.");
    }
    if (timeSinceLastRollTimerRef.current) {
      clearInterval(timeSinceLastRollTimerRef.current);
      timeSinceLastRollTimerRef.current = null;
      // console.log("useTimers: Cleared previous timeSinceLastRollTimerRef.");
    }

    if (sessionActive) {
      if (autoRollActive) {
        // Логика для активной авто-прокрутки (отсчет до следующего броска)
        setIsCountingDownForDisplay(true); // Таймер должен быть красным
        // console.log("useTimers: autoRollActive is TRUE. Setting isCountingDownForDisplay to TRUE.");

        rollIntervalTimerRef.current = setInterval(() => {
          setRollIntervalTime((prev) => {
            const newTime = prev + 1;
            const newCountdown = autoRollInterval - newTime;
            setCountdownValue(newCountdown);
            // console.log(`useTimers (auto-roll tick): newTime=${newTime}, newCountdown=${newCountdown}, isCountingDownForDisplay=${true}`);
            return newTime;
          });
        }, 1000);
        // console.log("useTimers: Auto-roll interval timer STARTED.");
      } else {
        // Логика для НЕАКТИВНОЙ авто-прокрутки (отсчет времени с последнего броска)
        setRollIntervalTime(0); // Начинаем отсчет "времени с последнего броска" с 0 при переключении
        setCountdownValue(autoRollInterval); // Убеждаемся, что countdownValue соответствует интервалу
        setIsCountingDownForDisplay(false); // Таймер должен быть обычным
        // console.log("useTimers: autoRollActive is FALSE. Setting isCountingDownForDisplay to FALSE.");

        timeSinceLastRollTimerRef.current = setInterval(() => {
          setRollIntervalTime((prev) => prev + 1); 
          // console.log(`useTimers (time-since-last-roll tick): rollIntervalTime=${rollIntervalTime}`);
        }, 1000);
        // console.log("useTimers: Time since last roll timer STARTED.");
      }
    } else {
      // Сессия неактивна - сбрасываем все связанные с бросками таймеры
      setRollIntervalTime(0);
      setCountdownValue(autoRollInterval);
      setIsCountingDownForDisplay(false); // Таймер должен быть обычным
      // console.log("useTimers: Session NOT ACTIVE. Setting isCountingDownForDisplay to FALSE and resetting roll related times.");
    }

    return () => { 
      // console.log("useTimers: Roll interval/time since last roll timers CLEANUP function called.");
      if (rollIntervalTimerRef.current) {
        clearInterval(rollIntervalTimerRef.current);
        rollIntervalTimerRef.current = null;
      }
      if (timeSinceLastRollTimerRef.current) {
        clearInterval(timeSinceLastRollTimerRef.current);
        timeSinceLastRollTimerRef.current = null;
      }
    };
  }, [sessionActive, autoRollActive, autoRollInterval]); 

  // Эффект для сброса таймера при изменении autoRollInterval
  // Этот эффект отвечает за немедленный сброс таймера при смене интервала в инпуте.
  useEffect(() => {
    // console.log("useTimers: useEffect [autoRollInterval, sessionActive, autoRollActive, resetRollTimer] triggered.");
    if (sessionActive) { 
        // console.log("useTimers: Session active. Calling resetRollTimer.");
        resetRollTimer(); 
    } else {
        // console.log("useTimers: Session NOT active. Updating display only.");
        setRollIntervalTime(0); 
        setCountdownValue(autoRollInterval);
        setIsCountingDownForDisplay(false); 
    }
  }, [autoRollInterval, sessionActive, autoRollActive, resetRollTimer]); // autoRollActive обратно добавлено в зависимости, так как оно влияет на resetRollTimer через эффекты


  return {
    sessionTime,
    rollIntervalTime,
    countdownValue,
    isCountingDownForDisplay,
    resetRollTimer,
  };
};