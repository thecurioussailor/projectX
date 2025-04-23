import axios from 'axios';
import { create } from 'zustand';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Define PlatformSubscriptionPlan interface
export interface PlatformSubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  monthlyPrice: number;
  annualPrice: number | null;
  isCustom: boolean;
  transactionFeePercentage: number;
  
  // Plan status
  isActive: boolean;
  isDefault: boolean;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


// Define store state interface
interface PlatformPlanState {
  plans: PlatformSubscriptionPlan[];
  currentPlan: PlatformSubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
  
  // Admin methods
  fetchAllPlans: () => Promise<void>;
  fetchPlanById: (planId: string) => Promise<void>;
  createPlan: (planData: Partial<PlatformSubscriptionPlan>) => Promise<void>;
  updatePlan: (planId: string, planData: Partial<PlatformSubscriptionPlan>) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
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
}));
