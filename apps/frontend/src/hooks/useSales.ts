import { useCallback, useEffect } from 'react';
import { useSalesStore } from '../store/useSalesStore';
import { useAuthStore } from '../store/useAuthStore';

interface UseSalesOptions {
  autoFetch?: boolean;
}

/**
 * Custom hook for sales data with authentication checks
 * @param options Configuration options for the hook
 * @returns Sales state and methods
 */
export const useSales = (options: UseSalesOptions = {}) => {
  const { autoFetch = true } = options;
  const { token } = useAuthStore();
  
  const {
    sales,
    isLoading,
    error,
    fetchSales: storeFetchSales
  } = useSalesStore();

  // Fetch sales data with authentication check
  const fetchSales = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to fetch sales data');
    }
    return storeFetchSales();
  }, [token, storeFetchSales]);

  // Auto-fetch data when the component mounts if autoFetch is true
  useEffect(() => {
    if (autoFetch && token && !sales && !isLoading) {
      fetchSales();
    }
  }, [autoFetch, token, sales, isLoading, fetchSales]);

  return {
    sales,
    isLoading,
    error,
    fetchSales
  };
};