import axios from 'axios';
import { create } from 'zustand';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Define profile interface based on API response
export interface ProfileData {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  profileImage: string;
  coverImage: string;
  location: string;
  emailVerified: boolean;
  wallet: string;
  createdAt: string;
}

// Define update profile interface
export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  coverImage?: string;
  location?: string;
}

// Define store state interface
interface ProfileState {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
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

// Create profile store
export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  // Fetch profile data
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/users/me');
      const data = response.data.data;
      set({ profile: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile', 
        isLoading: false 
      });
    }
  },

  // Update profile data
  updateProfile: async (data: UpdateProfileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/api/v1/users/me', data);
      const updatedData = response.data.data;
      
      set(state => ({
        profile: state.profile ? { ...state.profile, ...updatedData } : null,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile', 
        isLoading: false 
      });
    }
  }
})); 