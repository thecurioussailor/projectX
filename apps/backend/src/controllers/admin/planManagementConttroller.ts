import { Request, Response } from "express";
import { prismaClient } from "@repo/db";

/**
 * Create a new subscription plan
 */
export const createSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
    try {

        const admin = req.user;

        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }

        const { name, description, monthlyPrice, annualPrice, transactionFeePercentage,  isCustom, isDefault, 
                isActive } = req.body;

        if(isDefault){
            await prismaClient.platformSubscriptionPlan.updateMany({
                where: { isDefault: true },
                data: { isDefault: false }
            });
        }

        console.log(req.body);
        // Check required fields
        if (!name || !monthlyPrice || !transactionFeePercentage) {
            res.status(400).json({ 
                success: false,
                message: "Name, monthly price, and transaction fee percentage are required" 
            });
            return;
        }

        // Create the subscription plan
        const plan = await prismaClient.platformSubscriptionPlan.create({
            data: {
                name,
                description,
                monthlyPrice : isDefault ? 0 : monthlyPrice,
                annualPrice : isDefault ? 0 : annualPrice,
                isCustom,
                transactionFeePercentage,
                isActive,
                isDefault,
            }
        });

        res.status(201).json({ 
            success: true,
            message: "Subscription plan created successfully", 
            data: plan 
        });
    } catch (error) {
        console.error("Error creating subscription plan:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to create subscription plan" 
        });
    }
};

/**
 * Get all subscription plans
 */
export const getAllSubscriptionPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }

        const platformSubscriptionPlans = await prismaClient.platformSubscriptionPlan.findMany({
            orderBy: { createdAt: 'desc' }
        });
        
        res.status(200).json({ 
            success: true,
            message: "Subscription plans fetched successfully",
            data: platformSubscriptionPlans 
        });
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch subscription plans" 
        });
    }
};

export const getSubscriptionPlanById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const admin = req.user;
        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }
        if (!id) {
            res.status(400).json({ 
                success: false,
                message: "Plan ID is required" 
            });
            return;
        }
        
        // Find the plan by ID
        const platformSubscriptionPlan = await prismaClient.platformSubscriptionPlan.findUnique({
            where: { id },
            include: {
                userPlatformSubscriptions: {
                    select: {
                        id: true,
                        userId: true,
                        status: true,
                        billingCycle: true,
                        startDate: true,
                        endDate: true
                    }
                }
            }
        });
        
        if (!platformSubscriptionPlan) {
            res.status(404).json({ 
                success: false,
                message: "Subscription plan not found" 
            });
            return;
        }
        
        res.status(200).json({ 
            success: true,
            message: "Subscription plan fetched successfully",
            data: platformSubscriptionPlan 
        });
    } catch (error) {
        console.error("Error fetching subscription plan:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch subscription plan" 
        });
    }
};

/**
 * Update a subscription plan
 */
export const updateSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ 
                success: false,
                message: "Plan ID is required" 
            });
            return;
        }
        const { name, price, transactionFeePercentage, annualPrice, isCustom, isDefault, 
            isActive, description } = req.body;
        
        // Check if plan exists
        const existingPlan = await prismaClient.platformSubscriptionPlan.findUnique({
            where: { id }
        });
        
        if (!existingPlan) {
            res.status(404).json({ 
                success: false,
                message: "Subscription plan not found" 
            });
            return;
        }
        
        // If this plan is being marked as default, update any existing default plans
        if (isDefault) {
            await prismaClient.platformSubscriptionPlan.updateMany({
                where: { isDefault: true, id: { not: id } },
                data: { isDefault: false }
            });
        }
        
        // Update the plan
        const updatedPlan = await prismaClient.platformSubscriptionPlan.update({
            where: { id },
            data: {
                name: name || existingPlan.name,
                monthlyPrice: price !== undefined ? price : existingPlan.monthlyPrice,
                transactionFeePercentage: transactionFeePercentage !== undefined ? 
                transactionFeePercentage : existingPlan.transactionFeePercentage,
                annualPrice: annualPrice !== undefined ? annualPrice : existingPlan.annualPrice,
                isCustom: isCustom !== undefined ? isCustom : existingPlan.isCustom,
                isDefault: isDefault !== undefined ? isDefault : existingPlan.isDefault,
                isActive: isActive !== undefined ? isActive : existingPlan.isActive,
                description: description || existingPlan.description
            }
        });
        
        res.status(200).json({ 
            success: true,
            message: "Subscription plan updated successfully", 
            data: updatedPlan 
        });
    } catch (error) {
        console.error("Error updating subscription plan:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update subscription plan" 
        });
    }
};

/**
 * Delete a subscription plan
 */
