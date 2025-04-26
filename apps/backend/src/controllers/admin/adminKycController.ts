import { Request, Response } from "express";
import { prismaClient } from "@repo/db";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
export const getAllKycDocuments = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        
        // Check if user is admin
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
            res.status(403).json({
                success: false,
                message: 'Forbidden: Admin access required'
            });
            return;
        }
        
        // Get paginated results
        const documents = await prismaClient.kycDocument.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
        });

        res.status(200).json({
            success: true,
            data: {
                documents,
            }
        });
    } catch (error) {
        console.error('Admin get KYC documents error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getKycDocumentById = async (req: Request, res: Response) => {
    try {
        const { documentId } = req.params;
        const userId = req.user?.id;
        
    // Check if user is admin
    const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
        res.status(403).json({
            success: false,
            message: 'Forbidden: Admin access required'
        });
        return;
    }

    // Find the document
    const document = await prismaClient.kycDocument.findUnique({
        where: {
            id: documentId
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    name: true
                }
            }
        }
    });

    if (!document) {
        res.status(404).json({
            success: false,
            message: 'Document not found'
        });
        return;
    }

    // Generate presigned URL for the document
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: document.s3Key
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600 // 1 hour
    });

    res.status(200).json({
        success: true,
        data: {
            ...document,
                presignedUrl
            }
        });
    } catch (error) {
        console.error('Admin get KYC document by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const updateKycDocumentStatus = async (req: Request, res: Response) => {
    try {
        const { documentId } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;
        
        // Check if user is admin
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
            res.status(403).json({
                success: false,
                message: 'Forbidden: Admin access required'
            });
            return;
        }

        // Validate status
        if (!['APPROVED', 'REJECTED', 'PENDING', 'RESUBMIT_REQUESTED'].includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
            return;
        }

        // Update document status
        const updatedDocument = await prismaClient.kycDocument.update({
            where: {
                id: documentId
            },
            data: {
                status,
                updatedAt: new Date()
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: `Document status updated to ${status}`,
            data: updatedDocument
        });
    } catch (error) {
        console.error('Update KYC status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};