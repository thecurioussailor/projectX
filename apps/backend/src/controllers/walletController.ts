import { prismaClient } from "@repo/db";
import { Request, Response } from "express"

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

        const { amount } = req.body;    
        if(!amount) {
            res.status(400).json({
                message: "Amount is required",
                success: false
            });
        }
        
        const wallet = await prismaClient.wallet.findUnique({
            where: {
                userId: user.id
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

        const withdrawalRequest = await prismaClient.withdrawalRequest.create({
            data: {
                walletId: wallet.id,
                amount: amount
            }
        });

        res.status(200).json({
            success: true,
            message: "Withdrawal request created successfully",
            data: withdrawalRequest
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
                    pendingBalance: 0,
                    totalEarnings: 0,
                    totalWithdrawn: 0
                }
            });
        }

        const withdrawableAmount = amount * 0.8;
        const pendingAmount = amount * 0.2;

        await prismaClient.wallet.update({
            where: {
                id: wallet.id
            },
            data: {
                totalBalance: {
                    increment: amount
                },
                withdrawableBalance: {
                    increment: withdrawableAmount
                },
                pendingBalance: {
                    increment: pendingAmount
                },
                totalEarnings: {
                    increment: amount
                },
                lastUpdated: new Date()
            }
        });
        return true;
    } catch (error) {
        console.log("Error updating wallet balance", error);
        return false;
    }
}
