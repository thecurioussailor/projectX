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
    fetchPublicChannelBySlug: storeFetchPublicChannelBySlug,    
    updateChannel: storeUpdateChannel,
    publishChannel: storePublishChannel,
    unpublishChannel: storeUnpublishChannel,
    deleteChannel: storeDeleteChannel,
    setCurrentChannel,
    createPlan: storeCreatePlan,
    fetchPlans: storeFetchPlans,
    fetchPlanById: storeFetchPlanById,
    updatePlan: storeUpdatePlan,
    deletePlan: storeDeletePlan,
    setCurrentPlan,
    subscribeToPlan: storeSubscribeToPlan,
    initiateSubscription: storeInitiateSubscription,
    getOrderStatus: storeGetOrderStatus,
    handlePaymentCallback: storeHandlePaymentCallback
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
  const createChannel = useCallback(async (channelName: string, channelDescription: string, telegramNumber: string) => {
    if (!token) {
      throw new Error('You must be logged in to create a channel');
    }
    return storeCreateChannel(channelName, channelDescription, telegramNumber);
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
  
  const fetchPublicChannelBySlug = useCallback(async (slug: string) => {
    if (!token) {
      throw new Error('You must be logged in to fetch a public channel');
    }
    return storeFetchPublicChannelBySlug(slug);
  }, [token, storeFetchPublicChannelBySlug]);
  
  const updateChannel = useCallback(async (channelId: string, data: { botAdded: boolean }) => {
    if (!token) {
      throw new Error('You must be logged in to update a channel');
    }
    return storeUpdateChannel(channelId, data);
  }, [token, storeUpdateChannel]);

  const publishChannel = useCallback(async (channelId: string) => {
    if (!token) {
      throw new Error('You must be logged in to publish a channel');
    }
    return storePublishChannel(channelId);
  }, [token, storePublishChannel]);

  const unpublishChannel = useCallback(async (channelId: string) => {
    if (!token) {
      throw new Error('You must be logged in to unpublish a channel');
    }
    return storeUnpublishChannel(channelId);
  }, [token, storeUnpublishChannel]);
  
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

  // Subscription methods with authentication check
  const subscribeToPlan = useCallback(async (channelId: string, planId: string) => {
    if (!token) {
      throw new Error('You must be logged in to subscribe to a plan');
    }
    return storeSubscribeToPlan(channelId, planId);
  }, [token, storeSubscribeToPlan]); 
  
  const initiateSubscription = useCallback(async (channelId: string, planId: string) => {
    if (!token) {
      throw new Error('You must be logged in to subscribe to a plan');
    }
    return storeInitiateSubscription(channelId, planId);
  }, [token, storeInitiateSubscription]);  
  
  const getOrderStatus = useCallback(async (orderId: string) => {
    if (!token) {
      throw new Error('You must be logged in to check order status');
    }
    return storeGetOrderStatus(orderId);
    }, [token, storeGetOrderStatus]);

  const handlePaymentCallback = useCallback(async (orderId: string, productType: string) => {
    if (!token) {
      throw new Error('You must be logged in to handle payment callback');
    }
    return storeHandlePaymentCallback(orderId, productType);
  }, [token, storeHandlePaymentCallback]);
  
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
    fetchPublicChannelBySlug,
    updateChannel,
    publishChannel,
    unpublishChannel,
    deleteChannel,
    setCurrentChannel,
    
    // Plan methods
    createPlan,
    fetchPlans,
    fetchPlanById,
    updatePlan,
    deletePlan,
    setCurrentPlan,
    subscribeToPlan,
    initiateSubscription,
    getOrderStatus,
    handlePaymentCallback
  };
}; 