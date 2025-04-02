import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export const createTestimonial = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        console.log(req.body);
        const { name, description, rating } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Verify product ownership
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

        const testimonial = await prismaClient.testimonial.create({
            data: {
                name,
                description,
                rating,
                productId
            }
        });

        res.status(201).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ error: "Failed to create testimonial" });
    }
};

export const getTestimonials = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const testimonials = await prismaClient.testimonial.findMany({
            where: {
                productId,
                product: {
                    creatorId: userId
                }
            }
        });

        res.json({
            success: true,
            data: testimonials
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: "Failed to fetch testimonials" });
    }
};

export const updateTestimonial = async (req: Request, res: Response) => {
    try {
        const { testimonialId } = req.params;
        const { name, description, rating, image } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const testimonial = await prismaClient.testimonial.update({
            where: {
                id: testimonialId,
                product: {
                    creatorId: userId
                }
            },
            data: {
                name,
                description,
                rating,
                image
            }
        });

        res.json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ error: "Failed to update testimonial" });
    }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
    try {
        const { testimonialId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        await prismaClient.testimonial.delete({
            where: {
                id: testimonialId,
                product: {
                    creatorId: userId
                }
            }
        });

        res.json({
            success: true,
            message: "Testimonial deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ error: "Failed to delete testimonial" });
    }
}; 