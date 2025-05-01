import { Request, Response } from "express";
import { prismaClient } from "@repo/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminSignin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
    
        if (!username || !password) {
          res.status(400).json({ 
            success: false, 
            message: 'Username and password are required' 
          });
          return;
        }
    
        const user = await prismaClient.user.findUnique({
          where: { username }
        });
    
        if (!user || user.role !== "ADMIN") {
            res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials or user is not an admin' 
          });
          return;
        }
    
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
          });
          return;
        }
    
        const token = jwt.sign({
          id: user.id,
          username: user.username,
          role: user.role
        }, process.env.JWT_SECRET!);
    
        res.status(200).json({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: user.id,
              username: user.username,
              role: user.role
            },
            token
          }
        });
      } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Internal server error' 
        });
      }
}

export const adminProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if(!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });

        if(!user || user.role !== "ADMIN") {
            res.status(404).json({
                success: false,
                message: 'User not found or not an admin'
            });
            return;
        }
        res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        data: user
    });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const approveWithdrawalRequest = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { withdrawalId } = req.params;
        const { status, transactionId, paymentMethod, bankName, accountNumber } = req.body;
        if(!userId || req.user?.role !== "ADMIN") {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        const withdrawal = await prismaClient.withdrawalRequest.findUnique({
            where: { id: withdrawalId }
        });
        if(!withdrawal) {
            res.status(404).json({
                success: false,
                message: 'Withdrawal request not found' 
            });
            return;
        }
        const updatedWithdrawal = await prismaClient.withdrawalRequest.update({
            where: { id: withdrawalId },
            data: { 
                status,
                paymentMethod,
                paymentDetails: {
                    bankName,
                    accountNumber
                },
                transactionId, 
                processedAt: new Date(), 
                processedBy: req.user?.role
            }
        });
        res.status(200).json({
            success: true,
            message: 'Withdrawal request approved successfully',
            data: updatedWithdrawal
        });
    } catch (error) {
        console.error('Approve withdrawal request error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        }); 
    }
}

export const rejectWithdrawalRequest = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { withdrawalId } = req.params;
        const { adminNotes } = req.body;
        if(!userId || req.user?.role !== "ADMIN") {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        const withdrawal = await prismaClient.withdrawalRequest.findUnique({
            where: { id: withdrawalId }
        }); 
        if(!withdrawal) {
            res.status(404).json({
                success: false,
                message: 'Withdrawal request not found'
            });
            return;
        }
        const updatedWithdrawal = await prismaClient.withdrawalRequest.update({
            where: { id: withdrawalId },
            data: { 
                status: "REJECTED", 
                adminNotes, 
                processedAt: new Date(), 
                processedBy: req.user?.role 
            }
        });
        res.status(200).json({
            success: true,
            message: 'Withdrawal request rejected successfully',
            data: updatedWithdrawal
        });
    } catch (error) {
        console.error('Reject withdrawal request error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getAllWithdrawalRequests = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if(!userId || req.user?.role !== "ADMIN") {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        const withdrawalRequests = await prismaClient.withdrawalRequest.findMany({  
            include: {
                wallet: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            message: 'Withdrawal requests fetched successfully',
            data: withdrawalRequests
        });
    } catch (error) {
        console.error('Withdrawal requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
