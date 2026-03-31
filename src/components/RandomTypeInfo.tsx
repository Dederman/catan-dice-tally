import React from 'react';

export const RandomTypeInfo: React.FC = () => {
  return (
    <div className="space-y-4 text-sm text-gray-700">
        <h4 className="font-semibold text-base text-gray-800">Random Type Information</h4>
        
        <div className="space-y-2">
          <p className="font-medium text-gray-900">Standard:</p>
          <p>Rolls two separate six-sided dice with JavaScript&apos;s <code>Math.random()</code>. This is the classic Catan-style bell curve where 7 appears most often and 2 or 12 appear least often.</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-gray-900">Weighted:</p>
          <p>Chooses the total using the exact real dice weights of two six-sided dice, then picks one valid dice pair for that total. The long-run graph matches standard dice probabilities, but the mode is driven from the total first.</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-gray-900">Crypto:</p>
          <p>Works like Standard, but uses <code>window.crypto.getRandomValues()</code> as the random source. The shape of the graph stays the same, while the randomness source is stronger and less predictable.</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-gray-900">Visual Fair:</p>
          <p>Builds a shuffled pool of all 36 ordered dice pairs and uses each pair once before reshuffling. That keeps the short-term results feeling more balanced while still preserving the natural bell curve over each full pool.</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-gray-900">Uniform:</p>
          <p>Gives every total from 2 to 12 the same chance to appear, then selects a matching dice pair for that total. This produces a much flatter chart than normal dice.</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-gray-900">Without 7:</p>
          <p>Uses weighted totals like real dice, but completely removes 7 from the pool and redistributes the chances across the other totals. It is intentionally unrealistic and meant for players who want to avoid seven entirely.</p>
        </div>
    </div>
  );
};
