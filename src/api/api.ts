import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// ⚠️ SÉCURITÉ: localStorage vulnérable aux XSS - considérer httpOnly cookies en production
// Fonction pour obtenir les headers avec token
export const getAuthHeaders = () => {
  try {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (error) {
    console.error('Erreur récupération token');
    return {};
  }
};

// Fonction pour mettre à jour le token avec validation
export const updateTokenCache = (token: string | null) => {
  try {
    if (token) {
      // Validation basique JWT
      if (!token.includes('.')) {
        throw new Error('Token JWT invalide');
      }
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  } catch (error) {
    console.error('Erreur gestion token');
  }
};

// Interceptor de requête pour gestion automatique des erreurs
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur ajout token à la requête');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de réponse pour gestion des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      updateTokenCache(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

