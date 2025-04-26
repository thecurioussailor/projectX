import { create } from "zustand";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface KycDocument {
    id: string;
    documentType: string;
    documentNumber: string;
    documentName: string;
    status: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

interface KycState {
    kycDocument: KycDocument | null;
    isLoading: boolean;
    error: string | null;
    getUploadKycUrl: (documentType: string, documentNumber: string, documentName: string) => Promise<{
        success: boolean;
        data: {
            uploadUrl: string;
            s3Key: string;
            documentType: string;
            documentNumber: string;
            documentName: string;
        }
    }>;
    uploadKycDocument: (documentType: string, documentNumber: string, documentName: string, s3Key: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    getKycDocument: () => Promise<void>;
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

export const useKycStore = create<KycState>((set) => ({
    kycDocument: null,
    isLoading: false,
    error: null,
    getUploadKycUrl: async (documentType: string, documentNumber: string, documentName: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/api/v1/kyc/get-upload-url', { documentType, documentNumber, documentName });
            return response.data;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
    uploadKycDocument: async (documentType: string, documentNumber: string, documentName: string, s3Key: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.post(`/api/v1/kyc/upload-document`, { documentType, documentNumber, documentName, s3Key });
            set({ isLoading: false });
            return { success: true, message: 'Document uploaded successfully' };
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
            return { success: false, message: 'Failed to upload document' };
        }
    },
    getKycDocument: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/v1/kyc/get-kyc-document');
            set({ kycDocument: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    }
}))



