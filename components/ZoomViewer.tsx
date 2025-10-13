import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon, ResetViewIcon } from './icons';

interface ZoomViewerProps {
  imageUrl: string;
  onClose: () => void;
}

const ZoomViewer: React.FC<ZoomViewerProps> = ({ imageUrl, onClose }) => {
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const resetView = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;
    
    const { naturalWidth, naturalHeight } = imageRef.current;
    const { clientWidth, clientHeight } = containerRef.current;
    
    const scaleX = clientWidth / naturalWidth;
    const scaleY = clientHeight / naturalHeight;
    const initialScale = Math.min(scaleX, scaleY, 1); // Ne pas agrandir l'image au-delà de sa taille réelle initialement
    
    setTransform({
      scale: initialScale,
      x: (clientWidth - naturalWidth * initialScale) / 2,
      y: (clientHeight - naturalHeight * initialScale) / 2,
    });
  }, []);

  // Appliquer la transformation initiale "fit-to-screen" au chargement de l'image
  useEffect(() => {
    const image = imageRef.current;
    if (image) {
      const handleLoad = () => resetView();
      image.addEventListener('load', handleLoad);
      // Si l'image est déjà chargée depuis le cache
      if (image.complete) {
        handleLoad();
      }
      return () => image.removeEventListener('load', handleLoad);
    }
  }, [imageUrl, resetView]);

  // Gérer les raccourcis clavier (touche Échap)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const zoomFactor = 1.1;
    const newScale = e.deltaY < 0 ? transform.scale * zoomFactor : transform.scale / zoomFactor;
    
    // Limiter le zoom
    const clampedScale = Math.max(0.1, Math.min(newScale, 10));

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newX = mouseX - (mouseX - transform.x) * (clampedScale / transform.scale);
    const newY = mouseY - (mouseY - transform.y) * (clampedScale / transform.scale);

    setTransform({ scale: clampedScale, x: newX, y: newY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMousePosition.current.x;
    const dy = e.clientY - lastMousePosition.current.y;
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onWheel={handleWheel}
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        className="w-full h-full relative overflow-hidden"
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Vue zoomée"
          className="absolute max-w-none max-h-none"
          style={{ 
            transformOrigin: 'top left',
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            cursor: isPanning ? 'grabbing' : 'grab'
          }}
          onClick={(e) => e.stopPropagation()} // Empêche la fermeture de la modale en cliquant sur l'image
        />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 z-10"
        title="Fermer"
      >
        <CloseIcon />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); resetView(); }}
        className="absolute top-4 left-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 z-10"
        title="Réinitialiser la vue"
      >
        <ResetViewIcon />
      </button>
    </div>
  );
};

export default ZoomViewer;
