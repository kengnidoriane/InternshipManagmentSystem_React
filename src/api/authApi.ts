import { api } from './api';

// Authentification
import type { LoginRequest, ResetPasswordRequestDto } from '../types/auth';
export const login = (loginData: LoginRequest) =>
  api.post('/login', loginData);

// Réinitialisation du mot de passe
export const resetPassword = (resetData: ResetPasswordRequestDto) =>
  api.patch('/resetPassword', resetData);
