import { create } from "zustand";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Sale {
  id: string;
  amount: number;
  status: string;
  productType: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
  };
  digitalProduct?: {
    id: string;
    title: string;
  };
  telegramPlan?: {
    id: string;
    name: string;
    channel: {
      channelName: string;
    };
  };
}

interface SalesState {
  sales: Sale[] | null;
  isLoading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
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

export const useSalesStore = create<SalesState>((set) => ({
  sales: null,
  isLoading: false,
  error: null,
  fetchSales: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/sales');
      set({
        sales: response.data.data,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch sales data',
        isLoading: false
      });
      throw error;
    }
  }
}));