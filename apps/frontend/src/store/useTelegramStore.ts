import axios from 'axios';
import { create } from 'zustand';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Define Telegram Account interface
export interface TelegramAccount {
  id: string;
  telegramNumber: string;
  authenticated: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define Channel interface
export interface TelegramChannel {
  id: string;
  channelId: string;
  channelName: string;
  channelDescription: string;
  telegramNumber: string;
  botAdded: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  telegramAccountId: string;
  telegramPlans: TelegramPlan[];
}

// Define Plan interface
export interface TelegramPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  telegramChannelId: string;
  subscriptions: TelegramSubscription[];
}

// Define Subscription interface
export interface TelegramSubscription {
  id: string;
  planId: string;
  userId: string;
  telegramUsername: string;
  planName: string;
  planPrice: number;
  planDuration: number;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED';
  createdAt: string;
}

// Define PublicChannel interface for shareable page
export interface PublicChannel {
  id: string;
  channelName: string;
  channelDescription: string;
  createdAt: string;
  plans: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
}

// Define store state interface
interface TelegramState {
  accounts: TelegramAccount[];
  channels: TelegramChannel[];
  currentChannel: TelegramChannel | null;
  plans: TelegramPlan[];
  currentPlan: TelegramPlan | null;
  isLoading: boolean;
  error: string | null;
  
  // Auth methods
  sendOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (code: string, phoneNumber: string) => Promise<void>;
  getAccounts: () => Promise<void>;
  // Channel methods
  createChannel: (channelName: string, channelDescription: string, telegramNumber: string) => Promise<TelegramChannel>;
  fetchChannels: () => Promise<void>;
  fetchChannelById: (channelId: string) => Promise<void>;
  fetchPublicChannelBySlug: (slug: string) => Promise<PublicChannel>;
  updateChannel: (channelId: string, data: { botAdded: boolean }) => Promise<void>;
  publishChannel: (channelId: string) => Promise<void>;
  deleteChannel: (channelId: string) => Promise<void>;
  setCurrentChannel: (channel: TelegramChannel | null) => void;
  
  // Plan methods
  createPlan: (channelId: string, data: { name: string, price: number, duration: number }) => Promise<void>;
  fetchPlans: (channelId: string) => Promise<void>;
  fetchPlanById: (planId: string) => Promise<void>;
  updatePlan: (planId: string, data: { name?: string, price?: number, duration?: number, status?: 'ACTIVE' | 'INACTIVE' }) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  setCurrentPlan: (plan: TelegramPlan | null) => void;
}

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

// Create Telegram store
export const useTelegramStore = create<TelegramState>((set, get) => ({
  accounts: [],
  channels: [],
  currentChannel: null,
  plans: [],
  currentPlan: null,
  isLoading: false,
  error: null,
  
  // Auth methods
  sendOtp: async (phoneNumber: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/api/v1/telegram/send-otp', { phoneNumber });
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send OTP', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  verifyOtp: async (code: string, phoneNumber: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/telegram/verify-otp', { code, phoneNumber });
      set({ 
        accounts: get().accounts.map(account => 
          account.telegramNumber === phoneNumber 
            ? { ...account, authenticated: true } 
            : account
        ),
        isLoading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to verify OTP', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  getAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/telegram/accounts');
      set({ 
        accounts: response.data.data, 
        isLoading: false 
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to get accounts', isLoading: false });
    }
  },
  
  // Channel methods
  createChannel: async (channelName: string, channelDescription: string, telegramNumber: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/telegram/channels', { channelName, channelDescription, telegramNumber });
      const newChannel = response.data.data;
      set(state => ({ 
        channels: [...state.channels, newChannel],
        currentChannel: newChannel,
        isLoading: false 
      }));
      return newChannel;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create channel', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  fetchChannels: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/telegram/channels');
      set({ 
        channels: response.data.data, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch channels', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  fetchChannelById: async (channelId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/telegram/channels/${channelId}`);
      const channel = response.data.data;
      set({ 
        currentChannel: channel,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch channel', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  fetchPublicChannelBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/telegram/public/channels/${slug}`);
      const channel = response.data.data;
      set({ isLoading: false });
      return channel;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch channel', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateChannel: async (channelId: string, data: { botAdded: boolean }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/telegram/channels/${channelId}`, data);
      const updatedChannel = response.data.data;
      
      set(state => ({
        channels: state.channels.map(ch => 
          ch.id === channelId ? updatedChannel : ch
        ),
        currentChannel: state.currentChannel?.id === channelId 
          ? updatedChannel 
          : state.currentChannel,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update channel', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  publishChannel: async (channelId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/api/v1/telegram/channels/${channelId}/publish`);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to publish channel', 
        isLoading: false 
      });
      throw error;
    }
  },
  deleteChannel: async (channelId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/telegram/channels/${channelId}`);
      
      set(state => ({
        channels: state.channels.filter(ch => ch.id !== channelId),
        currentChannel: state.currentChannel?.id === channelId 
          ? null 
          : state.currentChannel,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete channel', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  setCurrentChannel: (channel) => {
    set({ currentChannel: channel });
  },
  
  // Plan methods
  createPlan: async (channelId: string, data: { name: string, price: number, duration: number }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/telegram/channels/${channelId}/plans`, data);
      const newPlan = response.data.data;
      
      set(state => ({
        plans: [...state.plans, newPlan],
        currentPlan: newPlan,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create plan', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  fetchPlans: async (channelId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/telegram/channels/${channelId}/plans`);
      set({ 
        plans: response.data.data, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch plans', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  fetchPlanById: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/telegram/plans/${planId}`);
      const plan = response.data.data;
      set({ 
        currentPlan: plan,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch plan', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updatePlan: async (planId: string, data: { name?: string, price?: number, duration?: number, status?: 'ACTIVE' | 'INACTIVE' }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/telegram/plans/${planId}`, data);
      const updatedPlan = response.data.data;
      
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === planId ? updatedPlan : plan
        ),
        currentPlan: state.currentPlan?.id === planId 
          ? updatedPlan 
          : state.currentPlan,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update plan', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deletePlan: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/telegram/plans/${planId}`);
      
      set(state => ({
        plans: state.plans.filter(plan => plan.id !== planId),
        currentPlan: state.currentPlan?.id === planId 
          ? null 
          : state.currentPlan,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete plan', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  setCurrentPlan: (plan) => {
    set({ currentPlan: plan });
  }
})); 