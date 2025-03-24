import { create } from 'zustand';
import { Link, linkService } from '../services/linkService';

interface LinkState {
  links: Link[];
  currentLink: Link | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createLink: (url: string) => Promise<Link | null>;
  fetchLinks: () => Promise<void>;
  fetchLinkStats: (shortId: string) => Promise<void>;
  clearCurrentLink: () => void;
}

export const useLinkStore = create<LinkState>((set, get) => ({
  links: [],
  currentLink: null,
  isLoading: false,
  error: null,

  // Create a new shortened link
  createLink: async (url: string) => {
    set({ isLoading: true, error: null });
    try {
      const link = await linkService.createLink(url);
      set((state) => ({ 
        links: [link, ...state.links],
        currentLink: link,
        isLoading: false 
      }));
      return link;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create link';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  // Fetch all links for the current user
  fetchLinks: async () => {
    set({ isLoading: true, error: null });
    try {
      const links = await linkService.getUserLinks();
      set({ links, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch links';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Fetch statistics for a specific link
  fetchLinkStats: async (shortId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await linkService.getLinkStats(shortId);
      
      // Find the link in the current list and update its click count
      const links = get().links.map(link => 
        link.shortId === shortId 
          ? { ...link, clicks: stats.clicks } 
          : link
      );
      
      // Find the full link object
      const currentLink = links.find(link => link.shortId === shortId) || null;
      
      set({ links, currentLink, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch link statistics';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Clear the current link
  clearCurrentLink: () => {
    set({ currentLink: null });
  }
})); 