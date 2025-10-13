
import React from 'react';

interface PromptSuggestionsProps {
  suggestions: string[];
  onSelect: (prompt: string) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ suggestions, onSelect }) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-gray-400 mb-2 text-center md:text-left">Suggestions :</p>
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white text-xs font-medium py-1.5 px-3 rounded-full transition-colors duration-200"
            aria-label={`Utiliser la suggestion : ${suggestion}`}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;
