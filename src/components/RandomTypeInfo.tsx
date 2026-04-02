import React from 'react';

export const RandomTypeInfo: React.FC = () => {
  const randomTypes = [
    {
      title: 'Standard',
      image: '/random-info/standard.jpg',
      description:
        "Rolls two separate six-sided dice with JavaScript's Math.random(). This is the classic Catan-style bell curve where 7 appears most often and 2 or 12 appear least often.",
    },
    {
      title: 'Weighted',
      image: '/random-info/weighted.jpg',
      description:
        'Chooses the total using the exact real dice weights of two six-sided dice, then picks one valid dice pair for that total. The long-run graph matches standard dice probabilities, but the mode is driven from the total first.',
    },
    {
      title: 'Crypto',
      image: '/random-info/crypto.jpg',
      description:
        'Works like Standard, but uses window.crypto.getRandomValues() as the random source. The shape of the graph stays the same, while the randomness source is stronger and less predictable.',
    },
    {
      title: 'Visual Fair',
      image: '/random-info/visual.jpg',
      description:
        'Builds a shuffled pool of all 36 ordered dice pairs and uses each pair once before reshuffling. That keeps the short-term results feeling more balanced while still preserving the natural bell curve over each full pool.',
    },
    {
      title: 'Uniform',
      image: '/random-info/uniform.jpg',
      description:
        'Gives every total from 2 to 12 the same chance to appear, then selects a matching dice pair for that total. This produces a much flatter chart than normal dice.',
    },
    {
      title: 'Without 7',
      image: '/random-info/without7.jpg',
      description:
        'Uses weighted totals like real dice, but completely removes 7 from the pool and redistributes the chances across the other totals. It is intentionally unrealistic and meant for players who want to avoid seven entirely.',
    },
  ];

  return (
    <div className="space-y-5 text-sm text-gray-700">
      <h4 className="text-base font-semibold text-gray-800">Random Types</h4>

      {randomTypes.map((type) => (
        <div
          key={type.title}
          className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm"
        >
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{type.title}:</p>
            <p>{type.description}</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img
              src={type.image}
              alt={`${type.title} distribution example`}
              className="h-auto w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
