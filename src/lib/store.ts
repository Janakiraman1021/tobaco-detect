import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: {
    email: string;
    role: 'admin' | 'data-entry';
  } | null;
  login: (token: string, user: { email: string; role: 'admin' | 'data-entry' }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null })
}));