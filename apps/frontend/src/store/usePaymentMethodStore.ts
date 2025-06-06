import { create } from "zustand";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

export interface PaymentMethod {
    id: string;
    userId: string;
    type: 'BANK' | 'UPI';
    priority: 'PRIMARY' | 'SECONDARY';
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    upiId?: string;
    upiName?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface CreatePaymentMethodData {
    type: 'BANK' | 'UPI';
    priority: 'PRIMARY' | 'SECONDARY';
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    upiId?: string;
    upiName?: string;
}

export interface UpdatePaymentMethodData {
    priority?: 'PRIMARY' | 'SECONDARY';
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    upiId?: string;
    upiName?: string;
}

interface PaymentMethodState {
    paymentMethods: PaymentMethod[];
    selectedPaymentMethod: PaymentMethod | null;
    isLoading: boolean;
    error: string | null;
    createPaymentMethod: (data: CreatePaymentMethodData) => Promise<{
        success: boolean;
        message: string;
        data?: PaymentMethod;
    }>;
    getUserPaymentMethods: () => Promise<void>;
    getUserPaymentMethodById: (paymentMethodId: string) => Promise<void>;
    updatePaymentMethod: (paymentMethodId: string, data: UpdatePaymentMethodData) => Promise<{
        success: boolean;
        message: string;
        data?: PaymentMethod;
    }>;
    deletePaymentMethod: (paymentMethodId: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    clearError: () => void;
    clearSelectedPaymentMethod: () => void;
}

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const usePaymentMethodStore = create<PaymentMethodState>((set) => ({
    paymentMethods: [],
    selectedPaymentMethod: null,
    isLoading: false,
    error: null,

    createPaymentMethod: async (data: CreatePaymentMethodData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/api/v1/payment-methods', data);
            const newPaymentMethod = response.data.data;
            
            set((state) => ({
                paymentMethods: [...state.paymentMethods, newPaymentMethod],
                isLoading: false,
            }));
            
            return {
                success: true,
                message: response.data.message || 'Payment method created successfully',
                data: newPaymentMethod,
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to create payment method';
            set({ error: errorMessage, isLoading: false });
            return {
                success: false,
                message: errorMessage,
            };
        }
    },

    getUserPaymentMethods: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/v1/payment-methods');
            set({
                paymentMethods: response.data.data,
                isLoading: false,
            });
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to fetch payment methods';
            set({ error: errorMessage, isLoading: false });
        }
    },

    getUserPaymentMethodById: async (paymentMethodId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/api/v1/payment-methods/${paymentMethodId}`);
            set({
                selectedPaymentMethod: response.data.data,
                isLoading: false,
            });
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to fetch payment method';
            set({ error: errorMessage, isLoading: false });
        }
    },

    updatePaymentMethod: async (paymentMethodId: string, data: UpdatePaymentMethodData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/api/v1/payment-methods/${paymentMethodId}`, data);
            const updatedPaymentMethod = response.data.data;
            
            set((state) => ({
                paymentMethods: state.paymentMethods.map((pm) =>
                    pm.id === paymentMethodId ? updatedPaymentMethod : pm
                ),
                selectedPaymentMethod: state.selectedPaymentMethod?.id === paymentMethodId 
                    ? updatedPaymentMethod 
                    : state.selectedPaymentMethod,
                isLoading: false,
            }));
            
            return {
                success: true,
                message: response.data.message || 'Payment method updated successfully',
                data: updatedPaymentMethod,
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to update payment method';
            set({ error: errorMessage, isLoading: false });
            return {
                success: false,
                message: errorMessage,
            };
        }
    },

    deletePaymentMethod: async (paymentMethodId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.delete(`/api/v1/payment-methods/${paymentMethodId}`);
            
            set((state) => ({
                paymentMethods: state.paymentMethods.filter((pm) => pm.id !== paymentMethodId),
                selectedPaymentMethod: state.selectedPaymentMethod?.id === paymentMethodId 
                    ? null 
                    : state.selectedPaymentMethod,
                isLoading: false,
            }));
            
            return {
                success: true,
                message: response.data.message || 'Payment method deleted successfully',
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to delete payment method';
            set({ error: errorMessage, isLoading: false });
            return {
                success: false,
                message: errorMessage,
            };
        }
    },

    clearError: () => set({ error: null }),
    
    clearSelectedPaymentMethod: () => set({ selectedPaymentMethod: null }),
}));

