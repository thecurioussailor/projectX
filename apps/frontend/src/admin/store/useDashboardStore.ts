import axios from "axios";
import { create } from "zustand";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


interface DashboardState {
    users: {
        totalUsers: number;
        totalAdmins: number;
    };
    finance: {
        totalWithdrawalRequests: number;
        pendingWithdrawals: number;
        totalTransactions: number;
    };
    subscriptions: {
        totalPlatformSubscriptionPlans: number;
        activeSubscriptions: number;
    };
    products: {
        totalDigitalProducts: number;
        totalOrders: number;
    };
    verification: {
        totalKYCDocuments: number;
        pendingKYC: number;
    };
    telegram: {
        totalTelegramAccounts: number;
        totalTelegramChannels: number;
        totalTelegramSubscriptions: number;
    };
    fetchDashboard: () => Promise<void>;
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

export const useDashboardStore = create<DashboardState>((set) => ({
    users: {
        totalUsers: 0,
        totalAdmins: 0
    },
    finance: {
        totalWithdrawalRequests: 0,
        pendingWithdrawals: 0,
        totalTransactions: 0
    },
    subscriptions: {
        totalPlatformSubscriptionPlans: 0,
        activeSubscriptions: 0
    },
    products: {
        totalDigitalProducts: 0,
        totalOrders: 0
    },
    verification: {
        totalKYCDocuments: 0,
        pendingKYC: 0
    },
    telegram: {
        totalTelegramAccounts: 0,
        totalTelegramChannels: 0,
        totalTelegramSubscriptions: 0
    },
    fetchDashboard: async () => {
        try {
            const response = await api.get(`/api/v1/admin/dashboard`);
            set(response.data.data);
        } catch (error) {
            console.error('Dashboard error:', error);
        }
    }
}));