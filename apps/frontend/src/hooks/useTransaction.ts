import { useCallback, useEffect } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';
import { useAuthStore } from '../store/useAuthStore';

interface UseTransactionOptions {
  autoFetch?: boolean;
}

/**
 * Custom hook for transaction data with authentication checks
 * @param options Configuration options for the hook
 * @returns Transaction state and methods
 */
export const useTransaction = (options: UseTransactionOptions = {}) => {
  const { autoFetch = true } = options;
  const { token } = useAuthStore();
  
  const {
    transactions,
    isLoading,
    error,
    fetchTransactions: storeFetchTransactions
  } = useTransactionStore();

  // Fetch transaction data with authentication check
  const fetchTransactions = useCallback(async () => {
    if (!token) {
      throw new Error('You must be logged in to fetch transaction data');
    }
    return storeFetchTransactions();
  }, [token, storeFetchTransactions]);

  // Auto-fetch data when the component mounts if autoFetch is true
  useEffect(() => {
    if (autoFetch && token && !transactions && !isLoading) {
      fetchTransactions();
    }
  }, [autoFetch, token, transactions, isLoading, fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions
  };
};