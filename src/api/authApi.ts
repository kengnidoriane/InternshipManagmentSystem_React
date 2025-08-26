import { api, getAuthHeaders } from './api';

// Authentification
import type { LoginRequest, ResetPasswordRequestDto } from '../types/auth';
export const login = (loginData: LoginRequest) =>
  api.post('/login', loginData);

// Réinitialisation du mot de passe
export const resetPassword = (resetData: ResetPasswordRequestDto) =>
  api.patch('/resetPassword', resetData);

// Récupérer l'utilisateur connecté
export const getCurrentUser = () =>
  api.get('/auth/me', { headers: getAuthHeaders() });

// Vérifier le mot de passe actuel
export const verifyCurrentPassword = (password: string) =>
  api.post('/auth/verifyPassword', { password }, { headers: getAuthHeaders() });

// Modifier l'email
export const updateEmail = (newEmail: string, currentPassword: string) =>
  api.put('/auth/updateEmail', { newEmail, currentPassword }, { headers: getAuthHeaders() });

// Modifier le mot de passe
export const updatePassword = (currentPassword: string, newPassword: string) =>
  api.put('/auth/updatePassword', { currentPassword, newPassword }, { headers: getAuthHeaders() });
