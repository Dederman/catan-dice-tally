
import React from 'react';

interface DiceDisplayProps {
  dice1: number;
  dice2: number;
}

export const DiceDisplay: React.FC<DiceDisplayProps> = ({ dice1, dice2 }) => {
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
      <div className="w-16 h-16 bg-white border-2 border-gray-800 rounded-lg relative shadow-lg">
        <div className="absolute inset-1 grid grid-cols-3 grid-rows-3">
          {dots.map((position, index) => (
            <div
              key={index}
              className={`w-2 h-2 bg-gray-800 rounded-full ${getPositionClass(position)}`}
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
    <div className="flex space-x-4">
      {renderDice(dice1)}
      {renderDice(dice2)}
    </div>
  );
};
