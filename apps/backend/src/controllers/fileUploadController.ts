import { prismaClient } from "@repo/db";
import { Request, Response } from "express";
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
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
            res.status(401).json({ 
                success: false,
                message: "Unauthorized"
            });
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
        const timestamp = Date.now();
        const uniqueId = crypto.randomUUID();

        const s3Key = `${userId}/products/${productId}/files/${timestamp}-${uniqueId}.${fileExtension}`;

        // Create the command to put the object
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            ContentType: fileType
        });

        // Generate the presigned URL
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });


        res.json({
            success: true,
            data: {
                uploadUrl: presignedUrl,
                s3Key: s3Key,
                fileType
            }
        });
    } catch (error) {
        console.error('Error generating upload URL:', error);
        res.status(500).json({ error: "Failed to generate upload URL" });
    }
};

export const uploadDigitalProductFile = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { s3Key, fileType } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }   

        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
        });

        await s3Client.send(command);



        const digitalFile = await prismaClient.digitalFile.create({
            data: {
                fileName: s3Key.split('/').pop() || '',
                fileType: fileType,
                productId,
                fileUrl: s3Key,
                fileSize: 0,
                s3Key: s3Key
            }
        });

        res.json({
            success: true,
            message: "File uploaded successfully",
            data: digitalFile
        }); 
    } catch (error) {
        console.error('Error uploading digital product file:', error);
        res.status(500).json({ error: "Failed to upload digital product file" });
    }
}   

export const getDigitalProductFiles = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const digitalFiles = await prismaClient.digitalFile.findMany({
            where: {
                productId
            }
        });

        const files = await Promise.all(digitalFiles.map(async (file) => {
            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: file.s3Key
            });

            const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            
            return {
                ...file,
                presignedUrl
            }
        }));

        res.status(200).json({
            success: true,
            data: files
        });
    } catch (error) {
        console.error('Error getting digital product files:', error);
        res.status(500).json({ error: "Failed to get digital product files" });
    }
}   

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

//cover image for digital product
export const getUploadCoverUrl = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { fileName, fileType } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        if(fileType !== "IMAGE") {
            res.status(400).json({ 
                success: false,
                message: "Invalid file type" 
            });
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
        const timestamp = Date.now();
        const uniqueId = crypto.randomUUID();

        const s3Key = `${userId}/products/${productId}/cover/${timestamp}-${uniqueId}.${fileExtension}`;

        // Create the command to put the object
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            ContentType: fileType
        });

        // Generate the presigned URL
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });


        res.json({
            success: true,
            data: {
                uploadUrl: presignedUrl,
                s3Key: s3Key,
                fileType
            }
        });
    } catch (error) {
        console.error('Error generating upload URL:', error);
        res.status(500).json({ error: "Failed to generate upload URL" });
    }
}   

export const uploadCoverImage = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { s3Key } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized"
            });
            return;
        }   

        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
        });

        await s3Client.send(command);

        const digitalProduct = await prismaClient.digitalProduct.update({
            where: {
                id: productId
            },
            data: {
                coverImage: s3Key
            }
        });

        res.json({
            success: true,
            message: "File uploaded successfully",
            data: digitalProduct
        });
    } catch (error) {
        console.error('Error uploading cover image:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to upload cover image"
         });
    }
};

export const getCoverImage = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            res.status(404).json({
                success: false, 
                message: 'User not found'
            });
            return;
        }

        const product = await prismaClient.digitalProduct.findUnique({
            where: {
                id: productId
            }
        });

        if (!product || !product.coverImage) {
        res.status(404).json({
            success: false,
            message: 'Cover picture not found'
        });
        return;
        }

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: product.coverImage
        });

        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600 // 1 hour
        }); 

        res.status(200).json({
            success: true,
            data: {
                url: signedUrl
            }
        }); 
    } catch (error) {
        console.error('Error getting cover image:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get cover image"
        });
    }
};  




