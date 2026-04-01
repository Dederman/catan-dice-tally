import { useState, useCallback, useRef, useEffect } from 'react';

const SOUND_PRELOAD_QUEUE = [
  '/sounds/roll.mp3',
  '/sounds/7.mp3',
  '/sounds/6.mp3',
  '/sounds/8.mp3',
  '/sounds/9.mp3',
  '/sounds/5.mp3',
  '/sounds/10.mp3',
  '/sounds/4.mp3',
  '/sounds/11.mp3',
  '/sounds/3.mp3',
  '/sounds/12.mp3',
  '/sounds/2.mp3',
  '/sounds/countdown.mp3',
] as const;

export const useSoundEffects = () => {
  const [muted, setMuted] = useState(false);
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const rollAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopCountdown = useCallback(() => {
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
      countdownAudioRef.current = null;
    }
  }, []);

  const stopRoll = useCallback(() => {
    if (rollAudioRef.current) {
      rollAudioRef.current.pause();
      rollAudioRef.current.currentTime = 0;
    }
  }, []);

  const stopVoice = useCallback(() => {
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }

    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
      voiceAudioRef.current = null;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    stopCountdown();
    stopRoll();
    stopVoice();
  }, [stopCountdown, stopRoll, stopVoice]);

  useEffect(() => {
    if (muted) {
      stopAllSounds();
    }
  }, [muted, stopAllSounds]);

  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, [stopAllSounds]);

  const ensureRollAudio = useCallback(() => {
    if (!rollAudioRef.current) {
      rollAudioRef.current = new Audio('/sounds/roll.mp3');
      rollAudioRef.current.preload = 'auto';
      rollAudioRef.current.volume = 1.0;
      rollAudioRef.current.load();
    }

    return rollAudioRef.current;
  }, []);

  useEffect(() => {
    ensureRollAudio();

    const countdownAudio = new Audio('/sounds/countdown.mp3');
    countdownAudio.preload = 'auto';
    countdownAudio.load();

    return () => {
      countdownAudio.pause();
    };
  }, [ensureRollAudio]);

  useEffect(() => {
    let cancelled = false;

    const preloadSequentially = async () => {
      for (const src of SOUND_PRELOAD_QUEUE) {
        if (cancelled) {
          return;
        }

        await new Promise<void>((resolve) => {
          const audio = new Audio(src);
          audio.preload = 'auto';

          const finish = () => {
            audio.removeEventListener('canplaythrough', finish);
            audio.removeEventListener('error', finish);
            resolve();
          };

          audio.addEventListener('canplaythrough', finish, { once: true });
          audio.addEventListener('error', finish, { once: true });
          audio.load();
        });
      }
    };

    void preloadSequentially();

    return () => {
      cancelled = true;
    };
  }, []);

  const playRollSound = useCallback((result: number) => {
    if (muted) return;

    // A new roll should restart the full audio sequence from the top.
    stopCountdown();
    stopRoll();
    stopVoice();

    const rollAudio = ensureRollAudio();

    rollAudio.currentTime = 0;
    rollAudio.play().catch(() => {});

    voiceTimeoutRef.current = setTimeout(() => {
      voiceTimeoutRef.current = null;

      if (muted) return;

      const voiceSound = new Audio(`/sounds/${result}.mp3`);
      voiceSound.preload = 'auto';
      voiceAudioRef.current = voiceSound;
      voiceSound.play().catch(() => {});
    }, 800);
  }, [ensureRollAudio, muted, stopCountdown, stopRoll, stopVoice]);

  const playCountdownSound = useCallback(() => {
    if (muted) return;

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
    stopCountdown,
  };
};
