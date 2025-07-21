import axios from 'axios';

export interface LoginResponse {
  token: string;
  // Ajoute d'autres champs si besoin (ex: user info)
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>('http://localhost:8080/api/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch {
    // On peut améliorer la gestion d'erreur ici
    throw new Error('Identifiants incorrects');
  }
} 