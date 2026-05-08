import {create} from 'zustand';
import * as SecureStore from 'expo-secure-store';
import * as api from '@/services/api';
import type {UserProfile} from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      try {
        const {data} = await api.getProfile();
        set({isAuthenticated: true, token, user: data});
      } catch {
        await SecureStore.deleteItemAsync('auth_token');
        set({isAuthenticated: false, token: null});
      }
    }
  },

  login: async (email, password) => {
    set({isLoading: true, error: null});
    try {
      const {data} = await api.login(email, password);
      await SecureStore.setItemAsync('auth_token', data.accessToken);
      set({
        isAuthenticated: true,
        token: data.accessToken,
        user: data.user,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Login failed';
      set({isLoading: false, error: msg});
      throw new Error(msg);
    }
  },

  register: async (name, email, password) => {
    set({isLoading: true, error: null});
    try {
      const {data} = await api.register(name, email, password);
      await SecureStore.setItemAsync('auth_token', data.accessToken);
      set({
        isAuthenticated: true,
        token: data.accessToken,
        user: data.user,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Registration failed';
      set({isLoading: false, error: msg});
      throw new Error(msg);
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    set({isAuthenticated: false, token: null, user: null});
  },

  clearError: () => set({error: null}),
}));
