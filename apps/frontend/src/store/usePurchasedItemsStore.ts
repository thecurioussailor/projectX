import axios from "axios";
import { create } from "zustand";
import { TelegramSubscription } from "./useTelegramStore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Interface for file data returned from the API
export interface DigitalFile {
    id: string;
    type: string;
    presignedUrl: string;
}

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
    files?: DigitalFile[];     // Optional files property for downloaded files
}

export interface TelegramSubscription extends TelegramSubscription {
    inviteLink: string;
}

export type PurchaseItem = TelegramSubscription | DigitalPurchase;
interface PurchasedItemsState {
    telegramSubscriptions: TelegramSubscription[];
    digitalPurchases: DigitalPurchase[];
    isLoading: boolean;
    error: string | null;
    getPurchasedItems: () => Promise<void>;
    getDigitalProductFiles: (purchasedItemId: string) => Promise<void>;
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
    },
    getDigitalProductFiles: async (purchasedItemId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/api/v1/digital-files/${purchasedItemId}`);
            
            if (response.data.status === "success" && Array.isArray(response.data.data)) {
                // Create a digital purchase object with the files array
                const purchaseWithFiles: DigitalPurchase = {
                    id: purchasedItemId,
                    userId: 0, // Default values for required fields
                    productId: '',
                    product: { title: 'Digital Product' },
                    purchaseDate: '',
                    price: '',
                    status: 'ACTIVE',
                    createdAt: '',
                    updatedAt: '',
                    files: response.data.data // Array of files with presigned URLs
                };
                
                set({ 
                    digitalPurchases: [purchaseWithFiles],
                    isLoading: false 
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching digital product files:', error);
            set({ 
                error: error instanceof Error ? error.message : 'Failed to get digital product files', 
                isLoading: false 
            });
            throw error;
        }
    }
}));