export const deleteSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }
        const { id } = req.params;
        
        if (!id) {
            res.status(400).json({ 
                success: false,
                message: "Plan ID is required" 
            });
            return;
        }
        
        // Check if plan exists
        const existingPlan = await prismaClient.platformSubscriptionPlan.findUnique({
            where: { id },
        });
        
        if (!existingPlan) {
            res.status(404).json({ 
                success: false,
                message: "Subscription plan not found" 
            });
            return;
        }   
        
        // Check if there are active subscribers to this plan
        const activeSubscribers = await prismaClient.userPlatformSubscription.findMany({
            where: {
                platformPlanId: id,
                status: {
                    not: "CANCELED"
                }
            }
        });

        if (activeSubscribers.length > 0) {
            res.status(400).json({ 
                success: false,
                message: "Cannot delete a plan with active subscribers. Consider deactivating it instead." 
            });
            return;
        }
        
        // Delete the plan
        await prismaClient.platformSubscriptionPlan.update({
            where: { id },
            data: {
                isActive: false,
                deletedAt: new Date()
            }
        });
        
        res.status(200).json({ 
            success: true,
            message: "Subscription plan deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting subscription plan:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete subscription plan" 
        });
    }
};

export const createPlatformSubscriptionPlanFeature = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }
        const { planId } = req.params;  
        const { featureKey, limitValue, isEnabled, data } = req.body;
        
        if (!planId || !featureKey) {
            res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
            return;
        }
        
        // Check if plan exists
        const planExists = await prismaClient.platformSubscriptionPlan.findUnique({
            where: { id: planId }
        });
        
        if (!planExists) {
            res.status(404).json({
                success: false,
                message: "Subscription plan not found"
            });
            return;
        }
        
        // Create the feature
        const feature = await prismaClient.platformSubscriptionPlanFeature.create({
            data: {
                platformPlanId: planId,
                featureKey,
                limitValue,
                isEnabled: isEnabled ?? true,
                data
            }
        });
        
        res.status(201).json({
            success: true,
            message: "Feature created successfully",
            data: feature
        });
    } catch (error) {
        console.error("Error creating platform subscription plan feature:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to create platform subscription plan feature" 
        });
    }
};



export const getAllPlatformSubscriptionPlanFeatures = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }
        
        const { planId } = req.params;

        if (!planId) {
            res.status(400).json({
                success: false,
                message: "Plan ID is required"
            });
            return;
        }
        
        const features = await prismaClient.platformSubscriptionPlanFeature.findMany({
            where: { 
                platformPlanId: planId as string 
                },
                orderBy: {
                    createdAt: 'asc'
                }
        });
        
        res.status(200).json({
            success: true,
            message: "Features retrieved successfully",
            data: features
        });
    } catch (error) {
        console.error("Error fetching platform subscription plan features:", error);    
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch platform subscription plan features" 
        });
    }
};

export const getPlatformSubscriptionPlanFeatureById = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }
        
        const { featureId } = req.params;
        
        if (!featureId) {
            res.status(400).json({
                success: false,
                message: "Feature ID is required"
            });
            return;
        }
        
        const feature = await prismaClient.platformSubscriptionPlanFeature.findUnique({
            where: { id: featureId },
            include: {
                platformPlan: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        
        if (!feature) {
            res.status(404).json({
                success: false,
                message: "Feature not found"
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            message: "Feature retrieved successfully",
            data: feature
        });
    } catch (error) {
        console.error("Error fetching platform subscription plan feature:", error); 
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch platform subscription plan feature" 
        });
    }
};  


export const updatePlatformSubscriptionPlanFeature = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }
        
        const { featureId } = req.params;
        const { featureKey, limitValue, isEnabled, data } = req.body;
        
        if (!featureId) {
            res.status(400).json({
                success: false,
                message: "Feature ID is required"
            });
            return;
        }
        
        // Check if feature exists
        const featureExists = await prismaClient.platformSubscriptionPlanFeature.findUnique({
            where: { id: featureId }
        });
        
        if (!featureExists) {
            res.status(404).json({
                success: false,
                message: "Feature not found"
            });
            return;
        }
        
        // Update the feature
        const updatedFeature = await prismaClient.platformSubscriptionPlanFeature.update({
            where: { id: featureId },
            data: {
                featureKey: featureKey ?? featureExists.featureKey,
                limitValue: limitValue ?? featureExists.limitValue,
                isEnabled: isEnabled !== undefined ? isEnabled : featureExists.isEnabled,
                data: data ?? featureExists.data
            }
        });
        
        res.status(200).json({
            success: true,
            message: "Feature updated successfully",
            data: updatedFeature
        });
    } catch (error) {
        console.error("Error updating platform subscription plan feature:", error); 
        res.status(500).json({ 
            success: false,
            message: "Failed to update platform subscription plan feature" 
        });
    }
};


export const deletePlatformSubscriptionPlanFeature = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }
        
        const { featureId } = req.params;
        
        if (!featureId) {
            res.status(400).json({
                success: false,
                message: "Feature ID is required"
            });
            return;
        }
        
        // Check if feature exists
        const featureExists = await prismaClient.platformSubscriptionPlanFeature.findUnique({
            where: { id: featureId }
        });
        
        if (!featureExists) {
            res.status(404).json({
                success: false,
                message: "Feature not found"
            });
            return;
        }
        
        // Delete the feature
        await prismaClient.platformSubscriptionPlanFeature.delete({
            where: { id: featureId }
        });
        
        res.status(200).json({
            success: true,
            message: "Feature deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting platform subscription plan feature:", error); 
        res.status(500).json({ 
            success: false,
            message: "Failed to delete platform subscription plan feature" 
        });
    }
};