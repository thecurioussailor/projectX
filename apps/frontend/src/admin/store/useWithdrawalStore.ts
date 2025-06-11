import axios from "axios";
import { create } from "zustand";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Withdrawal {
    id: string;
    walletId: string;
    amount: number;
    status: string;
    paymentMethod: string;
    paymentDetails: {
        bankName: string;
        accountNumber: string;
    };
    adminNotes: string;
    processedAt: string | null;
    processedBy: string | null;
    transactionId: string | null;
    createdAt: string;
    updatedAt: string;
    wallet: {
        id: string;
        totalBalance: number;
        withdrawableBalance: number;
        pendingBalance: number;
        user: {
            id: string;
            username: string;
            email: string;
        }
    }
}

interface WithdrawalState {
    withdrawals: Withdrawal[];
    currentWithdrawal: Withdrawal | null;
    isLoading: boolean;
    error: string | null;
    fetchWithdrawals: () => Promise<void>;
    fetchWithdrawalById: (id: string) => Promise<void>;
    approveWithdrawal: (id: string, data: { status: string, transactionId: string, paymentMethod: string, bankName: string, accountNumber: string, adminNotes: string }) => Promise<void>;
    rejectWithdrawal: (id: string, data: { adminNotes: string }) => Promise<void>;
}

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export const useWithdrawalStore = create<WithdrawalState>((set) => ({
    withdrawals: [],
    currentWithdrawal: null,
    isLoading: false,
    error: null,
    fetchWithdrawals: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/api/v1/admin/withdrawals`);
            set({ withdrawals: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
    fetchWithdrawalById: async (id: string) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/api/v1/admin/withdrawals/${id}`);
            set({ currentWithdrawal: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
    approveWithdrawal: async (id: string, data: { status: string, transactionId: string, paymentMethod: string, bankName: string, accountNumber: string, adminNotes: string }) => {
        set({ isLoading: true });
        try {
            await api.post(`/api/v1/admin/withdrawals/${id}/approve`, data);
            set({ isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
    rejectWithdrawal: async (id: string, data: { adminNotes: string }) => {
        set({ isLoading: true });
        try {
            await api.post(`/api/v1/admin/withdrawals/${id}/reject`, data);
            set({ isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    }
}));
