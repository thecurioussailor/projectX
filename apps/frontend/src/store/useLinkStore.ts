import { create } from 'zustand';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

interface LinkState {
  links: Link[];
  currentLink: Link | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createLink: (url: string, customShortId?: string) => Promise<Link | null>;
  fetchLinks: () => Promise<void>;
  fetchLinkStats: (shortId: string) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  clearCurrentLink: () => void;
}

export const useLinkStore = create<LinkState>((set, get) => ({
  links: [],
  currentLink: null,
  isLoading: false,
  error: null,

  // Create a new shortened link
  createLink: async (url: string, customShortId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/links', { originalUrl: url, customShortId });
      const link = response.data.data;
      set((state) => ({ 
        links: [link, ...state.links],
        currentLink: link,
        isLoading: false 
      }));
      return link;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create link';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  // Fetch all links for the current user
  fetchLinks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/links');
      const links = response.data.data;
      set({ links, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch links';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Fetch statistics for a specific link
  fetchLinkStats: async (shortId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/links/stats/${shortId}`);
      const stats = response.data.data;

      // Find the link in the current list and update its click count
      const links = get().links.map(link => 
        link.shortId === shortId 
          ? { ...link, clicks: stats.clicks } 
          : link
      );
      
      // Find the full link object
      const currentLink = links.find(link => link.shortId === shortId) || null;
      
      set({ links, currentLink, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch link statistics';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Clear the current link
  clearCurrentLink: () => {
    set({ currentLink: null });
  },

  // Delete a link
  deleteLink: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/links/${id}`);
      set((state) => ({
        links: state.links.filter((link) => link.id !== id),
        isLoading: false,
      }));
    } catch (error: unknown) {  
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete link';
      set({ error: errorMessage, isLoading: false });
    }
  },    
})); 