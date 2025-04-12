import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

export const getDigitalProductFiles = async (req: Request, res: Response) => {
    try {
        const { purchasedItemId } = req.params;

        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Unauthorized"
            });
            return;
        }

        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found"
            });
            return;
        }

        const purchasedItem = await prismaClient.digitalProductPurchase.findUnique({
            where: { 
                id: purchasedItemId,
                userId: userId,
                status: "ACTIVE"
            },
            include: {
                product: {
                    select: {
                        id: true,
                        creatorId: true,
                        title: true,
                        description: true,
                        files: true
                    }
                }
            }
        });

        if (!purchasedItem) {
            res.status(404).json({
                status: "error",
                message: "Purchase not found or unauthorized access"
            });
            return;
        }

        const files = await Promise.all(purchasedItem.product.files.map(async (file) => {
            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME || '',
                Key: file.s3Key,
            });
            
            const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            
            return {
                id: file.id,
                type: file.fileType,
                presignedUrl
            }
        }))

        res.json({
            status: "success",
            message: "Digital files",
            data: files
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};