import { Request, Response } from "express";
import { prismaClient } from "@repo/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { updateWalletBalance } from "./walletController.js";
import { createNotification } from "./notificationController.js";

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

export const updateAdminPassword = async (req: Request, res: Response) => {
    try {   
        const userId = req.user?.id;
        const { oldPassword, newPassword, confirmPassword } = req.body;
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
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password); 
          
        if(!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid old password'
            });
            return;
        }
        if(newPassword !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'New password and confirm password do not match'
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prismaClient.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        }); 
        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Update password error:', error);
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

export const getAdminDashboard = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if(!userId || req.user?.role !== "ADMIN") {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

         // User statistics
         const totalUsers = await prismaClient.user.count();
         const totalAdmins = await prismaClient.user.count({
             where: { role: "ADMIN" }
         });
         
         // Financial data
         const totalWithdrawalRequests = await prismaClient.withdrawalRequest.count();
         const pendingWithdrawals = await prismaClient.withdrawalRequest.count({
             where: { status: "PENDING" }
         });
         const totalTransactions = await prismaClient.transaction.count();
         
         // Subscription data
         const totalPlatformSubscriptionPlans = await prismaClient.platformSubscriptionPlan.count();
         const activeSubscriptions = await prismaClient.userPlatformSubscription.count({
             where: { status: "ACTIVE" }
         });
         
         // Product data
         const totalDigitalProducts = await prismaClient.digitalProduct.count();
         const totalOrders = await prismaClient.order.count();
         
         // Verification data
         const totalKYCDocuments = await prismaClient.kycDocument.count();
         const pendingKYC = await prismaClient.kycDocument.count({
             where: { status: "PENDING" }
         });
         
         // Telegram data
         const totalTelegramAccounts = await prismaClient.telegramAccount.count();
         const totalTelegramChannels = await prismaClient.telegramChannel.count();
         const totalTelegramSubscriptions = await prismaClient.telegramSubscription.count();
 
         res.status(200).json({
             success: true,
             message: 'Dashboard fetched successfully',
             data: {
                 users: {
                     totalUsers,
                     totalAdmins
                 },
                 finance: {
                     totalWithdrawalRequests,
                     pendingWithdrawals,
                     totalTransactions
                 },
                 subscriptions: {
                     totalPlatformSubscriptionPlans,
                     activeSubscriptions
                 },
                 products: {
                     totalDigitalProducts,
                     totalOrders
                 },
                 verification: {
                     totalKYCDocuments,
                     pendingKYC
                 },
                 telegram: {
                     totalTelegramAccounts,
                     totalTelegramChannels,
                     totalTelegramSubscriptions
                 }
             }
         });
    } catch (error) {
        console.error('Dashboard error:', error);
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
        const { status, transactionId, paymentMethod, bankName, accountNumber, adminNotes } = req.body;
        if(!userId || req.user?.role !== "ADMIN") {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        const withdrawal = await prismaClient.withdrawalRequest.findUnique({
            where: { id: withdrawalId },
            include: {
                wallet: true
            }
        });
        if(!withdrawal) {
            res.status(404).json({
                success: false,
                message: 'Withdrawal request not found' 
            });
            return;
        }

        if(withdrawal.status === "PAID") {
            res.status(400).json({
                success: false,
                message: 'Withdrawal request already paid'
            });
            return;
        }

        if(withdrawal.status === "CANCELLED") {
            res.status(400).json({
                success: false,
                message: 'Withdrawal request already cancelled'
            });
            return;
        }
        if(withdrawal.status === "REJECTED") {
            res.status(400).json({
                success: false,
                message: 'Withdrawal request already rejected'
            });
            return;
        }

        let updatedWithdrawal;
        if(status === "PAID") {

            await prismaClient.$transaction(async (tx) => {
            updatedWithdrawal = await tx.withdrawalRequest.update({
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
            await tx.wallet.update({
                where: { id: withdrawal.wallet.id },
                data: {
                    pendingBalance: { decrement: withdrawal.amount },
                    totalWithdrawn: { increment: withdrawal.amount }
                }
            });
            });
            await createNotification(withdrawal.wallet.userId.toString(), "Withdrawal Request Approved", `Your withdrawal request of ${withdrawal.amount} has been approved`, "SUCCESS");
        }

        if(status === "REJECTED") {
            await prismaClient.$transaction(async (tx) => {
                updatedWithdrawal = await tx.withdrawalRequest.update({
                    where: { id: withdrawalId },
                    data: { status, processedAt: new Date(), processedBy: req.user?.role, adminNotes }
                });
                await tx.wallet.update({
                    where: { id: withdrawal.wallet.id },
                    data: {
                        pendingBalance: { decrement: withdrawal.amount },
                        withdrawableBalance: { increment: withdrawal.amount }
                    }
                });
            });
            await createNotification(withdrawal.wallet.userId.toString(), "Withdrawal Request Rejected", `Your withdrawal request of ${withdrawal.amount} has been rejected`, "ERROR");
        }
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
