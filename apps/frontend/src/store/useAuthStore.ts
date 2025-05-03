import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// User interface
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  loadUser: () => Promise<void>;
  // Auth actions
  signin: (username: string, password: string, loginMethod: 'email' | 'phone') => Promise<boolean>;
  signup: (email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;

  // Token persistence
  setToken: (token: string) => void;
  getToken: () => string | null;
}
// Create axios instance with default config
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
      'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await api.get(`/api/v1/users/me`);
      
      if (response.data.success) {
        set({ 
          user: response.data.data,
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      // If token is invalid, clear it
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
  // Sign in function
  signin: async (username: string, password: string, loginMethod: 'email' | 'phone') => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/auth/signin`, {
        username,
        loginMethod,  
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
  signup: async (email: string, phone: string, password: string) => {
    console.log(email, phone, password);
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/auth/signup`, {
        email,
        phone,
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

  updatePassword: async (oldPassword: string, newPassword: string, confirmPassword: string) => {
    set({ isLoading: true, error: null });
    try {
        const response = await api.post(`/api/v1/auth/update-password`, { oldPassword, newPassword, confirmPassword });
        return response.data.success;
    } catch (error) {
        console.error("Update password error:", error);
        set({ error: "Failed to update password" });
        return false;
    } finally {
        set({ isLoading: false });
    }
}
})); 