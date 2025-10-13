import React from 'react';

interface HistoryItem {
  id: number;
  prompt: string;
  originalImageUrl: string;
  generatedImageUrl: string;
}

interface HistoryCarouselProps {
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
}

const HistoryCarousel: React.FC<HistoryCarouselProps> = ({ history, onRestore }) => {
    if (history.length === 0) {
        return null;
    }

  return (
    <div className="w-full max-w-7xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-300 mb-4 text-center md:text-left">Historique des générations</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onRestore(item)}
            className="group flex-shrink-0 w-48 bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
          >
            <img 
                src={item.generatedImageUrl} 
                alt={`Generated for: ${item.prompt}`} 
                className="w-full h-32 object-cover"
            />
            <div className="p-2">
              <p className="text-xs text-gray-400 truncate group-hover:whitespace-normal group-hover:text-gray-200">
                {item.prompt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryCarousel;
