import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import { prismaClient } from "@repo/db";
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

enum DocumentType {
    PAN = "PAN",
    PASSPORT = "PASSPORT",
    DRIVERS_LICENSE = "DRIVERS_LICENSE",
    NATIONAL_ID = "NATIONAL_ID",
    VOTER_ID = "VOTER_ID",
    TAX_ID = "TAX_ID",
    UTILITY_BILL = "UTILITY_BILL",
    BANK_STATEMENT = "BANK_STATEMENT",
    OTHER = "OTHER"
  }

export const getUploadKycUrl = async (req: Request, res: Response) => {
    try {
        const { documentType, documentNumber, documentName } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }

        if (!Object.values(DocumentType).includes(documentType)) {
            res.status(400).json({ 
                success: false,
                message: "Invalid document type" 
            });
            return;
        }

        // Check if file name is provided and is PDF
        if (!documentName || !documentName.toLowerCase().endsWith('.pdf')) {
            res.status(400).json({ 
                success: false,
                message: "Document must be a PDF file" 
            });
            return;
        }

        // Find and delete existing KYC documents of this type
        const existingDocument = await prismaClient.kycDocument.findFirst({
            where: {
                userId,
                documentType
            }
        });

        let existingS3Key = existingDocument?.s3Key;

        // Generate a unique file key
        const fileExtension = documentName.split('.').pop();
        const timestamp = Date.now();
        const uniqueId = crypto.randomUUID();

        const s3Key = `${userId}/kyc/${documentType}/${timestamp}-${uniqueId}.${fileExtension}`;
        
        // Create the command to put the object
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            ContentType: 'application/pdf'
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });


        if (existingS3Key) {
            try {
                const deleteCommand = new DeleteObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: existingS3Key
                });
                await s3Client.send(deleteCommand);
            } catch (deleteError) {
                console.error('Error deleting existing document from S3:', deleteError);
                // Continue with the upload even if deletion fails
            }
        }

        res.json({
            success: true,
            data: {
                uploadUrl: presignedUrl,
                s3Key: s3Key,
                documentType,
                documentNumber,
                documentName
            }
        });

    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
    
}

export const uploadKycDocument = async (req: Request, res: Response) => {
    try {
        const { s3Key, documentType, documentNumber, documentName } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }

        // Verify the object exists in S3
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
        });

        await s3Client.send(command);

        // Check if user already has a KYC document
        const existingDocument = await prismaClient.kycDocument.findUnique({
            where: {
                userId
            }
        });

        let kycDocument;

        if (existingDocument) {
            // Update existing document
            kycDocument = await prismaClient.kycDocument.update({
                where: {
                    id: existingDocument.id
                },
                data: {
                    documentType,
                    documentNumber,
                    documentName,
                    s3Key,
                    status: 'PENDING'
                }
            });
        } else {
            // Create new document
            kycDocument = await prismaClient.kycDocument.create({
                data: {
                    userId,
                    documentType,
                    documentNumber,
                    documentName,
                    s3Key,
                    status: 'PENDING'
                }
            });
        }

        res.json({
            success: true,
            message: "Document uploaded successfully",
            data: {
                id: kycDocument.id,
                documentType: kycDocument.documentType,
                documentNumber: kycDocument.documentNumber,
                documentName: kycDocument.documentName,
                status: kycDocument.status
            }
        });
    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}

export const getKycDocument = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
            return;
        }

        const document = await prismaClient.kycDocument.findFirst({
            where: {
                userId
            }
        });

        if (!document || !document.s3Key) {
            res.status(404).json({ 
                success: false,
                message: "KYC document not found" 
            });
            return;
        }

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: document.s3Key
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        res.status(200).json({
            success: true,
            data: {
                id: document.id,
                documentType: document.documentType,
                documentNumber: document.documentNumber,
                documentName: document.documentName,
                status: document.status,
                url: signedUrl,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt
            }
        });
    } catch (error) {
        console.error('Get KYC document error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}

