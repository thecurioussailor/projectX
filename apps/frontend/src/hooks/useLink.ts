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
    clearCurrentLink 
  } = useLinkStore();

  const createLink = useCallback(async (url: string): Promise<Link | null> => {
    if (!token) {
      throw new Error('You must be logged in to create links');
    }
    return storeCreateLink(url);
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

  return {
    links,
    currentLink,
    isLoading,
    error,
    createLink,
    fetchLinks,
    fetchLinkStats,
    clearCurrentLink,
  };
};
