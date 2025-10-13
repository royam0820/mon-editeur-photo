import { GoogleGenAI, Modality } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const editImage = async (prompt: string, imageFile: File): Promise<string> => {
  const { mimeType, data: base64ImageData } = await fileToBase64(imageFile);

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64ImageData,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates?.length || !response.candidates[0].content?.parts?.length) {
        const finishReason = response.candidates?.[0]?.finishReason;
        console.warn('API response blocked or empty.', { finishReason });
        switch (finishReason) {
            case 'SAFETY':
                throw new Error("Le contenu demandé a été bloqué par nos filtres de sécurité. Veuillez essayer un prompt différent.");
            case 'RECITATION':
                 throw new Error("La génération a été bloquée pour éviter la récitation de contenu protégé.");
            default:
                throw new Error("La réponse de l'API était vide, possiblement en raison des filtres de contenu.");
        }
    }
    
    let generatedImageUrl: string | null = null;
    let fallbackText: string | null = null;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const generatedMimeType = part.inlineData.mimeType;
        const generatedBase64 = part.inlineData.data;
        generatedImageUrl = `data:${generatedMimeType};base64,${generatedBase64}`;
        break; 
      } else if (part.text) {
        fallbackText = part.text;
      }
    }

    if (generatedImageUrl) {
        return generatedImageUrl;
    }

    if (fallbackText) {
        console.warn(`L'API a retourné un message texte : "${fallbackText}"`);
        throw new Error(`L'IA n'a pas pu traiter votre demande et a répondu : "${fallbackText}"`);
    } else {
        throw new Error("Aucune image n'a été trouvée dans la réponse de l'API. Veuillez réessayer.");
    }

  } catch (error) {
    console.error("Erreur détaillée de l'API Gemini :", error);
    
    if (error instanceof Error) {
        // Laisse passer nos erreurs personnalisées et conviviales du bloc try
        const isCustomError = [
            "Le contenu demandé", 
            "La génération a été bloquée", 
            "La réponse de l'API était vide",
            "L'IA n'a pas pu traiter", 
            "Aucune image n'a été trouvée"
        ].some(prefix => error.message.startsWith(prefix));

        if (isCustomError) {
            throw error;
        }

        // Interprète les erreurs techniques pour les rendre compréhensibles
        if (error.message.toLowerCase().includes('api key not valid')) {
            throw new Error('Clé API invalide. La configuration du service est incorrecte.');
        }
        if (error.message.toLowerCase().includes('fetch failed') || error.message.toLowerCase().includes('networkerror')) {
             throw new Error('Erreur de réseau. Veuillez vérifier votre connexion internet et réessayer.');
        }
        
        // Pour toute autre erreur technique, affiche un message générique
        throw new Error("Un problème technique est survenu lors de la communication avec l'API.");
    }
    
    // Fallback pour les erreurs qui ne sont pas des instances d'Error
    throw new Error("Une erreur inattendue et non identifiée est survenue.");
  }
};