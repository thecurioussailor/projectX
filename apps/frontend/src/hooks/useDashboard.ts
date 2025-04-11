import { useCallback, useEffect } from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { useAuthStore } from '../store/useAuthStore';

interface UseDashboardOptions {
  autoFetch?: boolean;
}

/**
 * Custom hook for dashboard data with authentication checks
 * @param options Configuration options for the hook
 * @returns Dashboard state and methods
 */
export const useDashboard = (options: UseDashboardOptions = {}) => {
  const { autoFetch = true } = options;
  const { token } = useAuthStore();
  
  const {
    stats,
    isLoading,
    error,
    fetchDashboardStats: storeFetchDashboardStats,
    fetchDailySalesStats: storeFetchDailySalesStats,
    dailySalesStats,
    isLoadingSales,
    errorSales
  } = useDashboardStore();

  // Fetch dashboard stats with authentication check
  const fetchDashboardStats = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to fetch dashboard statistics');
    }
    return storeFetchDashboardStats();
  }, [token, storeFetchDashboardStats]);

  // Fetch daily sales stats with authentication check
  const fetchDailySalesStats = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to fetch daily sales statistics');
    }
    return storeFetchDailySalesStats();
  }, [token, storeFetchDailySalesStats]);

  // Auto-fetch data when the component mounts if autoFetch is true
  useEffect(() => {
    if (autoFetch && token && !stats && !isLoading) {
      fetchDashboardStats();
    }
  }, [autoFetch, token, stats, isLoading, fetchDashboardStats]);

  return {
    stats,
    isLoading,
    error,
    fetchDashboardStats,
    fetchDailySalesStats,
    dailySalesStats,
    isLoadingSales,
    errorSales
  };
};
