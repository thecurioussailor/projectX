import { useCallback } from 'react';
import { useTelegramStore } from '../store/useTelegramStore';
import { useAuthStore } from '../store/useAuthStore';

// Define a proper interface matching the one in useTelegramStore
interface TelegramSubscriber {
  id: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
  };
  status: string;
  plan: {
    id: string;
    name: string;
    price: number;
    createdAt: string;
    expiryDate: string;
  };
  createdAt: string;
  expiryDate: string;
}

/**
 * Custom hook for Telegram functionality with authentication checks
 * @returns Telegram functionality with authentication
 */
export function useTelegram() {
  const { token } = useAuthStore();
  
  const {
    accounts,
    channels,
    currentChannel,
    plans,
    currentPlan,
    subscribers: storeSubscribers,
    isLoading,
    error,
    
    // Store methods
    sendOtp: storeSendOtp,
    verifyOtp: storeVerifyOtp,
    getAccounts: storeGetAccounts,
    deleteAccount: storeDeleteAccount,
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
    handlePaymentCallback: storeHandlePaymentCallback,
    fetchChannelSubscribers: storeFetchChannelSubscribers,
    
    // Banner methods
    getBannerUploadUrl: storeGetBannerUploadUrl,
    uploadBannerToS3: storeUploadBannerToS3,
    uploadChannelBanner: storeUploadChannelBanner,
    getChannelBanner: storeGetChannelBanner,
    deleteChannelBanner: storeDeleteChannelBanner
  } = useTelegramStore();
  
  // Cast subscribers to our local type to avoid naming conflicts
  const subscribers = storeSubscribers as unknown as TelegramSubscriber[];

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

  const deleteAccount = useCallback(async (accountId: string) => {
    if (!token) {
      throw new Error('You must be logged in to delete an account');
    }
    return storeDeleteAccount(accountId);
  }, [token, storeDeleteAccount]);

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
  
  const updateChannel = useCallback(async (channelId: string, data: { richDescription: string}) => {
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

  // Subscriber methods with authentication check
  const fetchChannelSubscribers = useCallback(async (channelId: string) => {
    if (!token) {
      throw new Error('You must be logged in to fetch channel subscribers');
    }
    return storeFetchChannelSubscribers(channelId);
  }, [token, storeFetchChannelSubscribers]);

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
  
  // Banner methods with authentication check
  const getBannerUploadUrl = useCallback(async (channelId: string, fileName: string, fileType: string) => {
    if (!token) {
      throw new Error('You must be logged in to get banner upload URL');
    }
    return storeGetBannerUploadUrl(channelId, fileName, fileType);
  }, [token, storeGetBannerUploadUrl]);

  const uploadBannerToS3 = useCallback(async (url: string, file: File) => {
    if (!token) {
      throw new Error('You must be logged in to upload banner');
    }
    return storeUploadBannerToS3(url, file);
  }, [token, storeUploadBannerToS3]);

  const uploadChannelBanner = useCallback(async (channelId: string, s3Key: string) => {
    if (!token) {
      throw new Error('You must be logged in to upload channel banner');
    }
    return storeUploadChannelBanner(channelId, s3Key);
  }, [token, storeUploadChannelBanner]);

  const getChannelBanner = useCallback(async (channelId: string) => {
    if (!token) {
      throw new Error('You must be logged in to get channel banner');
    }
    return storeGetChannelBanner(channelId);
  }, [token, storeGetChannelBanner]);

  const deleteChannelBanner = useCallback(async (channelId: string) => {
    if (!token) {
      throw new Error('You must be logged in to delete channel banner');
    }
    return storeDeleteChannelBanner(channelId);
  }, [token, storeDeleteChannelBanner]);

  // Helper for complete banner upload process
  const uploadBanner = async (channelId: string, file: File) => {
    try {
      console.log("uploadBanner", channelId, file);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      // Step 1: Get upload URL
      const { uploadUrl, s3Key } = await getBannerUploadUrl(
        channelId, 
        file.name, 
        file.type
      );
      
      // Step 2: Upload file to S3
      await uploadBannerToS3(uploadUrl, file);

      // Step 3: Save banner reference in database
      const updatedChannel = await uploadChannelBanner(channelId, s3Key);
      
      // Return the updated channel
      return updatedChannel;
    } catch (error) {
      console.error("Error uploading banner:", error);
      throw error;
    }
  };
  
  return {
    // State
    accounts,
    channels,
    currentChannel,
    plans,
    currentPlan,
    subscribers,
    isLoading,
    error,
    
    // Auth methods
    sendOtp,
    verifyOtp,
    getAccounts,
    deleteAccount,
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
    
    // Banner methods
    getBannerUploadUrl,
    uploadBannerToS3,
    uploadChannelBanner,
    getChannelBanner,
    deleteChannelBanner,
    uploadBanner,
    
    // Plan methods
    createPlan,
    fetchPlans,
    fetchPlanById,
    updatePlan,
    deletePlan,
    setCurrentPlan,
    
    // Subscription methods
    subscribeToPlan,
    initiateSubscription,
    getOrderStatus,
    handlePaymentCallback,
    
    // Subscriber methods
    fetchChannelSubscribers
  };
} 