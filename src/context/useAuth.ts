import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { token, role, login, logout } = useAuthStore();
  return { token, role, login, logout };
}