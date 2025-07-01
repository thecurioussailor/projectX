import { create } from "zustand";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Transaction {
  id: string;
  gateway: string;
  gatewayTxnId: string;
  amount: number;
  status: string;
  paymentGroup: string;
  paymentTime: string;
  createdAt: string;
  order: {
    id: string;
    productType: string;
    digitalProduct?: {
      id: string;
      title: string;
    };
    telegramPlan?: {
      id: string;
      name: string;
      channel: {
        id: string;
        channelName: string;
      };
    };
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      phone: string;
    };
  };
}

interface TransactionState {
  transactions: Transaction[] | null;
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
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

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: null,
  isLoading: false,
  error: null,
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/transactions');
      set({
        transactions: response.data.data,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch transaction data',
        isLoading: false
      });
      throw error;
    }
  }
}));