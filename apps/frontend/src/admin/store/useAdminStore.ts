import { create } from "zustand";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Admin {
    id: number;
    username: string;
    role: string;
}

interface AdminState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    token: string | null;
    user: Admin | null;

    signin: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    setToken: (token: string) => void;
    setUser: (user: Admin) => void;
}

// Create axios instance with default config
const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const useAdminStore = create<AdminState>((set) => ({
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
    token: localStorage.getItem('token'),
    user: null,

    signin: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(`/api/v1/admin/signin`, { username, password });
            const { token, user } = response.data.data;
            
            // Verify if user role is admin
            if (user.role !== 'ADMIN') {
                set({ error: "Unauthorized access. Admin role required." });
                return false;
            }
            
            localStorage.setItem("token", token);
            set({ isAuthenticated: true, token, user });
            return true;
        } catch (error) {
            console.error("Admin signin error:", error);
            set({ error: "Invalid username or password" });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ 
            isAuthenticated: false, 
            token: null, 
            user: null 
        });
    },

    setToken: (token: string) => {
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true });
    },

    setUser: (user: Admin) => {
        set({ user });
    }
}));

