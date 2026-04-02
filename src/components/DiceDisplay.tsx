
import React from 'react';

interface DiceDisplayProps {
  dice1: number;
  dice2: number;
  size?: number;
}

export const DiceDisplay: React.FC<DiceDisplayProps> = ({ dice1, dice2, size = 64 }) => {
  const dotSize = Math.max(6, Math.round(size * 0.125));
  const inset = Math.max(4, Math.round(size * 0.1));
  const gap = Math.max(12, Math.round(size * 0.25));

  const renderDice = (value: number) => {
    const getDotPositions = (num: number) => {
      switch (num) {
        case 1:
          return ['center'];
        case 2:
          return ['top-left', 'bottom-right'];
        case 3:
          return ['top-left', 'center', 'bottom-right'];
        case 4:
          return ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        case 5:
          return ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'];
        case 6:
          return ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'];
        default:
          return [];
      }
    };

    const dots = getDotPositions(value);
    
    return (
      <div
        className="relative rounded-lg border-2 border-gray-800 bg-white shadow-lg"
        style={{ width: size, height: size }}
      >
        <div className="absolute grid grid-cols-3 grid-rows-3" style={{ inset }}>
          {dots.map((position, index) => (
            <div
              key={index}
              className={`rounded-full bg-gray-800 ${getPositionClass(position)}`}
              style={{ width: dotSize, height: dotSize }}
            />
          ))}
        </div>
      </div>
    );
  };

  const getPositionClass = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'col-start-1 row-start-1 justify-self-center self-center';
      case 'top-right':
        return 'col-start-3 row-start-1 justify-self-center self-center';
      case 'middle-left':
        return 'col-start-1 row-start-2 justify-self-center self-center';
      case 'center':
        return 'col-start-2 row-start-2 justify-self-center self-center';
      case 'middle-right':
        return 'col-start-3 row-start-2 justify-self-center self-center';
      case 'bottom-left':
        return 'col-start-1 row-start-3 justify-self-center self-center';
      case 'bottom-right':
        return 'col-start-3 row-start-3 justify-self-center self-center';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ gap }}>
      {renderDice(dice1)}
      {renderDice(dice2)}
    </div>
  );
};
