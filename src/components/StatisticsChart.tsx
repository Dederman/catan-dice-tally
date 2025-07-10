
import React from 'react';

interface RollStats {
  [key: number]: number;
  totalRolls: number;
}

interface StatisticsChartProps {
  rollStats: RollStats;
}

export const StatisticsChart: React.FC<StatisticsChartProps> = ({ rollStats }) => {
  const maxCount = Math.max(...Object.keys(rollStats)
    .filter(key => key !== 'totalRolls')
    .map(key => rollStats[parseInt(key)] || 0), 1);

  const getBarHeight = (count: number) => {
    return (count / maxCount) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end h-32 px-2">
        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
          const count = rollStats[num] || 0;
          return (
            <div key={num} className="flex flex-col items-center space-y-1">
              <div className="text-xs font-medium">{count}</div>
              <div 
                className="w-6 bg-blue-500 rounded-t-sm transition-all duration-300"
                style={{ 
                  height: `${Math.max(getBarHeight(count), 4)}px`,
                  minHeight: '4px'
                }}
              />
              <div className="text-xs font-medium text-gray-600">{num}</div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center text-xs text-gray-500">
        Roll Results Distribution
      </div>
    </div>
  );
};
