
import { useState, useCallback } from 'react';

export const useSoundEffects = () => {
  const [muted, setMuted] = useState(false);

  const playRollSound = useCallback((total: number) => {
    if (muted) return;

    // Use Web Speech API to announce the roll
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(total.toString());
      utterance.rate = 1.2;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  }, [muted]);

  return {
    muted,
    setMuted,
    playRollSound
  };
};
