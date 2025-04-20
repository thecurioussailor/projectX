import axios from 'axios';
import { create } from 'zustand';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Define PlatformSubscriptionPlan interface
export interface PlatformSubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  annualPrice: number | null;
  isCustom: boolean;
  transactionFeePercentage: number;
  
  // Feature toggles
  maxDigitalProducts: number | null;
  maxTelegramSubscriptions: number | null;
  maxLinks: number | null;
  
  // Features enabled
  canSellDigitalProducts: boolean;
  canManageTelegramSubs: boolean;
  canUseUrlShortener: boolean;
  
  // Additional premium features
  hasCustomDomain: boolean;
  hasAdvancedAnalytics: boolean;
  hasPrioritySupport: boolean;
  
  // Plan status
  isActive: boolean;
  isDefault: boolean;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  
  // Relations
  userPlatformSubscriptions?: UserPlatformSubscription[];
}

// Define UserPlatformSubscription interface
export interface UserPlatformSubscription {
  id: string;
  userId: number;
  planId: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  trialEndDate: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  customFeePercentage: number | null;
  createdAt: string;
  updatedAt: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
  CANCELED = 'CANCELED',
  TRIALING = 'TRIALING',
  EXPIRED = 'EXPIRED'
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  ANNUALLY = 'ANNUALLY',
  LIFETIME = 'LIFETIME'
}

export interface PaymentSession {
  orderId: string;
  paymentSessionId: string;
}

export interface OrderStatus {
  orderId: string;
  status: string;
}

// Define store state interface
interface PlatformPlanState {
  plans: PlatformSubscriptionPlan[];
  currentPlan: PlatformSubscriptionPlan | null;
  userSubscription: UserPlatformSubscription | null;
  isLoading: boolean;
  error: string | null;
  
  // Admin methods
  fetchAllPlans: () => Promise<void>;
  fetchPlanById: (planId: string) => Promise<void>;
  createPlan: (planData: Partial<PlatformSubscriptionPlan>) => Promise<void>;
  updatePlan: (planId: string, planData: Partial<PlatformSubscriptionPlan>) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  
  // User methods
  fetchActivePlans: () => Promise<void>;
  fetchUserSubscription: () => Promise<void>;
  subscribeToPlan: (planId: string, billingCycle: BillingCycle) => Promise<PaymentSession>;
  getOrderStatus: (orderId: string) => Promise<OrderStatus>;
  cancelSubscription: () => Promise<void>;
  
  // State management
  setCurrentPlan: (plan: PlatformSubscriptionPlan | null) => void;
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

// Create platform plan store
export const usePlatformPlanStore = create<PlatformPlanState>((set, get) => ({
  plans: [],
  currentPlan: null,
  userSubscription: null,
  isLoading: false,
  error: null,
  
  // Admin methods
  fetchAllPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/admin/platform-subscription-plans');
      if (response.data.success) {
        set({ plans: response.data.data, isLoading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch plans', 
        isLoading: false 
      });
    }
  },
  
  fetchPlanById: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/admin/platform-subscription-plans/${planId}`);
      if (response.data.success) {
        set({ currentPlan: response.data.data, isLoading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch plan');
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch plan', 
        isLoading: false 
      });
    }
  },
  
  createPlan: async (planData: Partial<PlatformSubscriptionPlan>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/admin/platform-subscription-plans', planData);
      if (response.data.success) {
        set({ 
          plans: [...get().plans, response.data.data],
          isLoading: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to create plan');
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create plan', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updatePlan: async (planId: string, planData: Partial<PlatformSubscriptionPlan>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/admin/platform-subscription-plans/${planId}`, planData);
      if (response.data.success) {
        set({ 
          plans: get().plans.map(plan => plan.id === planId ? response.data.data : plan),
          currentPlan: response.data.data,
          isLoading: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
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
      const response = await api.delete(`/api/v1/admin/platform-subscription-plans/${planId}`);
      if (response.data.success) {
        set({ 
          plans: get().plans.filter(plan => plan.id !== planId),
          currentPlan: get().currentPlan?.id === planId ? null : get().currentPlan,
          isLoading: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete plan', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // User methods
  fetchActivePlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/subscription-plans');
      if (response.data.success) {
        set({ plans: response.data.data, isLoading: false });
      } else {
        throw new Error(response.data.message || 'Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching active plans:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch active plans', 
        isLoading: false 
      });
    }
  },
  
  fetchUserSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/user/subscription');
      if (response.data.success) {
        set({ userSubscription: response.data.data, isLoading: false });
      } else {
        set({ userSubscription: null, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user subscription', 
        userSubscription: null,
        isLoading: false 
      });
    }
  },
  
  subscribeToPlan: async (planId: string, billingCycle: BillingCycle) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/subscription-plans/${planId}/subscribe`, { billingCycle });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to subscribe to plan');
      }
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to subscribe to plan', 
        isLoading: false 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  getOrderStatus: async (orderId: string) => {
    try {
      const response = await api.get(`/api/v1/orders/${orderId}/status`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get order status');
      }
    } catch (error) {
      console.error('Error getting order status:', error);
      throw error;
    }
  },
  
  cancelSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/user/subscription/cancel');
      if (response.data.success) {
        set({ 
          userSubscription: response.data.data,
          isLoading: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cancel subscription', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // State management
  setCurrentPlan: (plan: PlatformSubscriptionPlan | null) => {
    set({ currentPlan: plan });
  },
}));
