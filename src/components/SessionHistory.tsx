
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface SessionData {
  id: string;
  timestamp: number;
  duration: number;
  totalRolls: number;
  playerCount: number;
  randomType: string;
  rollStats: { [key: number]: number };
}

interface SessionHistoryProps {
  sessions: SessionData[];
}

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
      <div className="text-center text-gray-500 py-8">
        No sessions recorded yet.
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
              <span className="text-xs text-gray-500 capitalize">{session.randomType}</span>
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
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                <div key={num} className="text-center">
                  <div className="text-gray-500">{num}</div>
                  <div className="font-medium">{session.rollStats[num] || 0}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
