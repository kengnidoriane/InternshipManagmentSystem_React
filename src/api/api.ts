import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // utile si tu utilises des cookies/session
});

// Interceptor pour ajouter le token Authorization à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
