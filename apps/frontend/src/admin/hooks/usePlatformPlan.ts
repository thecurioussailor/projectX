import { useCallback, useEffect } from 'react';
import { 
    usePlatformPlanStore, 
    PlatformSubscriptionPlan, 
} from '../store/usePlatformPlanStore';
import { useAdminAuth } from '../context/AdminAuthContext';

/**
 * Custom hook for Platform Subscription Plan functionality with authentication checks
 */
export const usePlatformPlan = () => {
    const { token } = useAdminAuth();
    
    const {
        // State
        plans,
        currentPlan,
        isLoading,
        error,
        
        // Admin methods
        fetchAllPlans: storeFetchAllPlans,
        fetchPlanById: storeFetchPlanById,
        createPlan: storeCreatePlan,
        updatePlan: storeUpdatePlan,
        deletePlan: storeDeletePlan,
        
    } = usePlatformPlanStore();

    // Admin methods with authentication check
    const fetchAllPlans = useCallback(async () => {
        if (!token) {
            throw new Error('You must be logged in to fetch all plans');
        }
        return storeFetchAllPlans();
    }, [token, storeFetchAllPlans]);
    
    const fetchPlanById = useCallback(async (planId: string) => {
        if (!token) {
            throw new Error('You must be logged in to fetch a plan');
        }
        return storeFetchPlanById(planId);
    }, [token, storeFetchPlanById]);
    
    const createPlan = useCallback(async (planData: Partial<PlatformSubscriptionPlan>) => {
        if (!token) {
            throw new Error('You must be logged in to create a plan');
        }
        return storeCreatePlan(planData);
    }, [token, storeCreatePlan]);
    
    const updatePlan = useCallback(async (planId: string, planData: Partial<PlatformSubscriptionPlan>) => {
        if (!token) {
            throw new Error('You must be logged in to update a plan');
        }
        return storeUpdatePlan(planId, planData);
    }, [token, storeUpdatePlan]);
    
    const deletePlan = useCallback(async (planId: string) => {
        if (!token) {
            throw new Error('You must be logged in to delete a plan');
        }
        return storeDeletePlan(planId);
    }, [token, storeDeletePlan]);
    
    // Fetch plans when the hook is mounted or token changes
    useEffect(() => {
        if (token) {
            fetchAllPlans().catch(err => console.error('Error fetching plans:', err));
        }
    }, [token, fetchAllPlans]);

    return {
        // State
        plans,
        currentPlan,
        isLoading,
        error,
        
        // Admin methods
        fetchAllPlans,
        fetchPlanById,
        createPlan,
        updatePlan,
        deletePlan,
    };
};
