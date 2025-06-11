import { useCallback } from 'react';
import { useLinkStore, Link } from '../store/useLinkStore';
import { useAuthStore } from '../store/useAuthStore';

export const useLink = () => {
  const { token } = useAuthStore();
  const { 
    links, 
    currentLink, 
    isLoading, 
    error, 
    createLink: storeCreateLink, 
    fetchLinks: storeFetchLinks, 
    fetchLinkStats: storeFetchLinkStats, 
    deleteLink: storeDeleteLink,
    clearCurrentLink 
  } = useLinkStore();

  const createLink = useCallback(async (url: string, customShortId?: string): Promise<Link | null> => {
    if (!token) {
      throw new Error('You must be logged in to create links');
    }
    return storeCreateLink(url, customShortId);
  }, [token, storeCreateLink]);

  const fetchLinks = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to fetch links');
    }
    return storeFetchLinks();
  }, [token, storeFetchLinks]);

  const fetchLinkStats = useCallback(async (shortId: string) => {
    return storeFetchLinkStats(shortId);
  }, [storeFetchLinkStats]);

  const deleteLink = useCallback(async (id: string) => {
    if (!token) {
      throw new Error('You must be logged in to delete links');
    }
    return storeDeleteLink(id);
  }, [token, storeDeleteLink]);

  return {
    links,
    currentLink,
    isLoading,
    error,
    createLink,
    fetchLinks,
    fetchLinkStats,
    clearCurrentLink,
    deleteLink,
  };
};
