import { Request, Response } from 'express';
import { prismaClient } from "@repo/db";

export const getUserPaymentMethods = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ status: "error", message: "Authentication required" });
            return;
        }

        const paymentMethods = await prismaClient.userPaymentMethod.findMany({
            where: { 
                userId,
                deletedAt: null
            },
            orderBy: [
                { priority: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        res.status(200).json({
            status: "success",
            data: paymentMethods
        });
    } catch (error) {
        console.error("Get payment methods error:", error);
        res.status(500).json({ status: "error", message: "Failed to fetch payment methods" });
    }
};

export const getUserPaymentMethodById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { paymentMethodId } = req.params;
        
        if (!userId) {
            res.status(401).json({ status: "error", message: "Authentication required" });
            return;
        }

        const paymentMethod = await prismaClient.userPaymentMethod.findFirst({
            where: { 
                id: paymentMethodId,
                userId,
                deletedAt: null
            }
        });

        if (!paymentMethod) {
            res.status(404).json({ 
                status: "error", 
                message: "Payment method not found" 
            });
            return;
        }

        res.status(200).json({
            status: "success",
            data: paymentMethod
        });
    } catch (error) {
        console.error("Get payment method by ID error:", error);
        res.status(500).json({ status: "error", message: "Failed to fetch payment method" });
    }
};

export const createPaymentMethod = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ 
                status: "error", 
                message: "Authentication required" 
            });
            return;
        }

        const { type, priority, bankName, accountNumber, ifscCode, accountHolderName, upiId, upiName } = req.body;

        // Check if user already has a primary method of this type
        if (priority === 'PRIMARY') {
            const existingPrimary = await prismaClient.userPaymentMethod.findFirst({
                where: {
                    userId,
                    type,
                    priority: 'PRIMARY',
                    deletedAt: null
                }
            });

            if (existingPrimary) {
                // Update existing primary to secondary
                await prismaClient.userPaymentMethod.update({
                    where: { id: existingPrimary.id },
                    data: { priority: 'SECONDARY' }
                });
            }
        }

        const paymentMethod = await prismaClient.userPaymentMethod.create({
            data: {
                userId,
                type,
                priority,
                bankName,
                accountNumber,
                ifscCode,
                accountHolderName,
                upiId,
                upiName
            }
        });

        res.status(201).json({
            status: "success",
            message: "Payment method created successfully",
            data: paymentMethod
        });
    } catch (error) {
        console.error("Create payment method error:", error);
        res.status(500).json({ status: "error", message: "Failed to create payment method" });
    }
};

export const updatePaymentMethod = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { paymentMethodId } = req.params;
        
        if (!userId) {
            res.status(401).json({ status: "error", message: "Authentication required" });
            return;
        }

        // Verify ownership
        const existingMethod = await prismaClient.userPaymentMethod.findFirst({
            where: { id: paymentMethodId, userId, deletedAt: null }
        });

        if (!existingMethod) {
            res.status(404).json({ status: "error", message: "Payment method not found" });
            return;
        }

        const { priority, bankName, accountNumber, ifscCode, accountHolderName, upiId, upiName } = req.body;

        // Handle priority change
        if (priority === 'PRIMARY' && existingMethod.priority !== 'PRIMARY') {
            const existingPrimary = await prismaClient.userPaymentMethod.findFirst({
                where: {
                    userId,
                    type: existingMethod.type,
                    priority: 'PRIMARY',
                    deletedAt: null
                }
            });

            if (existingPrimary) {
                await prismaClient.userPaymentMethod.update({
                    where: { id: existingPrimary.id },
                    data: { priority: 'SECONDARY' }
                });
            }
        }

        const updatedMethod = await prismaClient.userPaymentMethod.update({
            where: { id: paymentMethodId },
            data: {
                priority,
                bankName,
                accountNumber,
                ifscCode,
                accountHolderName,
                upiId,
                upiName,
                status: 'PENDING' // Reset to pending when updated
            }
        });

        res.status(200).json({
            status: "success",
            message: "Payment method updated successfully",
            data: updatedMethod
        });
    } catch (error) {
        console.error("Update payment method error:", error);
        res.status(500).json({ status: "error", message: "Failed to update payment method" });
    }
};

export const deletePaymentMethod = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { paymentMethodId } = req.params;
        
        if (!userId) {
            res.status(401).json({ status: "error", message: "Authentication required" });
            return;
        }

        // Verify ownership
        const existingMethod = await prismaClient.userPaymentMethod.findFirst({
            where: { id: paymentMethodId, userId, deletedAt: null }
        });

        if (!existingMethod) {
            res.status(404).json({ status: "error", message: "Payment method not found" });
            return;
        }

        // Soft delete
        await prismaClient.userPaymentMethod.update({
            where: { id: paymentMethodId },
            data: { deletedAt: new Date() }
        });

        res.status(200).json({
            status: "success",
            message: "Payment method deleted successfully"
        });
    } catch (error) {
        console.error("Delete payment method error:", error);
        res.status(500).json({ status: "error", message: "Failed to delete payment method" });
    }
};