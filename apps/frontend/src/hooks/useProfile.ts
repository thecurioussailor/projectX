import { useEffect, useCallback } from 'react';
import { useProfileStore, UpdateProfileData } from '../store/useProfileStore';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Custom hook for profile data with automatic loading
 * @param autoFetch Whether to fetch profile data automatically on mount
 */
export const useProfile = (autoFetch = true) => {
  const { token } = useAuthStore();
  const { 
    profile, 
    isLoading, 
    error, 
    fetchProfile: storeFetchProfile, 
    updateProfile: storeUpdateProfile 
  } = useProfileStore();

  const fetchProfile = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to fetch profile');
    }
    return storeFetchProfile();
  }, [token, storeFetchProfile]);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!token) {
      throw new Error('You must be logged in to update profile');
    }
    return storeUpdateProfile(data);
  }, [token, storeUpdateProfile]);

  useEffect(() => {
    if (autoFetch && !profile && !isLoading && token) {
      fetchProfile();
    }
  }, [autoFetch, profile, isLoading, token, fetchProfile]);

  return { 
    profile, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile 
  };
}; 