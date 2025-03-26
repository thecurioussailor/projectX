import { useCallback } from 'react';
import { useTelegramStore } from '../store/useTelegramStore';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Custom hook for Telegram functionality with authentication checks
 */
export const useTelegram = () => {
  const { token } = useAuthStore();
  
  const {
    accounts,
    channels,
    currentChannel,
    plans,
    currentPlan,
    isLoading,
    error,
    
    // Store methods
    sendOtp: storeSendOtp,
    verifyOtp: storeVerifyOtp,
    getAccounts: storeGetAccounts,
    createChannel: storeCreateChannel,
    fetchChannels: storeFetchChannels,
    fetchChannelById: storeFetchChannelById,
    updateChannel: storeUpdateChannel,
    deleteChannel: storeDeleteChannel,
    setCurrentChannel,
    createPlan: storeCreatePlan,
    fetchPlans: storeFetchPlans,
    fetchPlanById: storeFetchPlanById,
    updatePlan: storeUpdatePlan,
    deletePlan: storeDeletePlan,
    setCurrentPlan
  } = useTelegramStore();
  
  // Auth methods with authentication check
  const sendOtp = useCallback(async (phoneNumber: string) => {
    if (!token) {
      throw new Error('You must be logged in to send OTP');
    }
    return storeSendOtp(phoneNumber);
  }, [token, storeSendOtp]);
  
  const verifyOtp = useCallback(async (code: string, phoneNumber: string) => {
    if (!token) {
      throw new Error('You must be logged in to verify OTP');
    }
    return storeVerifyOtp(code, phoneNumber);
  }, [token, storeVerifyOtp]);
  
  const getAccounts = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to get account');
    }
    return storeGetAccounts();
  }, [token, storeGetAccounts]);
  // Channel methods with authentication check
  const createChannel = useCallback(async (channelName: string, channelDescription: string) => {
    if (!token) {
      throw new Error('You must be logged in to create a channel');
    }
    return storeCreateChannel(channelName, channelDescription);
  }, [token, storeCreateChannel]);
  
  const fetchChannels = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to fetch channels');
    }
    return storeFetchChannels();
  }, [token, storeFetchChannels]);
  
  const fetchChannelById = useCallback(async (channelId: string) => {
    if (!token) {
      throw new Error('You must be logged in to fetch a channel');
    }
    return storeFetchChannelById(channelId);
  }, [token, storeFetchChannelById]);
  
  const updateChannel = useCallback(async (channelId: string, data: { botAdded: boolean }) => {
    if (!token) {
      throw new Error('You must be logged in to update a channel');
    }
    return storeUpdateChannel(channelId, data);
  }, [token, storeUpdateChannel]);
  
  const deleteChannel = useCallback(async (channelId: string) => {
    if (!token) {
      throw new Error('You must be logged in to delete a channel');
    }
    return storeDeleteChannel(channelId);
  }, [token, storeDeleteChannel]);
  
  // Plan methods with authentication check
  const createPlan = useCallback(async (channelId: string, data: { name: string, price: number, duration: number }) => {
    if (!token) {
      throw new Error('You must be logged in to create a plan');
    }
    return storeCreatePlan(channelId, data);
  }, [token, storeCreatePlan]);
  
  const fetchPlans = useCallback(async (channelId: string) => {
    if (!token) {
      throw new Error('You must be logged in to fetch plans');
    }
    return storeFetchPlans(channelId);
  }, [token, storeFetchPlans]);
  
  const fetchPlanById = useCallback(async (planId: string) => {
    if (!token) {
      throw new Error('You must be logged in to fetch a plan');
    }
    return storeFetchPlanById(planId);
  }, [token, storeFetchPlanById]);
  
  const updatePlan = useCallback(async (planId: string, data: { name?: string, price?: number, duration?: number, status?: 'ACTIVE' | 'INACTIVE' }) => {
    if (!token) {
      throw new Error('You must be logged in to update a plan');
    }
    return storeUpdatePlan(planId, data);
  }, [token, storeUpdatePlan]);
  
  const deletePlan = useCallback(async (planId: string) => {
    if (!token) {
      throw new Error('You must be logged in to delete a plan');
    }
    return storeDeletePlan(planId);
  }, [token, storeDeletePlan]);
  
  return {
    // State
    accounts,
    channels,
    currentChannel,
    plans,
    currentPlan,
    isLoading,
    error,
    
    // Auth methods
    sendOtp,
    verifyOtp,
    getAccounts,
    // Channel methods
    createChannel,
    fetchChannels,
    fetchChannelById,
    updateChannel,
    deleteChannel,
    setCurrentChannel,
    
    // Plan methods
    createPlan,
    fetchPlans,
    fetchPlanById,
    updatePlan,
    deletePlan,
    setCurrentPlan
  };
}; 