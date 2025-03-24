import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL;

// Setup axios instance with auth header
const api = axios.create({
  baseURL: `${API_URL}/links`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Link interfaces
export interface Link {
  id: string;
  originalUrl: string;
  shortId: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface LinkStats {
  originalUrl: string;
  shortUrl: string;
  shortId: string;
  clicks: number;
  createdAt: string;
}

// Link service functions
export const linkService = {
  // Create a new short link
  createLink: async (originalUrl: string): Promise<Link> => {
    try {
      const response = await api.post('/', { originalUrl });
      return response.data.data;
    } catch (error) {
      console.error('Error creating link:', error);
      throw error;
    }
  },

  // Get all links for current user
  getUserLinks: async (): Promise<Link[]> => {
    try {
      const response = await api.get('/');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user links:', error);
      throw error;
    }
  },

  // Get statistics for a link
  getLinkStats: async (shortId: string): Promise<LinkStats> => {
    try {
      const response = await api.get(`/stats/${shortId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching link stats:', error);
      throw error;
    }
  },

  // Get full shortlink URL from shortId
  getShortLink: (shortId: string): string => {
    return `${API_URL}/links/${shortId}`;
  }
}; 