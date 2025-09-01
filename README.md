# 🎓 Internship Management - Frontend

Interface utilisateur moderne pour la plateforme de gestion des stages, développée avec React et TypeScript.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- pnpm ou yarn
- Backend API en cours d'exécution sur `http://localhost:8080`

### Installation et Lancement

```bash
# 1. Naviguer vers le dossier frontend
cd "gestion de stage"

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Ouvrir dans le navigateur
# L'application sera accessible sur http://localhost:5173
```

**Note importante** : Le backend doit être démarré en premier car le frontend communique avec l'API sur le port 8080.

## 🛠 Technologies Utilisées

- **React 18** - Framework frontend
- **TypeScript** - Typage statique
- **Vite** - Build tool et serveur de développement
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations et transitions
- **React Router v6** - Routing côté client
- **Zustand** - Gestion d'état global
- **Axios** - Client HTTP
- **React Hook Form** - Gestion des formulaires

## 📁 Structure du Projet

```
src/
├── components/           # Composants React
│   ├── admin/           # Composants administrateur
│   ├── teacher/         # Composants enseignant
│   ├── etudiant/        # Composants étudiant
│   ├── LoginPage.tsx    # Page de connexion
│   ├── RegisterStepper.tsx # Processus d'inscription
│   └── ...
├── api/                 # Services API
│   ├── authApi.ts       # Authentification
│   ├── studentApi.ts    # API étudiants
│   ├── enterpriseApi.ts # API entreprises
│   └── ...
├── store/               # État global (Zustand)
│   ├── authStore.ts     # Authentification
│   ├── registrationStore.ts # Inscription
│   └── ...
├── types/               # Types TypeScript
│   ├── auth.ts          # Types authentification
│   ├── student.ts       # Types étudiants
│   └── ...
├── hooks/               # Hooks personnalisés
├── assets/              # Images et ressources
└── App.tsx              # Composant racine
```


## 👥 Interfaces Utilisateur

### 🔐 Authentification
- **Connexion** : Email/mot de passe avec redirection selon le rôle
- **Inscription** : Processus en 4 étapes avec vérification OTP
- **Vérification email** : Code à 5 chiffres avec possibilité de renvoi

### 👨🎓 Interface Étudiant
- **Dashboard** : Liste des offres de stage approuvées
- **Candidatures** : Soumission avec CV et lettre de motivation (PDF)
- **Profil** : Gestion des informations personnelles, langues, liens GitHub/LinkedIn
- **Suivi** : État des candidatures (en attente, approuvées, rejetées)

### 🏢 Interface Entreprise
- **Création d'offres** : Formulaire complet avec convention PDF
- **Gestion candidatures** : Validation/rejet des candidatures reçues
- **Profil entreprise** : Informations et logo
- **Restriction** : Seules les entreprises partenaires peuvent créer des offres

### 👨🏫 Interface Enseignant
- **Validation offres** : Approbation des offres et conventions
- **Suivi étudiants** : Gestion par département
- **Statistiques** : Tableau de bord des stages

### 🛠 Interface Administrateur
- **Gestion entreprises** : Approbation comme partenaires
- **Export données** : Téléchargement Excel des stages
- **Tableau de bord** : Statistiques globales

## 🔄 Gestion d'État

### Zustand Stores
- **authStore** : Authentification et rôles utilisateur
- **registrationStore** : Processus d'inscription multi-étapes
- **applicationsStore** : Gestion des candidatures

### Exemple d'utilisation
```typescript
import { useAuthStore } from './store/authStore';

const { token, role, login, logout } = useAuthStore();
```

## 🌐 API Integration

### Configuration Axios
```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Authentification
```typescript
export const login = async (loginData: LoginRequest) => {
  return await api.post('/login', loginData);
};
```

## 🎯 Fonctionnalités Clés

### Système de Rôles
- Redirection automatique selon le rôle après connexion
- Protection des routes avec `ProtectedRoute`
- Interface adaptée par type d'utilisateur

### Upload de Fichiers
- Support PDF pour CV, lettres de motivation, conventions
- Validation côté client (type, taille)
- Interface drag & drop intuitive

### Animations
- Transitions fluides avec Framer Motion
- Hover effects sur les cartes
- Animations d'entrée/sortie des modals

## 🔧 Scripts Disponibles

```bash
# Développement
pnpm run dev          # Serveur de développement

# Build
pnpm run build        # Build de production
pnpm run preview      # Aperçu du build

# Linting
pnpm run lint         # Vérification ESLint
```


## 🐛 Débogage

### Outils de développement
- React DevTools
- Redux DevTools (pour Zustand)
- Network tab pour les requêtes API

## 🚀 Déploiement

### Build de production
```bash
pnpm run build
```

Les fichiers sont générés dans le dossier `dist/` et peuvent être servis par n'importe quel serveur web statique.

---

**Version Frontend** : 1.0.0