import { useEffect } from 'react';
import { useProfileStore } from '../store/useProfileStore';

/**
 * Custom hook for profile data with automatic loading
 * @param autoFetch Whether to fetch profile data automatically on mount
 */
export const useProfile = (autoFetch = true) => {
  const { 
    profile, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile 
  } = useProfileStore();

  useEffect(() => {
    if (autoFetch && !profile && !isLoading) {
      fetchProfile();
    }
  }, [autoFetch, profile, isLoading, fetchProfile]);

  return { 
    profile, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile 
  };
}; 