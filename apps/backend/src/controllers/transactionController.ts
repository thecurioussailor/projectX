import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
            return;
        }

        const transactions = await prismaClient.transaction.findMany({
            where: {
                OR: [
                    {
                        order: {
                          productType: 'DIGITAL_PRODUCT',
                          digitalProduct: {
                            creatorId: userId
                          }
                        }
                    },
                    {
                        order: {
                          productType: 'TELEGRAM_PLAN',
                          telegramPlan: {
                            channel: {
                              telegramAccount: {
                                userId: userId
                              }
                            }
                          }
                        }
                      }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                gateway: true,
                gatewayTxnId: true,
                amount: true,
                status: true,
                paymentGroup: true,
                paymentTime: true,
                createdAt: true,
                order: {
                    select: {
                        id: true,
                        productType: true,
                        digitalProduct: {
                            select: {
                                id: true,
                                title: true
                            }
                        },
                        telegramPlan: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        user: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        });
    }
}