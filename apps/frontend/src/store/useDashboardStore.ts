import { create } from "zustand";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface DashboardStats {
  digitalProductStats: {
    _sum: {
      amount: number | null;
    };
    _count: number;
  };
  telegramStats: {
    _sum: {
      amount: number | null;
    };
    _count: number;
  };
  totalProductsCreated: number;
  totalChannelsCreated: number;
  totalShortLinksCreated: number;
  totalClickCount: {
    _sum: {
      clicks: number | null;
    };
  };
  recentSales: Array<{
    id: string;
    amount: number;
    status: string;
    productType: string;
    createdAt: string;
    user: {
      username: string;
      profileImage: string | null;
    };
    digitalProduct?: {
      title: string;
      coverImage: string | null;
    };
    telegramPlan?: {
      name: string;
      channel: {
        channelName: string;
      };
    };
  }>;
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardStats: () => Promise<void>;
  fetchDailySalesStats: () => Promise<void>;
  dailySalesStats: Array<{
    date: string;
    digitalRevenue: number;
    telegramRevenue: number;
    digitalSales: number;
    telegramSales: number;
    totalRevenue: number;
  }> | null;
  isLoadingSales: boolean;
  errorSales: string | null;
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

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,
  dailySalesStats: null,
  isLoadingSales: false,
  errorSales: null,   
  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/dashboard/stats');
      set({
        stats: response.data.data,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
        isLoading: false
      });
      throw error;
    }
  },
  fetchDailySalesStats: async () => {
    set({ isLoadingSales: true, errorSales: null });
    try {
      const response = await api.get('/api/v1/dashboard/daily-sales');
      set({
        dailySalesStats: response.data.data,
        isLoadingSales: false
      });
    } catch (error) {
      set({
        errorSales: error instanceof Error ? error.message : 'Failed to fetch daily sales stats',
        isLoadingSales: false
      });
      throw error;
    }
  }
}));