import { api, getAuthHeaders } from './api';

// Authentification
import type { LoginRequest, ResetPasswordRequestDto } from '../types/auth';

export const login = async (loginData: LoginRequest) => {
  try {
    if (!loginData.email || !loginData.password) {
      throw new Error('Email et mot de passe requis');
    }
    return await api.post('/login', loginData);
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Email ou mot de passe incorrect');
    }
    if (error.response?.status === 403) {
      throw new Error('Compte non vérifié. Vérifiez votre email.');
    }
    if (error.code === 'NETWORK_ERROR') {
      throw new Error('Erreur de connexion. Vérifiez votre réseau.');
    }
    throw new Error(error.response?.data?.message || 'Erreur de connexion');
  }
};
export const verifyCurrentPassword = async (password: string) => {
  try {
    if (!password || password.trim() === '') {
      throw new Error('Mot de passe requis');
    }
    return await api.put('/updateProfile/verifyPassword', { password }, {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Mot de passe incorrect');
  }
};

// Demander un token de réinitialisation
export const sendResetToken = async (email: string) => {
  try {
    return await api.post('/resetPassword/sendTokenWhenResetting', { email });
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Utilisateur non trouvé');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du token');
  }
};

// Vérifier le token de réinitialisation
export const verifyResetToken = async (email: string, token: string) => {
  try {
    return await api.post('/resetPassword/verifyEmail', { email, token });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Token invalide ou expiré');
  }
};

// Réinitialiser le mot de passe (après vérification)
export const resetPassword = async (resetData: ResetPasswordRequestDto) => {
  try {
    return await api.patch('/resetPassword', resetData);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
  }
};
