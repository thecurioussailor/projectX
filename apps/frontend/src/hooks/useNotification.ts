import { useCallback, useEffect } from "react";
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";

export function useNotification(autoFetch: boolean = true) {
    const { token } = useAuthStore();
    const {
        notifications,
        unreadCount,
        isLoading,
        error,
        getNotifications,
        markAsRead,
        markAllAsRead,
        getUnreadCount
    } = useNotificationStore();

    // Fetch notifications
    const fetchNotifications = useCallback(async (page = 1, limit = 10) => {
        if (!token) return;
        await getNotifications(page, limit);
    }, [token, getNotifications]);

    // Mark a notification as read
    const markNotificationAsRead = useCallback(async (notificationId: string) => {
        if (!token) return;
        await markAsRead(notificationId);
    }, [token, markAsRead]);

    // Mark all notifications as read
    const markAllNotificationsAsRead = useCallback(async () => {
        if (!token) return;
        await markAllAsRead();
    }, [token, markAllAsRead]);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        if (!token) return;
        await getUnreadCount();
    }, [token, getUnreadCount]);

    // Auto-fetch notifications and unread count
    useEffect(() => {
        if (autoFetch && token) {
            fetchNotifications();
            fetchUnreadCount();
        }
    }, [autoFetch, token, fetchNotifications, fetchUnreadCount]);

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        fetchUnreadCount
    };
}
