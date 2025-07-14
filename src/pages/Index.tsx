
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Pause, Volume2, VolumeX, History, Dice1, Info, RotateCw } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { DiceDisplay } from "@/components/DiceDisplay";
import { StatisticsChart } from "@/components/StatisticsChart";
import { SessionHistory } from "@/components/SessionHistory";
import { RandomTypeInfo } from "@/components/RandomTypeInfo";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { useDiceRoller } from "@/hooks/useDiceRoller";
import { useTimers } from "@/hooks/useTimers";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const Index = () => {
  const {
    sessionActive,
    startSession,
    stopSession,
    rollStats,
    currentPlayer,
    playerCount,
    setPlayerCount,
    randomType,
    setRandomType,
    rollDice
  } = useDiceRoller();

  const {
    sessionTime,
    rollIntervalTime,
    autoRollActive,
    setAutoRollActive,
    autoRollInterval,
    setAutoRollInterval,
    resetRollTimer
  } = useTimers(sessionActive);

  const { muted, setMuted, playRollSound } = useSoundEffects();
  const { saveSession, getSavedSessions } = useSessionStorage();

  const [lastRoll, setLastRoll] = useState<{ dice1: number; dice2: number; total: number } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showRandomInfo, setShowRandomInfo] = useState(false);

  // Auto-roll functionality
  useEffect(() => {
    if (!autoRollActive || !sessionActive) return;

    const interval = setInterval(() => {
      handleRoll();
    }, autoRollInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRollActive, sessionActive, autoRollInterval]);

  const handleRoll = useCallback(() => {
    if (!sessionActive) return;
    
    const result = rollDice();
    setLastRoll(result);
    resetRollTimer();
    
    if (!muted) {
      playRollSound(result.total);
    }
  }, [sessionActive, rollDice, resetRollTimer, muted, playRollSound]);

  const handleStartSession = () => {
    startSession();
    toast({
      title: "Session Started",
      description: "Good luck with your Catan game!",
    });
  };

  const handleStopSession = () => {
    if (sessionActive && rollStats.totalRolls > 0) {
      saveSession({
        sessionTime,
        rollStats,
        playerCount,
        randomType
      });
    }
    stopSession();
    setLastRoll(null);
    toast({
      title: "Session Ended",
      description: "Session data has been saved.",
    });
  };

  const handleRandomTypeChange = (value: string) => {
    setRandomType(value as 'standard' | 'uniform' | 'visual');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Zone 1 - Session Controls */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Button
                onClick={sessionActive ? handleStopSession : handleStartSession}
                className={sessionActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
              >
                {sessionActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {sessionActive ? "Stop Session" : "Start Session"}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMuted(!muted)}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                
                <Dialog open={showHistory} onOpenChange={setShowHistory}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <History className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Session History</DialogTitle>
                    </DialogHeader>
                    <SessionHistory sessions={getSavedSessions()} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {sessionActive && (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {formatTime(sessionTime)}
                </div>
                <div className="text-sm text-gray-500">Session Time</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Zone 2 - Live Statistics */}
        {sessionActive && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <StatisticsChart rollStats={rollStats} />
              
              <div className="space-y-3">
                <div className="text-center text-lg font-semibold">
                  Total Rolls: {rollStats.totalRolls}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Players:</span>
                  <Select value={playerCount.toString()} onValueChange={(value) => setPlayerCount(parseInt(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Random Type:</span>
                  <div className="flex items-center space-x-2">
                    <Select value={randomType} onValueChange={handleRandomTypeChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Dice</SelectItem>
                        <SelectItem value="uniform">Uniform</SelectItem>
                        <SelectItem value="visual">Visual Fair</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Dialog open={showRandomInfo} onOpenChange={setShowRandomInfo}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Info className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Random Type Information</DialogTitle>
                        </DialogHeader>
                        <RandomTypeInfo />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Zone 3 - Dice & Roll Controls */}
        {sessionActive && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-center">
                {lastRoll ? (
                  <DiceDisplay dice1={lastRoll.dice1} dice2={lastRoll.dice2} />
                ) : (
                  <div className="flex space-x-4">
                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Dice1 className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Dice1 className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <Button 
                  onClick={handleRoll} 
                  size="lg" 
                  className="bg-blue-500 hover:bg-blue-600 rounded-full w-16 h-16"
                >
                  <RotateCw className="w-6 h-6" />
                </Button>
                
                {lastRoll && (
                  <div className="space-y-1">
                    <div className="text-xl font-bold">You rolled: {lastRoll.total}</div>
                    <div className="text-sm text-gray-600">Current Player: Player {currentPlayer}</div>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500">
                  {autoRollActive ? `Next roll in: ${formatTime(Math.max(0, autoRollInterval - rollIntervalTime))}` : `Time since last roll: ${formatTime(rollIntervalTime)}`}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto-Roll:</span>
                  <Switch checked={autoRollActive} onCheckedChange={setAutoRollActive} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Interval (seconds):</span>
                  <Input
                    type="number"
                    min="1"
                    max="3600"
                    value={autoRollInterval}
                    onChange={(e) => setAutoRollInterval(Math.max(1, Math.min(3600, parseInt(e.target.value) || 120)))}
                    className="w-20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
