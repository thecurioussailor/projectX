import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// User interface
export interface User {
  id: number;
  username: string;
  role: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  signin: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Token persistence
  setToken: (token: string) => void;
  getToken: () => string | null;
}

// Create auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Sign in function
  signin: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`, {
        username,
        password
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.data?.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        
        // Update state
        set({ 
          isAuthenticated: true, 
          user: data.data.user, 
          token: data.data.token,
          isLoading: false,
          error: null 
        });
        
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || 
                     (error instanceof Error ? error.message : 'Login failed');
      set({ isLoading: false, error: message });
      return false;
    }
  },

  // Sign up function
  signup: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
        username,
        password
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || 'Signup failed');
      }

      if (data.success && data.data?.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        
        // Update state
        set({ 
          isAuthenticated: true, 
          user: data.data.user, 
          token: data.data.token,
          isLoading: false,
          error: null 
        });
        
        return true;
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || 
                     (error instanceof Error ? error.message : 'Signup failed');
      set({ isLoading: false, error: message });
      return false;
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Set token
  setToken: (token: string) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },

  // Get token
  getToken: () => {
    return get().token;
  },
})); 