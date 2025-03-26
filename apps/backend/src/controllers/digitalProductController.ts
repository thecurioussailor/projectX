import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export const createDigitalProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;
        const digitalProduct = await prismaClient.digitalProduct.create({
            data: { name, description, price, user: { connect: { id: req.user?.id } } },
        });
        res.json(digitalProduct);
    } catch (error) {
        res.status(500).json({ error: "Failed to create digital product" });
    }
};
