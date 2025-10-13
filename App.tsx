import React, { useState, useCallback, useRef } from 'react';
import { editImage } from './services/geminiService';
import ImagePanel from './components/ImagePanel';
import ImageUploader from './components/ImageUploader';
import GeneratedImageViewer from './components/GeneratedImageViewer';
import { SpinnerIcon } from './components/icons';
import PromptSuggestions from './components/PromptSuggestions';
import OutpaintControls from './components/OutpaintControls';
import HistoryCarousel from './components/HistoryCarousel';
import ZoomViewer from './components/ZoomViewer';

// Type pour un élément de l'historique
interface HistoryItem {
  id: number;
  prompt: string;
  originalImageUrl: string;
  generatedImageUrl: string;
}

// Helper pour convertir un data URL en Fichier
const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
};


const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Nouveaux états pour les fonctionnalités
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [outpaintRatio, setOutpaintRatio] = useState<string | null>(null);
  const userPromptBeforeOutpaint = useRef<string>('');
  const outpaintPromptTemplate = useRef<string>('');
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);


  const promptSuggestions = [
    "Ajoute un chapeau de pirate",
    "Transforme le fond en forêt enchantée",
    "Rends l'image en style peinture à l'huile",
    "Change la saison en hiver, avec de la neige",
    "Donne une ambiance cyberpunk",
    "Fais en sorte que ça ressemble à un dessin animé",
  ];

  const handleImageUpload = (file: File) => {
    setOriginalImageFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setError(null);
    handleClearOutpaint();
  };

  const handleResetOutpaint = () => {
    setOutpaintRatio(null);
    // Restaure le prompt utilisateur uniquement s'il n'a pas modifié le prompt d'outpainting
    if (prompt === outpaintPromptTemplate.current) {
        setPrompt(userPromptBeforeOutpaint.current);
    }
  };
  
  const handleClearOutpaint = () => {
      setOutpaintRatio(null);
      setPrompt('');
  }

  const handleSelectOutpaintRatio = (ratio: string, ratioName: string) => {
    setOutpaintRatio(ratio);
    // Sauvegarde le prompt actuel de l'utilisateur
    if (prompt !== outpaintPromptTemplate.current) {
        userPromptBeforeOutpaint.current = prompt;
    }
    // Génère et applique le nouveau prompt pour l'outpainting
    const newPrompt = `Prolonge cette image pour l'adapter à un format ${ratioName}. Les nouvelles zones doivent se fondre de manière transparente et cohérente avec le contenu de l'image originale.`;
    outpaintPromptTemplate.current = newPrompt;
    setPrompt(newPrompt);
  };


  const handleApply = useCallback(async () => {
    if (!originalImageFile || !prompt || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const generatedImage = await editImage(prompt, originalImageFile);
      setGeneratedImageUrl(generatedImage);

       // Ajouter à l'historique
      if (originalImageUrl) {
          const newHistoryItem: HistoryItem = {
              id: Date.now(),
              prompt,
              originalImageUrl,
              generatedImageUrl: generatedImage,
          };
          setHistory(prev => [newHistoryItem, ...prev]);
      }
      
      // Réinitialiser l'outpainting après la génération
      if (outpaintRatio) {
          handleResetOutpaint();
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue est survenue.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, originalImageUrl, prompt, isLoading, outpaintRatio]);

  const handleClear = () => {
    setPrompt('');
    setOriginalImageFile(null);
    setOriginalImageUrl(null);
    setGeneratedImageUrl(null);
    setError(null);
    setIsLoading(false);
    setHistory([]);
    setOutpaintRatio(null);
    userPromptBeforeOutpaint.current = '';
    outpaintPromptTemplate.current = '';

    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const handleRemix = async () => {
    if (!generatedImageUrl) return;

    try {
      const remixedFile = await dataUrlToFile(generatedImageUrl, "remixed_image.png");

      setOriginalImageFile(remixedFile);
      setOriginalImageUrl(generatedImageUrl);

      setGeneratedImageUrl(null);
      handleClearOutpaint();
      setError(null);
      setIsLoading(false);

    } catch (remixError) {
      console.error("Error during remix:", remixError);
      setError("Impossible de réutiliser cette image. Veuillez réessayer.");
    }
  };
  
  const handleRestoreFromHistory = async (item: HistoryItem) => {
    try {
        setIsLoading(true);
        const originalFile = await dataUrlToFile(item.originalImageUrl, 'restored_original.png');
        setOriginalImageFile(originalFile);
        setOriginalImageUrl(item.originalImageUrl);
        setGeneratedImageUrl(item.generatedImageUrl);
        setPrompt(item.prompt);
        setOutpaintRatio(null);
        setError(null);
    } catch (restoreError) {
        console.error("Error restoring from history:", restoreError);
        setError("Impossible de restaurer cet état de l'historique.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleOpenZoom = (url: string) => {
    if (url) {
      setZoomedImageUrl(url);
    }
  };
  
  const handleCloseZoom = () => {
    setZoomedImageUrl(null);
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col p-4 md:p-8">
      <header className="w-full max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Éditeur d'Images IA
        </h1>
        <p className="text-center text-gray-400 mt-2">
          Téléversez, décrivez, et transformez vos images avec la puissance de Gemini.
        </p>
      </header>

      <main className="w-full max-w-7xl mx-auto flex flex-col flex-1">
        {/* Section Supérieure (Zone de commande) */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-4 mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="ex.: 'Ajoute un chapeau d'anniversaire au chat' ou 'Change le fond d'écran pour une plage ensoleillée'"
            className="w-full flex-grow bg-gray-700 text-white placeholder-gray-400 rounded-md p-3 border-2 border-transparent focus:border-purple-500 focus:ring-0 resize-none transition-colors"
            rows={3}
            disabled={isLoading}
          />
          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={handleApply}
              disabled={!originalImageFile || !prompt || isLoading}
              className="w-full md:w-auto flex items-center justify-center bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? <SpinnerIcon /> : 'Appliquer'}
            </button>
            <button
              onClick={handleClear}
              className="w-full md:w-auto bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Effacer
            </button>
          </div>
        </div>

        <PromptSuggestions suggestions={promptSuggestions} onSelect={setPrompt} />
        
        {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md relative mb-4 text-center" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {/* Section Inférieure (Zone d'affichage) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ImagePanel title="Image Originale" outpaintRatio={outpaintRatio}>
                {originalImageUrl ? (
                   <img src={originalImageUrl} alt="Original" className="max-w-full max-h-full object-contain block shadow-lg" />
                ) : (
                  <ImageUploader onImageUpload={handleImageUpload} />
                )}
              </ImagePanel>
              {originalImageUrl && (
                  <OutpaintControls
                      currentRatio={outpaintRatio}
                      onSelectRatio={handleSelectOutpaintRatio}
                      onReset={handleResetOutpaint}
                  />
              )}
            </div>
          <ImagePanel title="Image Modifiée">
            <GeneratedImageViewer 
                imageUrl={generatedImageUrl} 
                isLoading={isLoading} 
                onRemix={handleRemix} 
                onZoomRequest={handleOpenZoom}
            />
          </ImagePanel>
        </div>
      </main>

      <HistoryCarousel history={history} onRestore={handleRestoreFromHistory} />

      {zoomedImageUrl && (
        <ZoomViewer imageUrl={zoomedImageUrl} onClose={handleCloseZoom} />
      )}
    </div>
  );
};

export default App;