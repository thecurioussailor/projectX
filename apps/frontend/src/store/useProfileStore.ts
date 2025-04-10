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
  profilePictureUrl: string | null;
  coverPictureUrl: string | null; 
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;

  getProfileUploadUrl: ( fileName: string, fileType: string ) => Promise<{uploadUrl: string, s3key: string} | null>;
  getCoverUploadUrl: ( fileName: string, fileType: string ) => Promise<{uploadUrl: string, s3key: string} | null>;

  updateProfilePicture: (s3key: string) => Promise<void>;
  updateCoverPicture: (s3key: string) => Promise<void>;

  getProfilePicture: () => Promise<string | null>;
  getCoverPicture: () => Promise<string | null>;

  deleteProfilePicture: () => Promise<void>;
  deleteCoverPicture: () => Promise<void>;

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
  profilePictureUrl: null,
  coverPictureUrl: null,


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
  },
  getProfileUploadUrl: async (fileName, fileType) => {
    try {
      const response = await api.post('/api/v1/users/profilepicture', {
        fileName,
        fileType
      });
      return {
        uploadUrl: response.data.data.url,
        s3key: response.data.data.key
      };
    } catch (error) {
      console.error('Error fetching profile upload URL:', error);
      return null;
    }
  },
  getCoverUploadUrl: async (fileName, fileType) => {
    try {
      const response = await api.post('/api/v1/users/coverpicture', {
        fileName,
        fileType
      });
      return {
        uploadUrl: response.data.data.url,
        s3key: response.data.data.key
      };
    } catch (error) {
      console.error('Error fetching cover upload URL:', error);
      return null;
    }
  },
  updateProfilePicture: async (s3key: string) => {
    try {
      const response = await api.post('/api/v1/users/profilepicture/update', {
        s3key
      });
      return response.data.data.message;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      return null;
    }
  },
  updateCoverPicture: async (s3key: string) => {
    try {
      const response = await api.post('/api/v1/users/coverpicture/update', {
        s3key
      });
      return response.data.data.message;
    } catch (error) {
      console.error('Error updating cover picture:', error);
      return null;
    }
  },
  getProfilePicture: async () => {
    try {
      const response = await api.get('/api/v1/users/profilepicture');
      set({ profilePictureUrl: response.data.data.url });
      return response.data.data.url;
    } catch (error) {
      console.error('Error fetching profile picture:', error);  
      return null;
    }
  },
  getCoverPicture: async () => {
    try {
      const response = await api.get('/api/v1/users/coverpicture');
      console.log(response.data.data.url);
      set({ coverPictureUrl: response.data.data.url });
      return response.data.data.url;
    } catch (error) {
      console.error('Error fetching cover picture:', error);
      return null;
    }
  },
  deleteProfilePicture: async () => {
    try {
      const response = await api.post('/api/v1/users/profilepicture/delete');
      return response.data.data.url;  
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      return null;
    }
  },
  deleteCoverPicture: async () => {
    try { 
      const response = await api.post('/api/v1/users/coverpicture/delete');
      return response.data.data.url;
    } catch (error) {
      console.error('Error deleting cover picture:', error);
      return null;
    }
  } 
  
})); 