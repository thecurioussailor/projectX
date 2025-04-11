import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
              success: false,
              message: 'Unauthorized access'
            });
            return;
        }

        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(404).json({
                success: false,
                message: 'User not found'
              });
            return;
        }

          const digitalProductStats = await prismaClient.order.aggregate({
            where: {
              status: 'SUCCESS',
              productType: 'DIGITAL_PRODUCT',
              digitalProduct: {
                creatorId: userId
              }
            },
            _sum: {
                amount: true
            },
            _count: true
          });

          const telegramStats = await prismaClient.order.aggregate({
            where: {
              status: 'SUCCESS',
              productType: 'TELEGRAM_PLAN',
              telegramPlan: {
                channel: {
                    telegramAccount: {
                        userId: userId
                    }
                }
              }
            },
            _sum: {
              amount: true
            },
            _count: true
          });


          const totalProductsCreated = await prismaClient.digitalProduct.count({
            where: {
              creatorId: userId
            }
          });

          const totalChannelsCreated = await prismaClient.telegramChannel.count({
            where: {
              telegramAccount: {
                userId: userId
              }
            }
          });

          const totalShortLinksCreated = await prismaClient.link.count({
            where: {
              userId: userId,
              deletedAt: null
            }
          });

          const totalClickCount = await prismaClient.link.aggregate({
            where: {
              userId: userId,
              deletedAt: null
            },
            _sum: {
              clicks: true
            }
          });

          const recentSales = await prismaClient.order.findMany({
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
                      username: true,
                      profileImage: true
                    }
                },
                digitalProduct: {
                    select: {
                      title: true,
                      coverImage: true
                    }
                },
                telegramPlan: {
                    select: {
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
            },
            take: 4
          })

        res.status(200).json({
          success: true,
          data: {
            digitalProductStats,
            telegramStats,
            totalProductsCreated,
            totalChannelsCreated,
            totalShortLinksCreated,
            totalClickCount,
            recentSales
          }
        });
      } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Internal server error' 
        });
      }
}

export const getDailySalesStats = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized access'
        });
        return;
      }
  
      // Calculate date range (last 30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      // Get all successful orders in the last 30 days where the user is the seller
      const orders = await prismaClient.order.findMany({
        where: {
          status: 'SUCCESS',
          createdAt: {
            gte: startDate,
            lte: endDate
          },
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
          amount: true,
          productType: true,
          createdAt: true
        }
      });
  
      // Initialize the result object with dates for the last 30 days
      const dailyData: Record<string, any> = {};
      
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        dailyData[dateStr] = {
          date: dateStr,
          digitalSales: 0,
          digitalRevenue: 0,
          telegramSales: 0,
          telegramRevenue: 0,
          totalSales: 0,
          totalRevenue: 0
        };
      }
  
      // Populate the dailyData object with actual sales data
      orders.forEach(order => {
        const dateStr = order.createdAt.toISOString().split('T')[0];
        
        if (dailyData[dateStr]) {
          const amount = parseFloat(order.amount.toString());
          
          if (order.productType === 'DIGITAL_PRODUCT') {
            dailyData[dateStr].digitalSales += 1;
            dailyData[dateStr].digitalRevenue += amount;
          } else if (order.productType === 'TELEGRAM_PLAN') {
            dailyData[dateStr].telegramSales += 1;
            dailyData[dateStr].telegramRevenue += amount;
          }
          
          dailyData[dateStr].totalSales += 1;
          dailyData[dateStr].totalRevenue += amount;
        }
      });
  
      // Convert the dailyData object to an array and sort by date
      const chartData = Object.values(dailyData).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  
      res.status(200).json({
        success: true,
        data: chartData
      });
    } catch (error) {
      console.error('Daily sales stats error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  };