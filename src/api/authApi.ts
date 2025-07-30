import axios from 'axios';

// Authentification
export const login = (loginData) =>
  axios.post('/login', loginData);

// Réinitialisation du mot de passe
export const resetPassword = (resetData) =>
  axios.patch('/resetPassword', resetData);
