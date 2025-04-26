import axios from "axios";
import { create } from "zustand";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Feature {
    id: string;
    platformPlanId: string;
    featureKey: string;
    limitValue: number;
    data: JSON;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

interface FeatureState {
    features: Feature[];
    currentFeature: Feature | null;
    isLoading: boolean;
    error: string | null;
    fetchFeatures: (planId: string) => Promise<void>;
    fetchFeatureById: (featureId: string) => Promise<void>;
    createFeature: (featureData: Partial<Feature>, planId: string) => Promise<void>;
    updateFeature: (featureId: string, featureData: Partial<Feature>) => Promise<void>;
    deleteFeature: (featureId: string) => Promise<void>;
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

export const useFeatureStore = create<FeatureState>((set, get) => ({
    features: [],
    currentFeature: null,
    isLoading: false,
    error: null,
    fetchFeatures: async (planId: string) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/api/v1/admin/platform-features/${planId}`);
            set({ features: response.data.data,
                isLoading: false,
                error: null
             });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
             });
        }
    },
    fetchFeatureById: async (featureId: string) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/api/v1/admin/platform-features/feature/${featureId}`);
            set({ currentFeature: response.data.data,
                isLoading: false,
                error: null
            });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
             });
        }
    },
    createFeature: async (featureData: Partial<Feature>, planId: string) => {
        set({ isLoading: true });
        try {
            const response = await api.post(`/api/v1/admin/platform-features/${planId}`, featureData);
            set({ features: [...get().features, response.data.data],
                isLoading: false,
                error: null
             });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
             });
        }
    },  
    updateFeature: async (featureId: string, featureData: Partial<Feature>) => {
        set({ isLoading: true });
        try {
            const response = await api.put(`/api/v1/admin/platform-features/feature/${featureId}`, featureData);
            set({ features: get().features.map(feature => feature.id === featureId ? response.data.data : feature),
                isLoading: false,
                error: null
             });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
             });
        }
    },
    deleteFeature: async (featureId: string) => {
        set({ isLoading: true });
        try {
            await api.delete(`/api/v1/admin/platform-features/${featureId}`);
            set({ features: get().features.filter(feature => feature.id !== featureId),
                isLoading: false,
                error: null
             });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
             });
        }
    }       
}));
