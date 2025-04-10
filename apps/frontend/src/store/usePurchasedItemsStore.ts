import axios from "axios";
import { create } from "zustand";
import { TelegramSubscription } from "./useTelegramStore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export interface DigitalPurchase {
    id: string;
    userId: number;
    productId: string;
    product: {
        title: string
    };
    purchaseDate: string;      // ISO timestamp
    price: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;         // ISO timestamp
    updatedAt: string;         // ISO timestamp
  }
export type PurchaseItem = TelegramSubscription | DigitalPurchase;
interface PurchasedItemsState {
    telegramSubscriptions: TelegramSubscription[];
    digitalPurchases: DigitalPurchase[];
    isLoading: boolean;
    error: string | null;
    getPurchasedItems: () => Promise<void>;
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

export const usePurchasedItemsStore = create<PurchasedItemsState>((set) => ({
    telegramSubscriptions: [],
    digitalPurchases: [],
    isLoading: false,
    error: null,

    getPurchasedItems: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/v1/purchased-items');
            if (response.data.success && response.data.data) {
                set({ 
                    telegramSubscriptions: response.data.data.telegramSubscriptions || [], 
                    digitalPurchases: response.data.data.digitalProducts || [],
                    isLoading: false 
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching purchased items:', error);
            set({ 
                error: error instanceof Error ? error.message : 'Failed to get purchased items', 
                isLoading: false 
            });
            throw error;
        }
    }
}));




