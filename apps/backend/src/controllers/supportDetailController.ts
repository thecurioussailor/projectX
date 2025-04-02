import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export const createSupportDetail = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { email, phone, whatsapp, telegram } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const product = await prismaClient.digitalProduct.findUnique({
            where: {
                id: productId,
                creatorId: userId
            }
        });

        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        const supportDetail = await prismaClient.supportDetail.create({
            data: {
                email,
                phone,
                whatsapp,
                telegram,
                productId
            }
        });

        res.status(201).json({
            success: true,
            data: supportDetail
        });
    } catch (error) {
        console.error('Error creating support detail:', error);
        res.status(500).json({ error: "Failed to create support detail" });
    }
};

export const getSupportDetails = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const supportDetails = await prismaClient.supportDetail.findMany({
            where: {
                productId,
                product: {
                    creatorId: userId
                }
            }
        });

        res.json({
            success: true,
            data: supportDetails
        });
    } catch (error) {
        console.error('Error fetching support details:', error);
        res.status(500).json({ error: "Failed to fetch support details" });
    }
};

export const updateSupportDetail = async (req: Request, res: Response) => {
    try {
        const { productId, supportDetailId } = req.params;
        const { email, phone, whatsapp, telegram } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const supportDetail = await prismaClient.supportDetail.update({
            where: {
                id: supportDetailId,
                product: {
                    creatorId: userId
                }
            },
            data: {
                email,
                phone,
                whatsapp,
                telegram
            }
        });

        res.json({
            success: true,
            data: supportDetail
        });
    } catch (error) {
        console.error('Error updating support detail:', error);
        res.status(500).json({ error: "Failed to update support detail" });
    }
};

export const deleteSupportDetail = async (req: Request, res: Response) => {
    try {
        const { supportDetailId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        await prismaClient.supportDetail.delete({
            where: {
                id: supportDetailId,
                product: {
                    creatorId: userId
                }
            }
        });

        res.json({
            success: true,
            message: "Support detail deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting support detail:', error);
        res.status(500).json({ error: "Failed to delete support detail" });
    }
}; 