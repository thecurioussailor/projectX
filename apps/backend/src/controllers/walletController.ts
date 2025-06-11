import { prismaClient } from "@repo/db";
import { Request, Response } from "express"
import { createNotification } from "./notificationController.js";

export const getUserWallet = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) {
            res.status(404).json({
                message: "User not found",
                success: false
            });
            return;
        }
        
        const wallet = await prismaClient.wallet.findUnique({
            where: {
                userId: user.id
            }
        });

        res.status(200).json({
            success: true,
            message: "Wallet fetched successfully",
            data: wallet
        });
        

    } catch (error) {
        console.log("Error fetching wallet", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
}
export const createWithdrawalRequest = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const { amount, userPaymentMethodId } = req.body;    

        if(!amount) {
            res.status(400).json({
                message: "Amount is required",
                success: false
            });
            return;
        }

        const user = await prismaClient.user.findUnique({
            where: {
                id: Number(userId)
            },
            include: {
                kycDocument: true
            }
        });

        if(!user) {
            res.status(404).json({
                message: "User not found",
                success: false
            });
            return;
        }

        const kycDocument = user.kycDocument;

        if(!kycDocument) {
            res.status(400).json({
                message: "KYC document not found",
                success: false
            }); 
            return;
        }

        const wallet = await prismaClient.wallet.findUnique({
            where: {
                userId: Number(userId)
            }
        });

        if(!wallet) {
            res.status(404).json({
                message: "Wallet not found",
                success: false
            });
            return;
        }

        if(amount > wallet.withdrawableBalance.toNumber()) {
            res.status(400).json({
                message: "Insufficient balance",
                success: false
            });
            return;
        }

        const result = await prismaClient.$transaction(async (tx) => {
            const withdrawalRequest = await tx.withdrawalRequest.create({
                data: {
                    walletId: wallet.id,
                    amount: amount,
                    userPaymentMethodId: userPaymentMethodId
                }
            });

            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    totalBalance: { decrement: amount },
                    withdrawableBalance: { decrement: amount },
                    pendingBalance: { increment: amount }
                }
            });

            return { withdrawalRequest, wallet };
        });

        res.status(200).json({
            success: true,
            message: "Withdrawal request created successfully",
            data: result.withdrawalRequest
        });
    } catch (error) {
        console.log("Error creating withdrawal request", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
}

export const cancelWithdrawalRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const withdrawalRequest = await prismaClient.withdrawalRequest.findUnique({
            where: {
                id: id,
                wallet: {
                    userId: Number(userId)
                }
            },
            include: {
                wallet: true
            }
        });

        if(!withdrawalRequest) {
            res.status(404).json({
                success: false,
                message: "Withdrawal request not found or you don't have permission to cancel it",
                
            });
            return;
        }

        // Check if the request is in a cancelable state
        if (withdrawalRequest.status !== 'PENDING') {
            res.status(400).json({
                success: false,
                message: `Cannot cancel a withdrawal request with status: ${withdrawalRequest.status}`
            });
            return;
        }

        const result = await prismaClient.$transaction(async (tx) => {
            // Update the withdrawal request status to CANCELLED
            const updatedRequest = await tx.withdrawalRequest.update({
                where: { id: withdrawalRequest.id },
                data: {
                    status: "CANCELLED", // Need to add this to the enum
                    adminNotes: "Cancelled by user",
                    updatedAt: new Date()
                }
            });

            // Return the funds to the withdrawable balance
            const updatedWallet = await tx.wallet.update({
                where: { id: withdrawalRequest.walletId },
                data: {
                    totalBalance: { increment: withdrawalRequest.amount },
                    withdrawableBalance: { increment: withdrawalRequest.amount },
                    pendingBalance: { decrement: withdrawalRequest.amount },
                    lastUpdated: new Date()
                }
            });
            return { withdrawalRequest: updatedRequest, wallet: updatedWallet };
        });

        res.status(200).json({
            success: true,
            message: "Withdrawal request cancelled successfully",
            data: result.withdrawalRequest
        });
    } catch (error) {
        console.log("Error cancelling withdrawal request", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
}

export const getWithdrawalRequests = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ 
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            }
        }); 

        if(!user) {
            res.status(404).json({
                message: "User not found",
                success: false
            });
            return;
        }

        const withdrawalRequests = await prismaClient.withdrawalRequest.findMany({
            where: {
                wallet: {
                    userId: user.id
                }
            },
            include: {
                userPaymentMethod: true
            }
        });

        res.status(200).json({
            success: true,
            message: "Withdrawal requests fetched successfully",
            data: withdrawalRequests
        }); 
    } catch (error) {
        console.log("Error fetching withdrawal requests", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
}

export const getWalletTransactions = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const transactions = await prismaClient.withdrawalTransaction.findMany({
            where: {
                withdrawalRequest: {
                    wallet: {
                        userId: userId
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: "Transactions fetched successfully",
            data: transactions
        });
    } catch (error) {
        console.log("Error fetching transactions", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
}

//helper function to update wallet balance
export const updateWalletBalance = async (userId: string, amount: number) => {
    try {
        let wallet = await prismaClient.wallet.findUnique({
            where: {
                userId: Number(userId)
            }
        });

        if(!wallet) {
            wallet = await prismaClient.wallet.create({
                data: {
                    userId: Number(userId),
                    totalBalance: 0,
                    withdrawableBalance: 0,
                    totalCharges: 0,
                    pendingBalance: 0,
                    totalEarnings: 0,
                    totalWithdrawn: 0
                }
            });
        }

        // Get current date
        const currentDate = new Date();

        const userSubscription = await prismaClient.userPlatformSubscription.findFirst({
            where: {
                userId: Number(userId),
                status: 'ACTIVE',
                endDate: {
                    gte: currentDate
                },
                NOT: {
                    platformPlan: {
                        isDefault: true
                    }
                }
            },
            include: {
                platformPlan: true
            },
            orderBy: {
                // Prioritize non-default plans
                platformPlan: {
                    transactionFeePercentage: 'asc'
                }
            }
        });

        // If no active non-default subscription found, get the default plan
        if (!userSubscription) {
            const defaultSubscription = await prismaClient.userPlatformSubscription.findFirst({
                where: {
                    userId: Number(userId),
                    status: 'ACTIVE',
                    endDate: {
                        gte: currentDate
                    },
                    platformPlan: {
                        isDefault: true
                    }
                },
                include: {
                    platformPlan: true
                }
            });

            if (!defaultSubscription) {
                console.log("No active subscription found for user", userId);
                return false;
            }

            // Use default plan fee percentage
            const feePercentage = defaultSubscription.customFeePercentage || 
                                 defaultSubscription.platformPlan.transactionFeePercentage;
                                 
            const platformFee = (amount * Number(feePercentage)) / 100;
            const userAmount = amount - platformFee;

            await prismaClient.wallet.update({
                where: {
                    id: wallet.id
                },
                data: {
                    totalBalance: {
                        increment: userAmount
                    },
                    withdrawableBalance: {
                        increment: userAmount
                    },
                    totalEarnings: {
                        increment: userAmount
                    },
                    totalCharges: {
                        increment: platformFee
                    },
                    lastUpdated: new Date()
                }
            });
            await createNotification(userId, "Wallet Balance Updated", `Your wallet balance has been credited with ${userAmount}`, "SUCCESS");
            return true;
        }

        // Use the active subscription's fee percentage
        const feePercentage = userSubscription.customFeePercentage || 
                             userSubscription.platformPlan.transactionFeePercentage;
                             
        const platformFee = (amount * Number(feePercentage)) / 100;
        const userAmount = amount - platformFee;

        await prismaClient.wallet.update({
            where: {
                id: wallet.id
            },
            data: {
                totalBalance: {
                    increment: userAmount
                },
                withdrawableBalance: {
                    increment: userAmount
                },
                totalEarnings: {
                    increment: userAmount
                },
                totalCharges: {
                    increment: platformFee
                },
                lastUpdated: new Date()
            }
        });
        await createNotification(userId, "Wallet Balance Updated", `Your wallet balance has been credited with ${userAmount}`, "SUCCESS");
        return true;
    } catch (error) {
        console.log("Error updating wallet balance", error);
        return false;
    }
}
