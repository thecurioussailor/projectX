import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export const createRegistrationQuestion = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { question, fieldType, fieldOptions, isRequired } = req.body;
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

        const registrationQuestion = await prismaClient.registrationQuestion.create({
            data: {
                question,
                fieldType,
                fieldOptions,
                isRequired,
                productId
            }
        });

        res.status(201).json({
            success: true,
            data: registrationQuestion
        });
    } catch (error) {
        console.error('Error creating registration question:', error);
        res.status(500).json({ error: "Failed to create registration question" });
    }
};

export const getRegistrationQuestions = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const questions = await prismaClient.registrationQuestion.findMany({
            where: {
                productId,
                product: {
                    creatorId: userId
                }
            }
        });

        res.json({
            success: true,
            data: questions
        });
    } catch (error) {
        console.error('Error fetching registration questions:', error);
        res.status(500).json({ error: "Failed to fetch registration questions" });
    }
};

export const updateRegistrationQuestion = async (req: Request, res: Response) => {
    try {
        const { productId, registrationQuestionId } = req.params;
        const { question, type, options, required } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const registrationQuestion = await prismaClient.registrationQuestion.update({
            where: {
                id: registrationQuestionId,
                product: {
                    creatorId: userId
                }
            },
            data: {
                question,
                fieldType: type,
                fieldOptions: options,
                isRequired: required
            }
        });

        res.json({
            success: true,
            data: registrationQuestion
        });
    } catch (error) {
        console.error('Error updating registration question:', error);
        res.status(500).json({ error: "Failed to update registration question" });
    }
};

export const deleteRegistrationQuestion = async (req: Request, res: Response) => {
    try {
        const { productId, registrationQuestionId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        await prismaClient.registrationQuestion.delete({
            where: {
                id: registrationQuestionId,
                product: {
                    creatorId: userId
                }
            }
        });

        res.json({
            success: true,
            message: "Registration question deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting registration question:', error);
        res.status(500).json({ error: "Failed to delete registration question" });
    }
}; 