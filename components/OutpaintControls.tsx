import React from 'react';

interface OutpaintControlsProps {
  currentRatio: string | null;
  onSelectRatio: (ratio: string, ratioName: string) => void;
  onReset: () => void;
}

const ratios = [
  { value: '16/9', name: '16:9 Paysage' },
  { value: '9/16', name: '9:16 Portrait' },
  { value: '1/1', name: '1:1 Carré' },
];

const OutpaintControls: React.FC<OutpaintControlsProps> = ({ currentRatio, onSelectRatio, onReset }) => {
  return (
    <div className="bg-gray-800 rounded-b-lg shadow-lg p-3 mt-[-1px]">
      <h3 className="text-sm font-semibold text-gray-400 mb-3 text-center">Extension d’image (Outpainting)</h3>
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {ratios.map(({ value, name }) => (
          <button
            key={value}
            onClick={() => onSelectRatio(value, name)}
            className={`text-xs font-medium py-1.5 px-3 rounded-full transition-colors duration-200 ${
              currentRatio === value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {name}
          </button>
        ))}
        {currentRatio && (
           <button
             onClick={onReset}
             className="text-xs font-medium py-1.5 px-3 rounded-full transition-colors duration-200 bg-red-800 text-red-200 hover:bg-red-700"
           >
             Réinitialiser
           </button>
        )}
      </div>
    </div>
  );
};

export default OutpaintControls;
