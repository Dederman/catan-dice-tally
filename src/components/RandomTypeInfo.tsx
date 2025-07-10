
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RandomTypeInfo: React.FC = () => {
  const standardProbabilities = [
    { number: 2, probability: 2.78 },
    { number: 3, probability: 5.56 },
    { number: 4, probability: 8.33 },
    { number: 5, probability: 11.11 },
    { number: 6, probability: 13.89 },
    { number: 7, probability: 16.67 },
    { number: 8, probability: 13.89 },
    { number: 9, probability: 11.11 },
    { number: 10, probability: 8.33 },
    { number: 11, probability: 5.56 },
    { number: 12, probability: 2.78 },
  ];

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Standard Dice</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 mb-3">
            Simulates two 6-sided dice with natural probability distribution.
          </p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {standardProbabilities.map(({ number, probability }) => (
              <div key={number} className="flex justify-between">
                <span>{number}:</span>
                <span>{probability}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Uniform</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 mb-3">
            Equal probability for all results 2-12 (~9.09% each).
          </p>
          <p className="text-xs text-gray-500">
            Perfect for balanced gameplay where no number is favored.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Visual Fair</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 mb-3">
            Dice animation looks normal, but results are pulled from a weighted distribution that slightly favors middle numbers.
          </p>
          <p className="text-xs text-gray-500">
            Creates a more predictable game flow while maintaining the visual appeal of real dice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
