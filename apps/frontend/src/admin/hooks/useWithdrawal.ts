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
        approveWithdrawal: approveWithdrawalStore,
        rejectWithdrawal: rejectWithdrawalStore,
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

    const approveWithdrawal = useCallback(async (id: string, data: { status: string, transactionId: string, paymentMethod: string, bankName: string, accountNumber: string }) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        await approveWithdrawalStore(id, data);
        return fetchAllWithdrawals();   
    }, [token, approveWithdrawalStore, fetchAllWithdrawals]);    

    const rejectWithdrawal = useCallback(async (id: string, data: { adminNotes: string }) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        await rejectWithdrawalStore(id, data);
        return fetchAllWithdrawals();
    }, [token, rejectWithdrawalStore, fetchAllWithdrawals]); 
    

    useEffect(() => {
        fetchAllWithdrawals();
    }, [token, fetchAllWithdrawals, approveWithdrawal, rejectWithdrawal]);

    return {
        withdrawals,
        currentWithdrawal,
        isLoading,
        error,
        fetchAllWithdrawals,
        fetchWithdrawalById,
        approveWithdrawal,
        rejectWithdrawal,
    }
}