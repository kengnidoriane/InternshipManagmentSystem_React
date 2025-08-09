# Documentation d’Avancement – Gestion de Stage (Frontend)

Ce fichier est destiné à suivre l’état d’avancement des fonctionnalités principales du projet frontend. Il sera complété et mis à jour au fur et à mesure.

---

## 1. Authentification et Inscription
- [x] Formulaires d’inscription multi-rôles (étudiant, enseignant, entreprise)
- [x] Redirection selon le rôle après inscription
- [x] Stockage du rôle et du token dans Zustand (migration en cours)
- [ ] Finaliser la migration complète du state global de useContext vers Zustand

## 2. Entreprise – Header et Navigation
- [x] Composant `EnterpriseHeader` conforme à la maquette (liens : offres, candidatures, profil, paramètres)
- [x] Correction des imports (suppression de l’ancien `EntrepriseHeader`)
- [x] Navigation fluide (framer-motion)

## 3. Entreprise – Gestion des Offres
- [x] Liste des offres dynamiquement chargée avec `getEnterpriseOffers`
- [x] Affichage conditionnel : si aucune offre, box "Aucune offre" selon maquette
- [x] Création d’offre : formulaire respectant le DTO backend (PDF obligatoire)
- [x] Chargement dynamique des infos entreprise dans le formulaire (via `/enterprise/me`)
- [ ] UI du formulaire à finaliser selon la maquette (design exact)

## 4. Entreprise – Candidatures
- [x] Page candidatures : chaque offre + liste des étudiants ayant postulé
- [x] Appels API dynamiques (`getEnterpriseOffers`, `getOfferApplications`)

## 5. Sécurité, Routing et Protected Routes
- [x] Routing par rôle (protection des routes selon Zustand)
- [ ] Correction de la page blanche sur `/login` si besoin

## 6. API et Backend Contract
- [x] Fonctions API : `getEnterpriseOffers`, `getEnterpriseInfo`, `createOffer`, `getOfferApplications` conformes au backend
- [ ] Endpoint `/enterprise/me` à ajouter côté backend (actuellement manquant)

## 7. Divers
- [x] Nettoyage des imports, suppression des doublons
- [x] Utilisation de composants réutilisables pour les headers
- [ ] Ajout de tests unitaires/End-to-End (à planifier)

---

**Dernière mise à jour : 2025-08-06**

À compléter au fur et à mesure de l’avancement.
