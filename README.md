# Éditeur d'Images IA avec Gemini

Une application web moderne et monopage qui permet aux utilisateurs de téléverser une image, de la modifier à l'aide d'instructions textuelles, et d'obtenir une nouvelle version générée par l'IA de Google, Gemini. L'application inclut des fonctionnalités avancées comme l'historique des générations, l'extension d'image (outpainting), et un visualiseur d'images avec zoom et panoramique.

 <!-- Remplacer par une capture d'écran réelle -->

---

## ✨ Fonctionnalités

- **Modification d'Image par IA** : Au cœur de l'application, modifiez vos images en décrivant simplement ce que vous voulez.
- **Téléversement Facile** : Glissez-déposez ou sélectionnez un fichier depuis votre appareil (PNG, JPG, WEBP).
- **Suggestions de Prompts** : Une liste de suggestions pour inspirer la créativité des utilisateurs.
- **Remix** : Réutilisez une image générée comme nouvelle base pour des modifications ultérieures en un seul clic.
- **Historique des Générations** : Un carrousel en bas de page conserve une trace de vos créations. Restaurez n'importe quel état précédent à tout moment.
- **Extension d’Image (Outpainting)** : Prolongez une image au-delà de ses bordures originales en choisissant un nouveau format (16:9, 9:16, 1:1).
- **Aperçu Dynamique** : Visualisez comment l'image sera étendue avant même de lancer la génération.
- **Zoom et Panoramique** : Inspectez les moindres détails de l'image générée dans une vue modale immersive.
- **Interface Responsive** : Une expérience utilisateur fluide sur ordinateur de bureau comme sur mobile.
- **Gestion Robuste des Erreurs** : Des messages clairs informent l'utilisateur en cas de problème (clé API invalide, erreur réseau, contenu bloqué, etc.).

## 🛠️ Pile Technique

- **Framework Frontend** : [React](https://reactjs.org/) avec TypeScript
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Modèle d'IA** : [Google Gemini (`gemini-2.5-flash-image`)](https://ai.google.dev/) via le SDK `@google/genai`

## 🚀 Démarrage Rapide

Pour lancer ce projet en local, suivez ces étapes :

### Prérequis

- Un navigateur web moderne.
- Un serveur web local pour servir les fichiers statiques (par exemple, `serve` de npm, ou l'extension Live Server de VS Code).

### Installation et Configuration

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/votre-utilisateur/editeur-images-ia.git
    cd editeur-images-ia
    ```

2.  **Configuration de la Clé API :**

    Cette application nécessite une clé API pour le service Google Gemini.

    - Obtenez votre clé API depuis [Google AI Studio](https://aistudio.google.com/app/apikey).
    - L'application est conçue pour lire la clé API depuis une variable d'environnement nommée `process.env.API_KEY`. Pour que cela fonctionne dans un environnement de développement local sans build tool, vous devez injecter cette variable.

    **Méthode simple (pour le test) :**
    Vous pouvez temporairement remplacer `process.env.API_KEY` dans le fichier `services/geminiService.ts` par votre clé en dur.
    
    ```typescript
    // Dans services/geminiService.ts
    // **ATTENTION : Pour le développement uniquement. Ne commitez jamais votre clé API !**
    const API_KEY = 'VOTRE_CLÉ_API_ICI'; 
    ```

    **Méthode recommandée (avec un serveur) :**
    Si vous utilisez un serveur de développement (comme Vite, Create React App, ou même un serveur Node.js simple), configurez un fichier `.env` à la racine du projet :
    
    ```
    API_KEY=VOTRE_CLÉ_API_ICI
    ```
    Assurez-vous que votre environnement de développement charge bien ce fichier (par exemple avec `dotenv`).

3.  **Lancez l'application :**

    - Ouvrez le fichier `index.html` directement dans votre navigateur ou, de préférence, utilisez un serveur local pour éviter les problèmes liés à CORS.
    - Si vous avez Node.js, vous pouvez utiliser le paquet `serve` :
    ```bash
    npm install -g serve
    serve .
    ```
    - Accédez ensuite à l'URL fournie (généralement `http://localhost:3000`).


## 📁 Structure du Projet

```
.
├── components/          # Composants React réutilisables
│   ├── GeneratedImageViewer.tsx
│   ├── HistoryCarousel.tsx
│   ├── icons.tsx
│   ├── ImagePanel.tsx
│   ├── ImageUploader.tsx
│   ├── OutpaintControls.tsx
│   ├── PromptSuggestions.tsx
│   └── ZoomViewer.tsx
├── services/            # Logique métier et appels API
│   └── geminiService.ts
├── App.tsx              # Composant principal de l'application
├── index.html           # Point d'entrée HTML
├── index.tsx            # Point d'entrée React/TypeScript
├── README.md            # Ce fichier
└── PRD.md               # Document des exigences du produit
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Si vous souhaitez améliorer ce projet, veuillez suivre les étapes suivantes :

1.  Forkez le projet.
2.  Créez une nouvelle branche (`git checkout -b feature/amelioration-incroyable`).
3.  Commitez vos changements (`git commit -m 'Ajout d'une amélioration incroyable'`).
4.  Poussez vers la branche (`git push origin feature/amelioration-incroyable`).
5.  Ouvrez une Pull Request.
