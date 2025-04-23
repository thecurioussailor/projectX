import { Request, Response } from "express";
import { prismaClient } from "@repo/db";
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const admin = req.user;

        if (!admin || admin.role !== "ADMIN") {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        const users = await prismaClient.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                role: true,
                profileImage: true,
                coverImage: true,
                location: true,
                emailVerified: true,
                emailVerifiedAt: true,
                isBanned: true,
                createdAt: true,
            }
        });
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error
        });
    }
}

export const getUserById = async (req: Request, res: Response) => {
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
        const user = await prismaClient.user.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                location: true,
                emailVerified: true,
                emailVerifiedAt: true,
                isBanned: true,
                createdAt: true,
                wallet: true,
                orders: true,
                transactions: true,
                links: true,
                telegramSubscriptions: true,
                digitalProductPurchases: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error
        });
    }   
}   

export const banUser = async (req: Request, res: Response) => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== "admin") {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        const { id } = req.params;

        const user = await prismaClient.user.update({
            where: {
                id: parseInt(id)
            },
            data: { 
                isBanned: true
            }
        });
        res.status(200).json({
            success: true,
            message: "User banned successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error banning user",
            error: error
        });
    }
}

export const unbanUser = async (req: Request, res: Response) => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== "admin") {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        const { id } = req.params;
        const user = await prismaClient.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                isBanned: false
            }
        });
        res.status(200).json({
            success: true,  
            message: "User unbanned successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error unbanning user",
            error: error
        });
    }
}

