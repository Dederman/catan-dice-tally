import { useState, useCallback } from 'react';

export const useSoundEffects = () => {
  const [muted, setMuted] = useState(false);

  const playRollSound = useCallback((total: number) => {
    if (muted) return;

    if ('speechSynthesis' in window) {
      const words = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
      // ИЗМЕНЕНИЕ: Используем слова вместо просто числа
      const utterance = new SpeechSynthesisUtterance(words[total - 2]); 
      utterance.rate = 1.2;
      utterance.volume = 0.7;
      
      // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Останавливаем предыдущую речь перед новой
      window.speechSynthesis.cancel(); 
      window.speechSynthesis.speak(utterance);
    }
  }, [muted]);

  return {
    muted,
    setMuted,
    playRollSound
  };
};
