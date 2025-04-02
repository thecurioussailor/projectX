import { useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePurchasedItemsStore } from "../store/usePurchasedItemsStore";

export const usePurchasedItems = () => {
    const { token } = useAuthStore();
    const {
        telegramSubscriptions,
        isLoading,
        error,
        getPurchasedItems: storeGetPurchasedItems,
    } = usePurchasedItemsStore();

    const getPurchasedItems = useCallback(async () => {
        if (!token) {
            throw new Error('You must be logged in to get purchased items');    
        }
        return storeGetPurchasedItems();
    }, [token, storeGetPurchasedItems]);

    return {
        telegramSubscriptions,
        isLoading,
        error,
        getPurchasedItems,
    }
}