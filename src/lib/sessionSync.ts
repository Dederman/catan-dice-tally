import type { SavedSession } from '@/types';

const ANONYMOUS_USER_ID_KEY = 'catan-dice-anonymous-user-id';
const PENDING_SESSIONS_KEY = 'catan-dice-pending-session-uploads';

const generateAnonymousUserId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `anon-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const readPendingSessions = (): SavedSession[] => {
  try {
    const stored = localStorage.getItem(PENDING_SESSIONS_KEY);
    return stored ? (JSON.parse(stored) as SavedSession[]) : [];
  } catch {
    return [];
  }
};

const writePendingSessions = (sessions: SavedSession[]) => {
  localStorage.setItem(PENDING_SESSIONS_KEY, JSON.stringify(sessions));
};

export const getAnonymousUserId = () => {
  try {
    const stored = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
    if (stored) {
      return stored;
    }

    const nextId = generateAnonymousUserId();
    localStorage.setItem(ANONYMOUS_USER_ID_KEY, nextId);
    return nextId;
  } catch {
    return generateAnonymousUserId();
  }
};

export const enqueuePendingSession = (session: SavedSession) => {
  const pending = readPendingSessions();

  if (pending.some((item) => item.id === session.id)) {
    return;
  }

  writePendingSessions([...pending, session]);
};

export const flushPendingSessions = async () => {
  const pending = readPendingSessions();

  if (pending.length === 0) {
    return;
  }

  const stillPending: SavedSession[] = [];

  for (const session of pending) {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        stillPending.push(session);
      }
    } catch {
      stillPending.push(session);
    }
  }

  writePendingSessions(stillPending);
};
