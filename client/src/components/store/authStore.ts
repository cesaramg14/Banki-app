import { create } from 'zustand';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string, remember?: boolean) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token') || sessionStorage.getItem('token'),
  setAuth: (user, token, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', token);
    set({ user, token });
  },
  updateUser: (user) => {
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));