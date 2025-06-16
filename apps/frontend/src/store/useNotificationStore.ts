import { create } from "zustand";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Notification {
    id: string;
    userId: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    data?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    getNotifications: (page?: number, limit?: number) => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    getUnreadCount: () => Promise<void>;
}

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    getNotifications: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/api/v1/notifications`, {
                params: { page, limit }
            });
            set({ notifications: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
    markAsRead: async (notificationId: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.put(`/api/v1/notifications/${notificationId}/read`);
            // Update the notification in the local state
            set((state) => ({
                notifications: state.notifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n),
                isLoading: false
            }));
            // Optionally update unread count
            get().getUnreadCount();
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
    markAllAsRead: async () => {
        set({ isLoading: true, error: null });
        try {
            await api.put(`/api/v1/notifications/read`);
            // Update all notifications in the local state
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                isLoading: false
            }));
            // Optionally update unread count
            get().getUnreadCount();
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
        }
    },
    getUnreadCount: async () => {
        try {
            const response = await api.get(`/api/v1/notifications/unread-count`);
            set({ unreadCount: response.data.data.unreadCount });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    },
}));