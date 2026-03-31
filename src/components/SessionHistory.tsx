
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { History } from 'lucide-react';
import type { SavedSession } from '@/types';

interface SessionHistoryProps {
  sessions: SavedSession[];
}

const formatRandomType = (randomType: SavedSession['randomType']) => {
  switch (randomType) {
    case 'standard':
      return 'Standard';
    case 'weighted':
      return 'Weighted';
    case 'crypto':
      return 'Crypto';
    case 'visual':
      return 'Visual Fair';
    case 'uniform':
      return 'Uniform';
    case 'without7':
      return 'Without 7';
    default:
      return randomType;
  }
};

export const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (sessions.length === 0) {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200">
          <History className="h-6 w-6 text-slate-400" />
        </div>
        <div className="text-base font-semibold text-slate-700">No sessions yet</div>
        <div className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
          Finish a session and it will appear here with duration, rolls, players, and distribution stats.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {sessions.slice().reverse().map(session => (
        <Card key={session.id}>
          <CardContent className="p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{formatDate(session.timestamp)}</span>
              <span className="text-xs text-gray-500">{formatRandomType(session.randomType)}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-gray-500">Duration</div>
                <div className="font-medium">{formatTime(session.duration)}</div>
              </div>
              <div>
                <div className="text-gray-500">Rolls</div>
                <div className="font-medium">{session.totalRolls}</div>
              </div>
              <div>
                <div className="text-gray-500">Players</div>
                <div className="font-medium">{session.playerCount}</div>
              </div>
            </div>
            
            <div className="flex justify-between text-xs">
              {session.distribution.map((count, index) => (
                <div key={index + 2} className="text-center">
                  <div className="text-gray-500">{index + 2}</div>
                  <div className="font-medium">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
