import { useCallback, useEffect } from "react";
import { useAdminAuth } from "../context/AdminAuthContext"
import { Feature, useFeatureStore } from "../store/useFeatureStore"
export const useFeature = (planId: string) => {
    const { token } = useAdminAuth();
    
    const {
        features,
        currentFeature,
        isLoading,
        error,
        fetchFeatures: fetchFeaturesStore,
        fetchFeatureById: fetchFeatureByIdStore,
        createFeature: createFeatureStore,
        updateFeature: updateFeatureStore,
        deleteFeature: deleteFeatureStore,
    } = useFeatureStore();

    const fetchAllFeatures = useCallback(async (planId: string) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return fetchFeaturesStore(planId);
    }, [token, fetchFeaturesStore]);

    const fetchFeatureById = useCallback(async (featureId: string) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return fetchFeatureByIdStore(featureId);
    }, [token, fetchFeatureByIdStore]);

    const createFeature = useCallback(async (featureData: Partial<Feature>, planId: string) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return createFeatureStore(featureData, planId);
    }, [token, createFeatureStore]);

    const updateFeature = useCallback(async (featureId: string, featureData: Partial<Feature>) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return updateFeatureStore(featureId, featureData);
    }, [token, updateFeatureStore]);

    const deleteFeature = useCallback(async (featureId: string) => {
        if (!token) {
            throw new Error("You must be logged in to create a product");
        };
        return deleteFeatureStore(featureId);
    }, [token, deleteFeatureStore]);

    useEffect(() => {
        fetchAllFeatures(planId);
    }, [fetchAllFeatures, planId]);

    return {
        features,
        currentFeature,
        isLoading,
        error,
        fetchAllFeatures,
        fetchFeatureById,
        createFeature,
        updateFeature,
        deleteFeature,
    }
}