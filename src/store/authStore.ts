import { create } from 'zustand';


const roleMap: { [key: string]: string } = {
  'ETUDIANT': 'STUDENT',
  'ENSEIGNANT': 'TEACHER',
  'ENTREPRISE': 'ENTERPRISE',
  'ADMIN': 'ADMIN',
  'STUDENT': 'STUDENT',
  'TEACHER': 'TEACHER',
  'ENTERPRISE': 'ENTERPRISE',
};

interface AuthState {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
  sync: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  role: (() => {
    const role = localStorage.getItem('role');
    if (!role) return null;
    const roleMap = {
      'ETUDIANT': 'STUDENT',
      'ENSEIGNANT': 'TEACHER',
      'ENTREPRISE': 'ENTERPRISE',
      'ADMIN': 'ADMIN',
      'STUDENT': 'STUDENT',
      'TEACHER': 'TEACHER',
      'ENTERPRISE': 'ENTERPRISE',
    };
    return roleMap[role.toUpperCase()] || role.toUpperCase();
  })(),
  login: (token, role) => {
    const roleMap = {
      'ETUDIANT': 'STUDENT',
      'ENSEIGNANT': 'TEACHER',
      'ENTREPRISE': 'ENTERPRISE',
      'ADMIN': 'ADMIN',
      'STUDENT': 'STUDENT',
      'TEACHER': 'TEACHER',
      'ENTERPRISE': 'ENTERPRISE',
    };
    const roleUpper = role ? roleMap[role.toUpperCase()] || role.toUpperCase() : '';
    localStorage.setItem('token', token);
    localStorage.setItem('role', roleUpper);
    set({ token, role: roleUpper });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ token: null, role: null });
  },
  sync: () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const roleMap = {
      'ETUDIANT': 'STUDENT',
      'ENSEIGNANT': 'TEACHER',
      'ENTREPRISE': 'ENTERPRISE',
      'ADMIN': 'ADMIN',
      'STUDENT': 'STUDENT',
      'TEACHER': 'TEACHER',
      'ENTERPRISE': 'ENTERPRISE',
    };
    set({ token, role: role ? roleMap[role.toUpperCase()] || role.toUpperCase() : null });
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
