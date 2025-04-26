import { create } from "zustand";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface AdminKycDocument {
    id: string;
    documentType: string;
    documentNumber: string;
    documentName: string;
    status: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        username: string;
    }
}

interface AdminKycState {
    kycDocument: AdminKycDocument[];
    currentKycDocument: AdminKycDocument | null;
    isLoading: boolean;
    error: string | null;
    getAllKycDocuments: () => Promise<void>;
    getKycDocumentById: (id: string) => Promise<void>;
    updateKycDocument: (id: string, document: AdminKycDocument) => Promise<void>;
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

export const useAdminKycStore = create<AdminKycState>((set) => ({
    kycDocument: [],
    currentKycDocument: null,
    isLoading: false,
    error: null,
    getAllKycDocuments: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/v1/admin/kyc-documents');
            set({ kycDocument: response.data.data.documents, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
    getKycDocumentById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/api/v1/admin/kyc-documents/${id}`);
            set({ currentKycDocument: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
    updateKycDocument: async (id: string, document: AdminKycDocument) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/api/v1/admin/kyc-documents/${id}`, document);
            const updatedKycDocument = response.data.data;
            set((state) => ({
                kycDocument: state.kycDocument.map((doc) => doc.id === id ? updatedKycDocument : doc),
                currentKycDocument: state.currentKycDocument?.id === id ? updatedKycDocument : state.currentKycDocument,
                isLoading: false,
            }));
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    }
}))



