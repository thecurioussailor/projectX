import { useCallback, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useWalletStore, WithdrawalRequest } from "../store/useWalletStore";

// Define a proper wallet interface
interface WalletInterface {
  id: string;
  totalBalance: number;
  withdrawableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalWithdrawn: number;
  lastUpdated: string;
  createdAt: string;
}

// Explicitly type the return value of the hook
type WalletHookReturn = {
  wallet: WalletInterface | null;
  withdrawalRequests: WithdrawalRequest[] | null;
  isLoading: boolean;
  error: string | null;
  fetchWallet: () => Promise<void>;
  createWithdrawalRequest: (amount: number) => Promise<void>;
  getWithdrawalRequests: () => Promise<void>;
};

// Export as function declaration with explicit return type
export function useWallet(options: { autoFetch?: boolean } = {}): WalletHookReturn {
    const { autoFetch = true } = options;

    const { token } = useAuthStore();

    const {
        wallet,
        withdrawalRequests,
        isLoading,
        error,
        fetchWallet: fetchWalletStore,
        createWithdrawalRequest: createWithdrawalRequestStore,
        getWithdrawalRequests: getWithdrawalRequestsStore,
    } = useWalletStore();

    const fetchWallet = useCallback(() => {
        if(!token) {  
            throw new Error('You must be logged in to fetch transaction data');
        }   
        return fetchWalletStore();
    }, [fetchWalletStore, token]);

    const createWithdrawalRequest = useCallback((amount: number) => {
        if(!token) {
            throw new Error('You must be logged in to create a withdrawal request');
        }
        return createWithdrawalRequestStore(amount);
    }, [createWithdrawalRequestStore, token]);

    const getWithdrawalRequests = useCallback(() => {
        if(!token) {
            throw new Error('You must be logged in to get withdrawal requests');
        }
        return getWithdrawalRequestsStore();
    }, [getWithdrawalRequestsStore, token]);

    useEffect(() => {
        if(autoFetch && token) {
            fetchWallet();
            getWithdrawalRequests();
        }
    }, [autoFetch, fetchWallet, getWithdrawalRequests, token]);    

    // Return with explicit type casting
    return {
        wallet: wallet as WalletInterface | null,
        withdrawalRequests,
        isLoading,
        error,
        fetchWallet,
        createWithdrawalRequest,
        getWithdrawalRequests,
    };
}
