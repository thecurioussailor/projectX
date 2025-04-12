import { useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePurchasedItemsStore } from "../store/usePurchasedItemsStore";

export const usePurchasedItems = () => {
    const { token } = useAuthStore();
    const {
        telegramSubscriptions,
        digitalPurchases,
        isLoading,
        error,
        getPurchasedItems: storeGetPurchasedItems,
        getDigitalProductFiles: storeGetDigitalProductFiles
    } = usePurchasedItemsStore();

    const getPurchasedItems = useCallback(async () => {
        if (!token) {
            throw new Error('You must be logged in to get purchased items');    
        }
        return storeGetPurchasedItems();
    }, [token, storeGetPurchasedItems]);

    const getDigitalProductFiles = useCallback(async (purchasedItemId: string) => {
        if (!token) {
            throw new Error('You must be logged in to get digital product files');    
        }
        return storeGetDigitalProductFiles(purchasedItemId);
    }, [token, storeGetDigitalProductFiles]);

    return {
        telegramSubscriptions,
        digitalPurchases,
        isLoading,
        error,
        getPurchasedItems,
        getDigitalProductFiles
    }
}