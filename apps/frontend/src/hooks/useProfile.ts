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
    profilePictureUrl,
    coverPictureUrl,    
    isLoading, 
    error, 
    fetchProfile: storeFetchProfile,
    updateProfile: storeUpdateProfile,
    // profilePicture methods
    getProfilePicture: storeGetProfilePicture,
    getProfileUploadUrl: storeGetProfileUploadUrl,
    updateProfilePicture: storeUpdateProfilePicture,
   
    // coverPicture methods
    getCoverUploadUrl: storeGetCoverUploadUrl,
    getCoverPicture: storeGetCoverPicture,
    updateCoverPicture: storeUpdateCoverPicture
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

  const getProfilePicture = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to get profile picture');
    }
    return storeGetProfilePicture();
  }, [token, storeGetProfilePicture]);      

  const getCoverPicture = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to get cover picture');
    }
    return storeGetCoverPicture();
  }, [token, storeGetCoverPicture]);

  const getProfileUploadUrl = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to get profile upload url');
    }
    return storeGetProfileUploadUrl();
  }, [token, storeGetProfileUploadUrl]);    

  const updateProfilePicture = useCallback(async (s3key: string) => {
    if (!token) {
      throw new Error('You must be logged in to update profile picture');
    }
    return storeUpdateProfilePicture(s3key);
  }, [token, storeUpdateProfilePicture]);
  
  const getCoverUploadUrl = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to get cover upload url');
    }
    return storeGetCoverUploadUrl();
  }, [token, storeGetCoverUploadUrl]);    
  

  const updateCoverPicture = useCallback(async (s3key: string) => {
    if (!token) {
      throw new Error('You must be logged in to update cover picture');
    }
    return storeUpdateCoverPicture(s3key);
  }, [token, storeUpdateCoverPicture]);

  /**
   * Combined method to handle the complete profile picture update flow:
   * 1. Get the presigned URL
   * 2. Upload the image to S3
   * 3. Update the profile picture reference in the database
   */
  const uploadAndUpdateProfilePicture = useCallback(async (file: File) => {
    if (!token) {
      throw new Error('You must be logged in to update profile picture');
    }
    
    // Step 1: Get the presigned URL
    const result = await storeGetProfileUploadUrl();
    if (!result) {
      throw new Error('Failed to get upload URL');
    }
    
    const { uploadUrl, s3key } = result;
    
    // Step 2: Upload the file to the presigned URL
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    // Step 3: Update the profile picture record in the database
    await storeUpdateProfilePicture(s3key);
    
    // Step 4: Refresh the profile picture URL
    return getProfilePicture();
  }, [token, storeGetProfileUploadUrl, storeUpdateProfilePicture, getProfilePicture]);

  /**
   * Combined method to handle the complete cover picture update flow:
   * 1. Get the presigned URL
   * 2. Upload the image to S3
   * 3. Update the cover picture reference in the database
   */
  const uploadAndUpdateCoverPicture = useCallback(async (file: File) => {
    if (!token) {
      throw new Error('You must be logged in to update cover picture');
    }
    
    // Step 1: Get the presigned URL
    const result = await storeGetCoverUploadUrl();
    if (!result) {
      throw new Error('Failed to get upload URL');
    }
    
    const { uploadUrl, s3key } = result;
    
    // Step 2: Upload the file to the presigned URL
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    // Step 3: Update the cover picture record in the database
    await storeUpdateCoverPicture(s3key);
    
    // Step 4: Refresh the cover picture URL
    return getCoverPicture();
  }, [token, storeGetCoverUploadUrl, storeUpdateCoverPicture, getCoverPicture]);

  // Fetch profile data on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch && !profile && !isLoading && token) {
      fetchProfile();
    }
  }, [autoFetch, profile, isLoading, token, fetchProfile]);

  // Fetch profile and cover pictures when profile is loaded
  useEffect(() => {
    if (profile && token) {
      getProfilePicture();
      getCoverPicture();
    }
  }, [profile, token, getProfilePicture, getCoverPicture]);

  return { 
    profile, 
    profilePictureUrl,
    coverPictureUrl,
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile,
    getProfilePicture,
    getCoverPicture,
    getProfileUploadUrl,
    getCoverUploadUrl,
    updateProfilePicture,
    updateCoverPicture,
    uploadAndUpdateProfilePicture,
    uploadAndUpdateCoverPicture
  };
}; 