import { create } from 'zustand';

interface AuthState {
  token: string | null;
  role: 'admin' | 'data-entry' | null;
  userId: string | null;
  login: (token: string, role: 'admin' | 'data-entry', userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  userId: null,
  login: (token, role, userId) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
    set({ token, role, userId });
  },
  logout: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    set({ token: null, role: null, userId: null });
  }
}));