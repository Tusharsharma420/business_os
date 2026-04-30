import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../api/client.js';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      await SecureStore.setItemAsync('user_token', token);
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('user_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (token) {
        // Optionally verify token with backend
        set({ token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
