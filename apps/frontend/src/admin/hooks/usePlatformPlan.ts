import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { 
    usePlatformPlanStore, 
    PlatformSubscriptionPlan, 
    BillingCycle,
    PaymentSession,
    OrderStatus
} from '../store/usePlatformPlanStore';

/**
 * Custom hook for Platform Subscription Plan functionality with authentication checks
 */
export const usePlatformPlan = ({autoFetch = true}: {autoFetch?: boolean} = {}) => {
    const { token } = useAuthStore();
    
    const {
        // State
        plans,
        currentPlan,
        userSubscription,
        isLoading,
        error,
        
        // Admin methods
        fetchAllPlans: storeFetchAllPlans,
        fetchPlanById: storeFetchPlanById,
        createPlan: storeCreatePlan,
        updatePlan: storeUpdatePlan,
        deletePlan: storeDeletePlan,
        
        // User methods
        fetchActivePlans: storeFetchActivePlans,
        fetchUserSubscription: storeFetchUserSubscription,
        subscribeToPlan: storeSubscribeToPlan,
        getOrderStatus: storeGetOrderStatus,
        cancelSubscription: storeCancelSubscription,
        
        // State management
        setCurrentPlan,
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
    
    // User methods with authentication check
    const fetchActivePlans = useCallback(async () => {
        return storeFetchActivePlans();
    }, [storeFetchActivePlans]);
    
    const fetchUserSubscription = useCallback(async () => {
        if (!token) {
            throw new Error('You must be logged in to fetch your subscription');
        }
        return storeFetchUserSubscription();
    }, [token, storeFetchUserSubscription]);
    
    const subscribeToPlan = useCallback(async (planId: string, billingCycle: BillingCycle): Promise<PaymentSession> => {
        if (!token) {
            throw new Error('You must be logged in to subscribe to a plan');
        }
        return storeSubscribeToPlan(planId, billingCycle);
    }, [token, storeSubscribeToPlan]);
    
    const getOrderStatus = useCallback(async (orderId: string): Promise<OrderStatus> => {
        if (!token) {
            throw new Error('You must be logged in to check order status');
        }
        return storeGetOrderStatus(orderId);
    }, [token, storeGetOrderStatus]);
    
    const cancelSubscription = useCallback(async () => {
        if (!token) {
            throw new Error('You must be logged in to cancel your subscription');
        }
        return storeCancelSubscription();
    }, [token, storeCancelSubscription]);

    useEffect(() => {
        if (autoFetch && token && !plans && !isLoading) {
            fetchAllPlans();
        }
    }, [autoFetch,token, fetchAllPlans, plans, isLoading]);

    return {
        // State
        plans,
        currentPlan,
        userSubscription,
        isLoading,
        error,
        
        // Admin methods
        fetchAllPlans,
        fetchPlanById,
        createPlan,
        updatePlan,
        deletePlan,
        
        // User methods
        fetchActivePlans,
        fetchUserSubscription,
        subscribeToPlan,
        getOrderStatus,
        cancelSubscription,
        
        // State management
        setCurrentPlan,
    };
};
