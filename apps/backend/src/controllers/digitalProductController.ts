import { prismaClient } from "@repo/db";
import { Request, Response } from "express";
import { authenticate } from "../middleware/auth.js";

// Create a draft digital product
export const createDigitalProduct = async (req: Request, res: Response) => {
    try {
        const {
            title,
            description,
            category,
            price,
            priceType,
            hasDiscount,
            discountedPrice
        } = req.body;

        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // Validate required fields
        console.log(title, price, description, category, priceType, hasDiscount, discountedPrice);
        if (!title || !price || !description || !category || !priceType || !discountedPrice) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            }
        }); 

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }    

        const digitalProduct = await prismaClient.digitalProduct.create({
            data: {
                creatorId: userId,
                title,
                description,
                category,
                price,
                priceType: priceType || 'FIXED',
                hasDiscount: hasDiscount || false,
                discountedPrice: hasDiscount ? discountedPrice : null,
                status: 'PENDING',
                files: { create: [] },
                testimonials: { create: [] },
                faqs: { create: [] },
                galleryImages: { create: [] },
                registrationQns: { create: [] },
                supportDetails: { create: [] }
            },
            include: {
                files: true,
                testimonials: true,
                faqs: true,
                galleryImages: true,
                registrationQns: true,
                supportDetails: true,
                _count: {
                    select: {
                        orders: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            data: digitalProduct
        });
    } catch (error) {
        console.error('Error creating digital product:', error);
        res.status(500).json({ 
            success: false,
            error: "Failed to create digital product" 
        });
    }
};

// Get all digital products for the current user
export const getDigitalProducts = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const products = await prismaClient.digitalProduct.findMany({
            where: {
                creatorId: userId
            },
            include: {
                files: true,
                testimonials: true,
                faqs: true,
                galleryImages: true,
                registrationQns: true,
                supportDetails: true,                
                _count: {
                    select: {
                        orders: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching digital products:', error);
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch digital products" 
        });
    }
};

// Get a single digital product by ID
export const getDigitalProductById = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const product = await prismaClient.digitalProduct.findUnique({
            where: {
                id: productId,
                creatorId: userId
            },
            include: {
                files: true,
                testimonials: true,
                faqs: true,
                galleryImages: true,
                registrationQns: true,
                supportDetails: true
            }
        });

        if (!product) {
            res.status(404).json({ 
                success: false,
                error: "Digital product not found" 
            });
            return;
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching digital product:', error);
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch digital product" 
        });
    }
};

// Get a public digital product by slug
export const getPublicDigitalProductBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;    

        const product = await prismaClient.digitalProduct.findUnique({
            where: {
                id: slug,
                status: "ACTIVE"
            },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                price: true,
                priceType: true,
                hasDiscount: true,
                discountedPrice: true,
                status: true,
                ctaButtonText: true,
                testimonials: true,
                faqs: true,
                galleryImages: true,
                registrationQns: true,
                supportDetails: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!product) {
            res.status(404).json({ 
                success: false,
                error: "Digital product not found" 
            });
            return;
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching public digital product:', error);
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch public digital product" 
        });
    }   
};


// Update a digital product
export const updateDigitalProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const updateData = req.body;

        // Check if product exists and belongs to user
        const existingProduct = await prismaClient.digitalProduct.findUnique({
            where: {
                id: productId,
                creatorId: userId
            }
        });

        if (!existingProduct) {
            res.status(404).json({ 
                success: false,
                error: "Digital product not found" 
            });
            return;
        }

        const updatedProduct = await prismaClient.digitalProduct.update({
            where: {
                id: productId
            },
            data: updateData,
            include: {
                files: true,
                testimonials: true,
                faqs: true,
                galleryImages: true,
                registrationQns: true,
                supportDetails: true
            }
        });

        res.json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error updating digital product:', error);
        res.status(500).json({ 
            success: false,
            error: "Failed to update digital product" 
        });
    }
};

// Delete a digital product
export const deleteDigitalProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }


        // Check if product exists and belongs to user
        const existingProduct = await prismaClient.digitalProduct.findUnique({
            where: {
                id: productId,
                creatorId: userId
            }
        }); 

        if (!existingProduct) {
            res.status(404).json({ 
                success: false,
                error: "Digital product not found" 
            });
            return;
        }

        await prismaClient.$transaction(async (tx) => {
            await tx.digitalFile.deleteMany({
                where: {
                    productId : productId
                }
            });
            await tx.testimonial.deleteMany({
                where: {
                    productId : productId
                }
            });
            await tx.fAQ.deleteMany({
                where: {
                    productId : productId
                }
            });
            await tx.galleryImage.deleteMany({
                where: {
                    productId : productId
                }
            });
            await tx.supportDetail.deleteMany({
                where: {
                    productId : productId
                }
            });
            await tx.registrationQuestion.deleteMany({
                where: {
                    productId : productId
                }
            });
            await tx.digitalProduct.delete({
                where: {
                    id: productId
                }
            });
        });

        res.json({
            success: true,
            message: "Digital product deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting digital product:', error);
        res.status(500).json({ 
            success: false,
            error: "Failed to delete digital product" 
        });
    }
};

// Publish a digital product
export const publishDigitalProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Check if product exists and belongs to user
        const existingProduct = await prismaClient.digitalProduct.findUnique({
            where: {
                id: productId,
                creatorId: userId
            },
            include: {
                files: true,
                testimonials: true,
                faqs: true,
                galleryImages: true,
                registrationQns: true,
                supportDetails: true
            }
        });

        if (!existingProduct) {
            res.status(404).json({ 
                success: false,
                error: "Digital product not found" 
            });
            return;
        }

        // Validate required fields for publishing
        if (!existingProduct.title || !existingProduct.price || existingProduct.files.length === 0) {
            res.status(400).json({ 
                success: false,
                error: "Product must have a title, price, and at least one file to be published" 
            });
            return;
        }

        const updatedProduct = await prismaClient.digitalProduct.update({
            where: {
                id: productId
            },
            data: {
                status: 'ACTIVE'
            },
            include: {
                files: true,
                testimonials: true,
                faqs: true,
                galleryImages: true,
                registrationQns: true,
                supportDetails: true
            }
        });

        res.json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error publishing digital product:', error);
        res.status(500).json({ 
            success: false,
            error: "Failed to publish digital product" 
        });
    }
};

// Unpublish a digital product
export const unpublishDigitalProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // Check if product exists and belongs to user
        const existingProduct = await prismaClient.digitalProduct.findUnique({
            where: {
                id: productId,
                creatorId: userId
            }
        });

        if (!existingProduct) {
                res.status(404).json({ 
                success: false,
                error: "Digital product not found" 
            });
            return;
        }

        const updatedProduct = await prismaClient.digitalProduct.update({
            where: {
                id: productId
            },
            data: {
                status: 'PENDING'
            },
            include: {
                files: true,
                testimonials: true,
                faqs: true,
                galleryImages: true,
                registrationQns: true,
                supportDetails: true
            }
        });

        res.json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error unpublishing digital product:', error);
        res.status(500).json({      
            success: false,
            error: "Failed to unpublish digital product" 
        });
    }
};

//Initiate purchase
export const initiatePurchase = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }   

        const product = await prismaClient.digitalProduct.findUnique({
            where: {
                id: productId
            }
        });         

        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        if (product.status !== "ACTIVE") {
            res.status(400).json({ error: "Product is not active" });
            return;
        }

    } catch (error) {
        console.error('Error initiating purchase:', error);
        res.status(500).json({
            success: false,
            error: "Failed to initiate purchase"
        });
    }
};
        
        
        
        
        



