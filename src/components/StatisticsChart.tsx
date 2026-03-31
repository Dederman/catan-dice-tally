import React from 'react';

interface StatisticsChartProps {
  rollStats: {
    totalRolls: number;
    distribution: number[];
  };
}

export const StatisticsChart = ({ rollStats }: StatisticsChartProps) => {
  // Находим максимум, но не меньше 1, чтобы не делить на ноль
  const maxCount = Math.max(...rollStats.distribution, 1);

  const colors = [
    'from-blue-600 to-blue-400',      // 2
    'from-blue-400 to-cyan-400',      // 3
    'from-emerald-500 to-teal-400',   // 4
    'from-yellow-400 to-yellow-500',  // 5
    'from-orange-400 to-orange-600',  // 6
    'from-red-500 to-red-700',        // 7
    'from-orange-400 to-orange-600',  // 8
    'from-yellow-400 to-yellow-500',  // 9
    'from-emerald-500 to-teal-400',   // 10
    'from-blue-400 to-cyan-400',      // 11
    'from-blue-600 to-blue-400'       // 12
  ];

  return (
    <div className="relative w-full h-full bg-slate-50/50 rounded-2xl p-2 border border-slate-100 shadow-inner flex flex-col justify-end">
      {/* Общее количество бросков - Всегда сверху */}
      <div className="absolute top-2 right-4 text-[10px] font-black text-slate-400 uppercase tracking-widest z-20">
        Total Rolls: <span className="text-slate-800">{rollStats.totalRolls}</span>
      </div>

      {/* Контейнер графика с верхним отступом pt-6 */}
      <div className="flex items-end justify-between h-32 gap-1 px-1 pt-6">
        {rollStats.distribution.map((count, i) => {
          const rollValue = i + 2;
          
          // ВАЖНО: Умножаем на 75, чтобы оставить 25% места сверху под текст
          const barHeight = (count / maxCount) * 75;

          return (
            <div key={rollValue} className="flex-1 flex flex-col items-center h-full justify-end">
              <div className="w-full relative flex flex-col justify-end h-full">
                
                {/* Число над столбиком (если столбик есть) */}
                {count > 0 && (
                  <span 
                    className="absolute left-0 right-0 text-[9px] font-black text-slate-600 text-center mb-0.5 transition-all duration-700"
                    style={{ bottom: `${barHeight}%` }}
                  >
                    {count}
                  </span>
                )}

                {/* 3D Столбик */}
                <div 
                  className={`w-full bg-gradient-to-t ${colors[i]} rounded-t-md transition-all duration-700 ease-out 
                  relative min-h-[2px] 
                  shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.1)]`}
                  style={{ height: `${barHeight}%` }}
                >
                  {/* Белый блик сверху */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/30 rounded-t-md" />
                </div>
              </div>

              {/* Номер кубика снизу */}
              <span className={`text-[11px] font-black mt-1 ${rollValue === 7 ? 'text-red-600 scale-110' : 'text-slate-400'}`}>
                {rollValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};