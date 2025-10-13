import React from 'react';

interface ImagePanelProps {
  title: string;
  children: React.ReactNode;
  outpaintRatio?: string | null;
}

const checkerboardBg = {
    backgroundImage: `
        linear-gradient(45deg, #4a5568 25%, transparent 25%),
        linear-gradient(-45deg, #4a5568 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #4a5568 75%),
        linear-gradient(-45deg, transparent 75%, #4a5568 75%)`,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    backgroundColor: '#2d3748'
};

const ImagePanel: React.FC<ImagePanelProps> = ({ title, children, outpaintRatio }) => {
  const panelStyle = outpaintRatio ? { ...checkerboardBg, aspectRatio: outpaintRatio } : {};

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col h-[40vh] md:h-auto">
      <h2 className="text-lg font-semibold text-gray-300 mb-4 text-center">{title}</h2>
      <div 
        className="flex-1 bg-gray-900/50 rounded-md flex items-center justify-center p-2 min-h-0 overflow-hidden transition-all duration-300"
        style={panelStyle}
      >
        {children}
      </div>
    </div>
  );
};

export default ImagePanel;
