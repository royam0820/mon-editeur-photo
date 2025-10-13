import React, { useState } from 'react';
import { ImageIcon, SpinnerIcon, DownloadIcon, FullscreenIcon, CloseIcon, RemixIcon, ZoomIcon } from './icons';

interface GeneratedImageViewerProps {
  imageUrl: string | null;
  isLoading: boolean;
  onRemix: () => void;
  onZoomRequest: (imageUrl: string) => void;
}

const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ imageUrl, isLoading, onRemix, onZoomRequest }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image_modifiee.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    if (imageUrl) {
        setIsFullscreen(!isFullscreen);
    }
  };

  const handleWheelZoom = (e: React.WheelEvent) => {
    if (imageUrl && e.deltaY !== 0) {
      e.preventDefault();
      onZoomRequest(imageUrl);
    }
  };


  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
        <SpinnerIcon />
        <p className="mt-2 animate-pulse">Génération en cours...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
        <ImageIcon />
        <p className="mt-2 text-center">Votre image modifiée apparaîtra ici.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full relative group" onWheel={handleWheelZoom}>
        <img src={imageUrl} alt="Generated" className="w-full h-full object-contain rounded-md" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleDownload}
            className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transform hover:scale-110 transition-all"
            title="Télécharger"
          >
            <DownloadIcon />
          </button>
           <button
            onClick={() => imageUrl && onZoomRequest(imageUrl)}
            className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transform hover:scale-110 transition-all"
            title="Zoomer et déplacer"
          >
            <ZoomIcon />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transform hover:scale-110 transition-all"
            title="Plein écran"
          >
            <FullscreenIcon />
          </button>
          <button
            onClick={onRemix}
            className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transform hover:scale-110 transition-all"
            title="Remix (Utiliser comme base)"
          >
            <RemixIcon />
          </button>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={toggleFullscreen}>
            <button
                onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30"
            >
                <CloseIcon />
            </button>
            <img 
                src={imageUrl} 
                alt="Fullscreen" 
                className="max-w-full max-h-full object-contain" 
                onClick={(e) => e.stopPropagation()}
            />
        </div>
      )}
    </>
  );
};

export default GeneratedImageViewer;