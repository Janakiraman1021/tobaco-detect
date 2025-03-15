import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  role: 'admin' | 'data-entry' | null;
  login: (role: 'admin' | 'data-entry') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  login: (role) => set({ isAuthenticated: true, role }),
  logout: () => set({ isAuthenticated: false, role: null }),
}));