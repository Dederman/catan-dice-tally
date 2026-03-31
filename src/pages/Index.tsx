import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Volume2, VolumeX, History, Info, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

import { DiceDisplay } from "@/components/DiceDisplay";
import { StatisticsChart } from "@/components/StatisticsChart";
import { SessionHistory } from "@/components/SessionHistory";
import { RandomTypeInfo } from "@/components/RandomTypeInfo";

import { useSessionStorage } from "@/hooks/useSessionStorage"; 
import { useDiceRoller } from "@/hooks/useDiceRoller";
import { useTimers } from "@/hooks/useTimers";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import type { RandomType } from "@/types";

const Index = () => {
  const [localAutoRollActive, setLocalAutoRollActive] = useState(false);
  const [localAutoRollInterval, setLocalAutoRollInterval] = useState(120); 
  const [tempInputValue, setTempInputValue] = useState('120'); 
  const [sessionActive, setSessionActive] = useState(false); 
  const [playerCount, setPlayerCount] = useState(4); 
  const [randomType, setRandomType] = useState<RandomType>('standard'); 
  const [sessionStartedRandomType, setSessionStartedRandomType] = useState<RandomType>('standard');

  const { sessionTime, rollIntervalTime, resetRollTimer } = useTimers(sessionActive, localAutoRollInterval, localAutoRollActive);
  const { muted, setMuted, playRollSound, stopAllSounds, stopCountdown, playCountdownSound } = useSoundEffects(); 
  const { getSavedSessions, saveSession, clearSavedSessions } = useSessionStorage(); 

  const { 
    rollStats, 
    currentPlayer, 
    rollDiceForSession, 
    rollDiceFree, 
    startSession, 
    undo, 
    redo, 
    undoCount,
    canUndo, 
    canRedo 
  } = useDiceRoller(resetRollTimer, playerCount, randomType);
  
  const [lastRoll, setLastRoll] = useState<{ dice1: number; dice2: number; total: number } | null>(() => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    return { dice1: d1, dice2: d2, total: d1 + d2 };
  });

  const [showHistory, setShowHistory] = useState(false);
  const [showRandomInfo, setShowRandomInfo] = useState(false);
  const [historySessions, setHistorySessions] = useState(() => getSavedSessions());

  const handleRoll = useCallback((isSessionMode: boolean) => {
    const result = isSessionMode ? rollDiceForSession() : rollDiceFree();
    if (result) {
      setLastRoll(result);
      if (!muted) playRollSound(result.total);
    }
    resetRollTimer();
  }, [rollDiceForSession, rollDiceFree, muted, playRollSound, resetRollTimer]);

  const handleStopSession = () => {
    if (rollStats && rollStats.totalRolls > 0) {
      saveSession({
        sessionTime,
        rollStats,
        playerCount,
        randomType,
        undoCount,
        autoRollEnabled: localAutoRollActive,
        autoRollIntervalSeconds: localAutoRollInterval,
        randomTypeChanged: sessionStartedRandomType !== randomType,
      });
      setHistorySessions(getSavedSessions());
    }
    setSessionActive(false);
    setLocalAutoRollActive(false);
    stopAllSounds(); 
  };

  const handleOpenHistory = () => {
    setHistorySessions(getSavedSessions());
    setShowHistory(true);
  };

  const handleClearHistory = () => {
    clearSavedSessions();
    setHistorySessions([]);
  };

  const remaining = localAutoRollInterval - rollIntervalTime;
  const isUrgent = localAutoRollActive && sessionActive && remaining <= 10;

  useEffect(() => {
    if (localAutoRollActive && sessionActive) {
      if (remaining <= 10 && remaining > 0 && !muted) playCountdownSound();
      if (remaining <= 0) handleRoll(true);
    } else {
      stopAllSounds();
    }
  }, [remaining, localAutoRollActive, sessionActive, muted, handleRoll, stopAllSounds, playCountdownSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden select-none px-2 text-slate-800 relative">
      
      {/* ПАНЕЛЬ НАСТРОЕК */}
      <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Select value={playerCount.toString()} onValueChange={(v) => setPlayerCount(parseInt(v))}>
            <SelectTrigger className="h-9 text-[13px] w-16 bg-white border-slate-300 font-bold focus:ring-0">
              <span className="flex items-center justify-center w-full">{playerCount} P</span>
            </SelectTrigger>
            <SelectContent>
              {[2,3,4,5,6,7,8,9].map(n => (
                <SelectItem key={n} value={n.toString()}>{n} Players</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={randomType} onValueChange={(value) => setRandomType(value as RandomType)}>
            <SelectTrigger className="h-9 text-[12px] flex-1 bg-white border-slate-300 font-bold focus:ring-0"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="weighted">Weighted</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="visual">Visual Fair</SelectItem>
              <SelectItem value="uniform">Uniform</SelectItem>
              <SelectItem value="without7">Without 7</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-300" onClick={() => setShowRandomInfo(true)}><Info size={16}/></Button>
            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-300" onClick={handleOpenHistory}><History size={16}/></Button>
            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-300" onClick={() => setMuted(!muted)}>{muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}</Button>
          </div>
        </div>

        {/* НИЖНИЙ РЯД ПАНЕЛИ: AUTO ROLL И START/STOP */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 h-14">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-start leading-none shrink-0">
              <span className="text-[9px] font-black text-slate-400 uppercase">Auto</span>
              <span className="text-[9px] font-black text-slate-400 uppercase">Roll</span>
            </div>
            <Switch checked={localAutoRollActive} onCheckedChange={setLocalAutoRollActive} />
            
            {localAutoRollActive && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg pr-2 shadow-sm h-9 ml-1 animate-in slide-in-from-left-2 duration-200">
                <Input 
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-10 h-full text-[13px] text-center font-black border-0 focus-visible:ring-0 px-0 bg-transparent" 
                  value={tempInputValue} 
                  onChange={e => setTempInputValue(e.target.value.replace(/\D/g,''))}
                  onBlur={() => {
                    const val = parseInt(tempInputValue);
                    if (!isNaN(val) && val > 0) { setLocalAutoRollInterval(val); resetRollTimer(); }
                  }}
                />
                <span className="text-[10px] font-black text-slate-400 uppercase">sec</span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={sessionActive ? handleStopSession : () => {
              setSessionStartedRandomType(randomType);
              startSession();
              setSessionActive(true);
            }}
            className={`h-10 px-4 rounded-xl font-black text-[12px] text-white shadow-md border-0 transition-all flex items-center gap-3 ${
              sessionActive 
                ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' 
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
            }`}
          >
            {sessionActive ? (
              <>
                <span className="bg-black/20 px-2 py-1 rounded-lg font-mono text-[14px] tracking-tight">
                  {formatTime(sessionTime)}
                </span>
                <span>STOP</span>
              </>
            ) : (
              "START SESSION"
            )}
          </Button>
        </div>
      </div>

      <div className="shrink-0 h-32 mt-1 z-10 pt-4">
        <StatisticsChart rollStats={rollStats} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-between py-1 px-4 z-10">
        <div className={`text-4xl font-black tabular-nums transition-all duration-300 ${isUrgent ? 'text-red-600 animate-pulse scale-110' : 'text-slate-800'}`}>
          {localAutoRollActive ? formatTime(remaining) : formatTime(rollIntervalTime)}
        </div>
        
        <div className="scale-[1.9] drop-shadow-xl my-2">
          {lastRoll && <DiceDisplay dice1={lastRoll.dice1} dice2={lastRoll.dice2} />}
        </div>

        <div className="bg-white px-8 py-1 rounded-2xl text-xl font-black border-2 border-emerald-500 text-emerald-600 shadow-lg shrink-0">
           RESULT: {lastRoll?.total || 0}
        </div>

        <div className="w-full space-y-2 pb-4 flex flex-col items-center">
          <div className="h-14 flex items-center justify-center w-full">
            {sessionActive && (
              <div className="flex items-center justify-center gap-10">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  disabled={!canUndo} 
                  onClick={() => {
                    stopCountdown(); 
                    const r = undo(); 
                    if(r) setLastRoll(r);
                  }}
                >
                  <ChevronLeft size={40}/>
                </Button>

                <div className="flex flex-col items-center justify-center leading-none">
                  <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-1">
                    Next Player
                  </span>
                  <div className="text-4xl font-black text-orange-500 w-12 text-center">{currentPlayer}</div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  disabled={!canRedo} 
                  onClick={() => {
                    stopCountdown(); 
                    const r = redo(); 
                    if(r) setLastRoll(r);
                  }}
                >
                  <ChevronRight size={40}/>
                </Button>
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => handleRoll(sessionActive)} 
            className="w-full h-28 bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 shadow-[0_8px_0_rgb(153,44,14)] rounded-[2.5rem] active:translate-y-[6px] active:shadow-none transition-all"
          >
            <span className="text-white text-6xl font-black uppercase tracking-tighter">ROLL</span>
          </Button>
        </div>
      </div>

      {showRandomInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRandomInfo(false)} />
          <div className="relative bg-white w-full max-w-sm max-h-[70vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-4 border-slate-100">
            <div className="flex justify-between items-center p-6 border-b shrink-0 bg-slate-50">
              <h2 className="text-xl font-black uppercase italic text-slate-700">Algorithms</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowRandomInfo(false)}><X size={28}/></Button>
            </div>
            <div className="flex-1 overflow-auto p-6 text-slate-600">
              <RandomTypeInfo />
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="relative bg-white w-full max-w-sm max-h-[70vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-4 border-slate-100">
            <div className="flex justify-between items-center p-6 border-b shrink-0 bg-slate-50">
              <h2 className="text-xl font-black uppercase italic text-slate-700">History</h2>
              <div className="flex items-center gap-2">
                {historySessions.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 text-slate-600"
                    onClick={handleClearHistory}
                  >
                    Clear
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}><X size={28}/></Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <SessionHistory sessions={historySessions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
