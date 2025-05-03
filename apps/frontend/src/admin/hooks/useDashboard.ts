import { useCallback, useEffect } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useDashboardStore } from "../store/useDashboardStore";

export const useDashboard = () => {
    const { token } = useAdminAuth();
    
    const {
        users,
        finance,
        subscriptions,
        products,
        verification,
        telegram,
        fetchDashboard: fetchDashboardStore
    } = useDashboardStore();

    const fetchDashboard = useCallback(async () => {
        if (!token) {
            throw new Error("You must be logged in to access dashboard data");
        }
        return fetchDashboardStore();
    }, [token, fetchDashboardStore]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        users,
        finance,
        subscriptions,
        products,
        verification,
        telegram,
        fetchDashboard
    };
};