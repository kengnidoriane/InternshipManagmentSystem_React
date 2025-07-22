import { create } from 'zustand';

interface AuthState {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  login: (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    set({ token, role });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ token: null, role: null });
  }
}));

// Synchronisation multi-onglets (logout/login partout)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'token' || event.key === 'role') {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      useAuthStore.setState({ token, role });
    }
  });
}


// Listen to storage events for multi-tab sync
type WindowWithAddEventListener = Window & typeof globalThis;
if (typeof window !== 'undefined') {
  (window as WindowWithAddEventListener).addEventListener('storage', () => {
    useAuthStore.getState().sync();
  });
}
