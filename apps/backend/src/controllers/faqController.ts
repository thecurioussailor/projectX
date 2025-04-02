import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export const createFaq = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { question, answer } = req.body;
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

        const faq = await prismaClient.fAQ.create({
            data: {
                question,
                answer,
                productId
            }
        });

        res.status(201).json({
            success: true,
            data: faq
        });
    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ error: "Failed to create FAQ" });
    }
};

export const getFaqs = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const faqs = await prismaClient.fAQ.findMany({
            where: {
                productId,
                product: {
                    creatorId: userId
                }
            }
        });

        res.json({
            success: true,
            data: faqs
        });
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ error: "Failed to fetch FAQs" });
    }
};

export const updateFaq = async (req: Request, res: Response) => {
    try {
        const { faqId } = req.params;
        const { question, answer } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const faq = await prismaClient.fAQ.update({
            where: {
                id: faqId,
                product: {
                    creatorId: userId
                }
            },
            data: {
                question,
                answer
            }
        });

        res.json({
            success: true,
            data: faq
        });
    } catch (error) {
        console.error('Error updating FAQ:', error);
        res.status(500).json({ error: "Failed to update FAQ" });
    }
};

export const deleteFaq = async (req: Request, res: Response) => {
    try {
        const { faqId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

            await prismaClient.fAQ.delete({
            where: {
                id: faqId,
                product: {
                    creatorId: userId
                }
            }
        });

        res.json({
            success: true,
            message: "FAQ deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({ error: "Failed to delete FAQ" });
    }
}; 