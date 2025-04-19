import { create } from "zustand";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Wallet {
    id: string;
    totalBalance: number;
    withdrawableBalance: number;
    pendingBalance: number;
    totalEarnings: number;
    totalWithdrawn: number;
    lastUpdated: string;
    createdAt: string;
}

export interface WithdrawalRequest {
    id: string;
    walletId: string;
    amount: number;
    status: string;
    createdAt: string;
    processedAt: string | null;
}

interface WalletState {
    wallet: Wallet | null;
    withdrawalRequests: WithdrawalRequest[] | null;
    isLoading: boolean;
    error: string | null;
    fetchWallet: () => Promise<void>;
    createWithdrawalRequest: (amount: number) => Promise<void>;
    getWithdrawalRequests: () => Promise<void>;
}

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export const useWalletStore = create<WalletState>((set) => ({
    wallet: null,
    withdrawalRequests: null,
    isLoading: false,
    error: null,
    fetchWallet: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/v1/wallet');
            set({ wallet: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
    createWithdrawalRequest: async (amount: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/api/v1/wallet/withdraw', { amount });
            set({ isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },      
    getWithdrawalRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/v1/wallet/withdrawals');
            set({ withdrawalRequests: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
}))



