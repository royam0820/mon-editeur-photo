# Product Requirements Document (PRD) : Éditeur d'Images IA

**Version:** 1.0
**Date:** 25 Mai 2024
**Auteur:** L'équipe de développement

---

## 1. Vision et Objectif du Produit

### 1.1. Vision
Créer une application web de retouche photo intuitive et puissante qui démocratise l'édition d'images créative grâce à l'intelligence artificielle générative. L'utilisateur doit pouvoir transformer une image en décrivant simplement le résultat souhaité en langage naturel.

### 1.2. Objectif
Développer une application monopage (SPA) performante où un utilisateur peut téléverser une image, fournir un prompt textuel, et obtenir une image modifiée par le modèle Google Gemini. L'expérience doit être fluide, interactive et encourager l'expérimentation créative à travers des fonctionnalités avancées comme le "remix", l'historique et l'extension d'image.

## 2. Public Cible

- **Créateurs de contenu et Community Managers** : Pour créer rapidement des visuels originaux pour les réseaux sociaux.
- **Amateurs de photographie** : Pour expérimenter et retoucher leurs photos de manière créative sans avoir besoin de logiciels complexes.
- **Utilisateurs curieux de l'IA** : Pour découvrir de manière ludique les capacités des modèles d'IA générative d'images.
- **Designers et Marketeurs** : Pour prototyper rapidement des idées visuelles ou créer des assets pour des campagnes.

## 3. Fonctionnalités et Exigences (User Stories)

### 3.1. Core Loop : Modification d'Image
- **EPIC-01: Modification d'image de base**
    - **User Story 1.1** : En tant qu'utilisateur, je veux pouvoir téléverser une image (JPG, PNG, WEBP) depuis mon appareil pour qu'elle serve de base à la modification.
    - **User Story 1.2** : En tant qu'utilisateur, je veux un champ de texte pour décrire les modifications que je souhaite apporter à l'image.
    - **User Story 1.3** : En tant qu'utilisateur, je veux cliquer sur un bouton "Appliquer" pour envoyer mon image et mon prompt à l'IA et lancer la génération.
    - **User Story 1.4** : En tant qu'utilisateur, je veux voir l'image générée par l'IA s'afficher dans un panneau dédié, à côté de mon image originale.
    - **User Story 1.5** : En tant qu'utilisateur, je veux voir un indicateur de chargement pendant que l'IA travaille.
    - **User Story 1.6** : En tant qu'utilisateur, je veux pouvoir réinitialiser complètement l'interface (images, prompt) avec un bouton "Effacer".

### 3.2. Amélioration de l'Expérience Utilisateur
- **EPIC-02: Amélioration de l'UX**
    - **User Story 2.1** : En tant qu'utilisateur, je veux voir des suggestions de prompts cliquables pour m'inspirer si je ne sais pas quoi demander.
    - **User Story 2.2** : En tant qu'utilisateur, au survol de l'image générée, je veux voir des options pour la télécharger, la voir en plein écran, et la "remixer".
    - **User Story 2.3** : En tant qu'utilisateur, en cliquant sur l'icône "Remix", je veux que l'image générée devienne la nouvelle image originale, prête pour une autre modification.
    - **User Story 2.4** : En tant qu'utilisateur, je veux être informé par un message clair et compréhensible si une erreur se produit (ex: contenu bloqué par la sécurité, erreur réseau).

### 3.3. Fonctionnalités Avancées
- **EPIC-03: Historique des générations**
    - **User Story 3.1** : En tant qu'utilisateur, je veux voir un historique de mes générations sous forme de carrousel en bas de la page.
    - **User Story 3.2** : En tant qu'utilisateur, chaque élément de l'historique doit montrer une miniature de l'image générée et le prompt utilisé.
    - **User Story 3.3** : En tant qu'utilisateur, je veux pouvoir cliquer sur un élément de l'historique pour restaurer complètement l'état de l'application (image originale, image générée, prompt) à ce moment-là.

- **EPIC-04: Extension d'image (Outpainting)**
    - **User Story 4.1** : En tant qu'utilisateur, je veux pouvoir choisir un nouveau format (16:9, 9:16, 1:1) pour étendre mon image originale.
    - **User Story 4.2** : En tant qu'utilisateur, lors de la sélection d'un format, je veux voir un aperçu de la zone à générer, avec mon image centrée et un fond en damier transparent.
    - **User Story 4.3** : En tant qu'utilisateur, je veux que le champ de prompt se remplisse automatiquement avec une instruction pertinente pour l'outpainting lorsque je sélectionne un format.
    - **User Story 4.4** : En tant qu'utilisateur, je veux pouvoir réinitialiser la sélection de format d'outpainting.

- **EPIC-05: Visualisation détaillée**
    - **User Story 5.1** : En tant qu'utilisateur, je veux pouvoir ouvrir l'image générée dans une vue modale plein écran pour l'inspecter en détail.
    - **User Story 5.2** : Dans cette vue, je veux pouvoir zoomer et dézoomer avec la molette de la souris, avec le zoom centré sur mon curseur.
    - **User Story 5.3** : Dans cette vue, si l'image est zoomée, je veux pouvoir me déplacer (panoramique) en cliquant et en faisant glisser l'image.

## 4. Exigences UI/UX

- **Layout** : L'interface principale doit être divisée en deux panneaux verticaux côte à côte : "Image Originale" et "Image Modifiée". La zone de commande (prompt et boutons) doit se trouver au-dessus. L'historique doit être un carrousel horizontal en bas.
- **Design** : Moderne, épuré, avec un thème sombre ("dark mode") pour mettre en valeur les images. L'identité visuelle doit être cohérente, avec une couleur d'accent (violet) pour les actions principales.
- **Responsivité** : L'application doit être parfaitement utilisable sur les appareils mobiles, avec une disposition qui passe à une seule colonne sur les petits écrans.
- **Feedback Utilisateur** : Des indicateurs visuels clairs doivent être présents pour les états de chargement, les succès, les erreurs et les éléments interactifs (survol, désactivé).

## 5. Exigences Techniques

- **Stack** : L'application doit être développée avec React, TypeScript et Tailwind CSS.
- **API** : Utiliser exclusivement l'API Google Gemini, via le SDK `@google/genai`, et spécifiquement le modèle `gemini-2.5-flash-image` pour la modification d'image.
- **Performance** : L'interface doit rester fluide et réactive. Le traitement des images côté client (conversion en base64) doit être optimisé pour ne pas bloquer le thread principal.
- **Gestion d'état** : La gestion de l'état doit être centralisée et prévisible, en utilisant les hooks de React (`useState`, `useCallback`, etc.).
- **Compatibilité Navigateur** : L'application doit fonctionner sur les dernières versions de Chrome, Firefox, Safari et Edge.

## 6. Scénarios d'Erreur à Gérer

- **Clé API Invalide** : L'utilisateur doit être notifié que la configuration du service est incorrecte.
- **Pas d'Image ou de Prompt** : Le bouton "Appliquer" doit être désactivé.
- **Erreur Réseau** : L'utilisateur doit être invité à vérifier sa connexion internet.
- **Contenu Bloqué (Sécurité)** : Un message doit informer l'utilisateur que sa demande a été bloquée par les filtres de sécurité, en l'invitant à reformuler.
- **Réponse Vide de l'API** : Si l'API ne retourne ni image ni erreur claire, un message générique doit s'afficher.
