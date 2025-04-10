import { Request, Response } from "express";
import { prismaClient } from "@repo/db";

export const getPurchasedItems = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const telegramSubscriptions = await prismaClient.telegramSubscription.findMany({
            where: {
                userId: userId
            }
        });

        const digitalProducts = await prismaClient.digitalProductPurchase.findMany({
            where: {
                userId: userId
            },
            include: {
                product: {
                    select: {
                        title: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            data: {
                telegramSubscriptions,
                digitalProducts
            }
        });
    } catch (error) {
        console.error("Get purchased items error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

