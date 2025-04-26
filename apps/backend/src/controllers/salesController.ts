import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export const getAllSales = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized access'
        });
        return;
      }
      
      const allSales = await prismaClient.order.findMany({
        where: {
            status: "SUCCESS",
            OR: [
                {
                    productType: 'DIGITAL_PRODUCT',
                    digitalProduct: {
                      creatorId: userId
                    }
                },
                {
                    productType: 'TELEGRAM_PLAN',
                    telegramPlan: {
                      channel: {
                        telegramAccount: {
                          userId: userId
                        }
                      }
                    }
                }
            ]
        },
        select: {
            id: true,
            amount: true,
            status: true,
            productType: true,
            createdAt: true,
            user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  email: true,
                  phone: true,
                }
            },
            digitalProduct: {
                select: {
                  id: true,
                  title: true,
                }
            },
            telegramPlan: {
                select: {
                    id: true,
                    name: true,
                    channel: {
                        select: {
                            channelName: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
      })
      
      res.status(200).json({
        success: true,
        data: allSales
      });
    } catch (error) {
      console.error('Get all sales error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  };