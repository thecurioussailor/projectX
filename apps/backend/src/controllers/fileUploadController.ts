import { prismaClient } from "@repo/db";
import { Request, Response } from "express";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

export const getUploadUrl = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { fileName, fileType } = req.body;
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

        // Generate a unique file key
        const fileExtension = fileName.split('.').pop();
        console.log(fileName, fileExtension, fileType);
        const timestamp = Date.now();
        const uniqueId = crypto.randomUUID();

        const fileKey = `products/${productId}/${timestamp}-${uniqueId}.${fileExtension}`;

        // Create the command to put the object
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
            ContentType: fileType
        });

        // Generate the presigned URL
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        // Create a record in the database
        const file = await prismaClient.digitalFile.create({
            data: {
                fileName,
                fileUrl: fileKey,
                fileType,
                productId,
                fileSize: 0,
                s3Key: fileKey
            }
        });

        res.json({
            success: true,
            data: {
                uploadUrl: presignedUrl,
                fileKey,
                file
            }
        });
    } catch (error) {
        console.error('Error generating upload URL:', error);
        res.status(500).json({ error: "Failed to generate upload URL" });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    try {
        const { productId, fileId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Verify product ownership and get file details
        const file = await prismaClient.digitalFile.findFirst({
            where: {
                id: fileId,
                product: {
                    id: productId,
                    creatorId: userId
                }
            }
        });

        if (!file) {
            res.status(404).json({ error: "File not found" });
            return;
        }

        // Delete from S3
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: file.s3Key
        });

        await s3Client.send(command);

        // Delete from database
        await prismaClient.digitalFile.delete({
            where: {
                id: fileId
            }
        });

        res.json({
            success: true,
            message: "File deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: "Failed to delete file" });
    }
}; 