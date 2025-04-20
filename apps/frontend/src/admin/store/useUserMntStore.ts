import axios from "axios";
import { create } from "zustand";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    profilePicture: string;
    coverPicture: string;
    location: string;
    emailVerified: boolean;
    emailVerifiedAt: string;
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UserMntState {
    users: User[];
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    fetchUserById: (id: number) => Promise<void>;
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

export const useUserMntStore = create<UserMntState>((set) => ({
    users: [],
    currentUser: null,
    isLoading: false,
    error: null,
    fetchUsers: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/api/v1/admin/users`);
            set({ users: response.data.data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    },
    fetchUserById: async (id: number) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/api/v1/admin/users/${id}`);
            set({ currentUser: response.data.data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    },
}));
