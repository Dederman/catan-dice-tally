import { useState, useCallback, useRef, useEffect } from 'react';

export const useSoundEffects = () => {
  const [muted, setMuted] = useState(false);
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopCountdown = useCallback(() => {
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
      // Важно: обнуляем реф, чтобы старый звук не «висел»
      countdownAudioRef.current = null;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    stopCountdown();
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
      voiceAudioRef.current = null;
    }
  }, [stopCountdown]);

  // Мгновенная реакция на кнопку Mute
  useEffect(() => {
    if (muted) {
      stopAllSounds();
    }
  }, [muted, stopAllSounds]);

  const playRollSound = useCallback((result: number) => {
    if (muted) return;

    // Когда бросаем кости, звук отсчета ДОЛЖЕН заткнуться сразу
    stopCountdown();

    const rollSound = new Audio('/sounds/roll.mp3');
    rollSound.volume = 1.0;
    rollSound.play().catch(() => {});

    setTimeout(() => {
      if (muted) return;
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
      }
      const voiceSound = new Audio(`/sounds/${result}.mp3`);
      voiceAudioRef.current = voiceSound;
      voiceSound.play().catch(() => {});
    }, 800); 
  }, [muted, stopCountdown]);

  const playCountdownSound = useCallback(() => {
    if (muted) return;
    
    // Проверка: если уже играет — не дублируем
    if (countdownAudioRef.current && !countdownAudioRef.current.paused) return;
    
    const audio = new Audio('/sounds/countdown.mp3');
    audio.loop = true; 
    audio.volume = 0.2; 
    countdownAudioRef.current = audio;
    audio.play().catch(() => {});
  }, [muted]);

  return { 
    muted, 
    setMuted, 
    playRollSound, 
    playCountdownSound, 
    stopAllSounds, 
    stopCountdown 
  };
};