import { usePaymentMethodStore } from "../store/usePaymentMethodStore";
import { useEffect, useCallback } from "react";

export const usePaymentMethod = (autoFetch: boolean = true) => {
    const {
        paymentMethods,
        selectedPaymentMethod,
        isLoading,
        error,
        createPaymentMethod,
        getUserPaymentMethods,
        getUserPaymentMethodById,
        updatePaymentMethod,
        deletePaymentMethod,
        clearError,
        clearSelectedPaymentMethod,
    } = usePaymentMethodStore();

    const token = localStorage.getItem('token');

    const getPaymentMethods = useCallback(async () => {
        await getUserPaymentMethods();
    }, [getUserPaymentMethods]);

    useEffect(() => {
        if (autoFetch && token) {
            getPaymentMethods();
        }
    }, [autoFetch, token, getPaymentMethods]);

    return {
        // State
        paymentMethods,
        selectedPaymentMethod,
        isLoading,
        error,
        
        // Actions
        createPaymentMethod,
        getUserPaymentMethods,
        getUserPaymentMethodById,
        updatePaymentMethod,
        deletePaymentMethod,
        clearError,
        clearSelectedPaymentMethod,
        
        // Computed values
        hasPrimaryBankAccount: paymentMethods.some(
            pm => pm.type === 'BANK' && pm.priority === 'PRIMARY' && pm.status === 'VERIFIED'
        ),
        hasPrimaryUPI: paymentMethods.some(
            pm => pm.type === 'UPI' && pm.priority === 'PRIMARY' && pm.status === 'VERIFIED'
        ),
        verifiedPaymentMethods: paymentMethods.filter(pm => pm.status === 'VERIFIED'),
        pendingPaymentMethods: paymentMethods.filter(pm => pm.status === 'PENDING'),
        bankAccounts: paymentMethods.filter(pm => pm.type === 'BANK'),
        upiMethods: paymentMethods.filter(pm => pm.type === 'UPI'),
    };
}; 