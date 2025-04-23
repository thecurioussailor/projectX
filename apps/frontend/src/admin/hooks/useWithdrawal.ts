import { useCallback, useEffect } from "react";
import { useAdminAuth } from "../context/AdminAuthContext"
import { useWithdrawalStore } from "../store/useWithdrawalStore"
export const useWithdrawal = () => {
    const { token } = useAdminAuth();
    
    const {
        withdrawals,
        currentWithdrawal,
        isLoading,
        error,
        fetchWithdrawals: fetchWithdrawalsStore,
        fetchWithdrawalById: fetchWithdrawalByIdStore,
    } = useWithdrawalStore();

    const fetchAllWithdrawals = useCallback(async () => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return fetchWithdrawalsStore();
    }, [token, fetchWithdrawalsStore]);

    const fetchWithdrawalById = useCallback(async (id: string) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return fetchWithdrawalByIdStore(id);
    }, [token, fetchWithdrawalByIdStore]);

    useEffect(() => {
        fetchAllWithdrawals();
    }, [token, fetchAllWithdrawals]);

    return {
        withdrawals,
        currentWithdrawal,
        isLoading,
        error,
        fetchAllWithdrawals,
        fetchWithdrawalById,
    }
}