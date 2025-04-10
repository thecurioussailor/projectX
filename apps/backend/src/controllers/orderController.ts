import { prismaClient } from "@repo/db";
import { Cashfree } from "cashfree-pg";
import { CFEnvironment } from "cashfree-pg";
import { Request, Response } from "express";

export const initiatePayment = async (req: Request, res: Response) => {
    try {
        const { productType, productId, amount } = req.body;
        const userId = req.user?.id;
        
        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });
        
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found"
            });
            return;
        }
        
        // Create order with dynamic product reference
        const orderData: any = {
            userId,
            method: 'Cashfree',
            amount,
            status: 'PENDING'
        };
        
        // Add the correct product relation based on productType
        if (productType === 'TELEGRAM_PLAN') {
            orderData.telegramPlanId = productId;
            orderData.productType = "TELEGRAM_PLAN";
        } else if (productType === 'DIGITAL_PRODUCT') {
            orderData.digitalProductId = productId;
            orderData.productType = "DIGITAL_PRODUCT";
        } else {
            res.status(400).json({
                status: "error",
                message: "Invalid product type"
            });
            return;
        }
        
        const order = await prismaClient.order.create({
            data: orderData
        });
        
        // Create payment session with Cashfree
        const cashfree = new Cashfree(
            process.env.CASHFREE_ENV === 'PRODUCTION'
              ? CFEnvironment.PRODUCTION
              : CFEnvironment.SANDBOX,
            process.env.CASHFREE_APP_ID!,
            process.env.CASHFREE_SECRET_KEY!
        );
        
        const cfRes = await cashfree.PGCreateOrder({
            order_id: order.id,
            order_amount: Number(amount.toString()),
            order_currency: 'INR',
            customer_details: {
                customer_id: `user_${userId}`,
                customer_email: user.email! || "test@example.com",
                customer_phone: user.phone! || "9999999999",
                customer_name: user.name! || "Test User",
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL}/payment-callback?orderId=${order.id}&productType=${productType}`,
            },
            order_note: `Payment for ${productType} #${productId}`,
        });
          
        res.status(201).json({
            status: 'success',
            data: {
                orderId: order.id,
                paymentSessionId: cfRes.data.payment_session_id
            }
        });
    } catch (error) {
        console.error("Initiate payment error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to initiate payment"
        });
    }
};

export const handlePaymentCallback = async (req: Request, res: Response) => {
    try {  
        const { orderId, productType } = req.query;

        if (!orderId) {
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=missing-order-id`);
            return;
        }
        // Verify payment status with Cashfree
        const order = await prismaClient.order.findUnique({
            where: { id: orderId as string },
            include: {
                user: true,
                telegramPlan: {
                    include: {
                        channel: true
                    }
                },
                digitalProduct: true
            }
        });
  
        if (!order) {
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=order-not-found`);
            return;
        }

        const cashfree = new Cashfree(
            process.env.CASHFREE_ENV === 'PRODUCTION'
            ? CFEnvironment.PRODUCTION
            : CFEnvironment.SANDBOX,
            process.env.CASHFREE_APP_ID!,
            process.env.CASHFREE_SECRET_KEY!
        );
  
        const paymentStatus = await cashfree.PGOrderFetchPayments(order.id);
        console.log(paymentStatus.data);
        if (!paymentStatus.data || !paymentStatus.data[0]) {
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=payment-verification-failed`);
            return; 
        }
        const isSuccess = paymentStatus.data[0]?.payment_status === "SUCCESS";

        // Update order status
        await prismaClient.order.update({
            where: { id: order.id },
            data: { status: isSuccess ? "SUCCESS" : "FAILED" }
        });

        // Create a transaction record
        await prismaClient.transaction.create({
            data: {
                userId: order.userId,
                orderId: order.id,
                gateway: 'Cashfree',
                gatewayTxnId: paymentStatus.data[0]?.cf_payment_id || '',
                amount: order.amount,
                status: isSuccess ? 'SUCCESS' : 'FAILED',
                paymentMethod: paymentStatus.data[0]?.payment_method as string || '',
                paymentGroup: paymentStatus.data[0]?.payment_group || '',
                paymentMessage: paymentStatus.data[0]?.payment_message || '',
                paymentTime: paymentStatus.data[0]?.payment_time || '',
                paymentCompletionTime: paymentStatus.data[0]?.payment_completion_time || '',
                bankReference: paymentStatus.data[0]?.bank_reference || '',
                authId: paymentStatus.data[0]?.auth_id || '',
                paymentCurrency: paymentStatus.data[0]?.payment_currency || '',
            }
        });
        
        if (isSuccess) {
            // Process based on product type
            if (productType === 'TELEGRAM_PLAN' && order.telegramPlan) {
                // Create telegram subscription
                await createTelegramSubscription(order);
            } else if (productType === 'DIGITAL_PRODUCT' && order.digitalProduct) {
                // Process digital product purchase logic here
                await createDigitalProductPurchase(order);
                // (e.g., grant access, send download links, etc.)
                if (order.digitalProduct.isLimitedQuantityEnabled && order.digitalProduct.quantity !== null) {
                    await prismaClient.digitalProduct.update({
                        where: { id: order.digitalProduct.id },
                        data: {
                            quantity: {
                                decrement: 1
                            }
                        }
                    });
                }
            }
            console.log("Payment success ****************************************");
            res.status(200).json({
                status: "success",
                message: "Payment successful"
            });
        } else {
            console.log("Payment failed ****************************************");
            res.status(200).json({
                status: "error",
                message: "Payment failed"
            });
        }
    } catch (error) {
        console.error("Payment callback error:", error);
        res.status(500).json({
            status: "error",
            message: "Server error"
        });
    }
};

// Helper function to create telegram subscription
const createTelegramSubscription = async (order: any) => {
    const user = await prismaClient.user.findUnique({
        where: { id: order.userId }
    });
    
    if (!user || !order.telegramPlan) return;
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (order.telegramPlan.duration || 0));
    
    const existingSubscription = await prismaClient.telegramSubscription.findFirst({
        where: {
            userId: order.userId,
            planId: order.telegramPlan.id,
            status: "ACTIVE",
            expiryDate: {
                gt: new Date()
            }
        }
    });

    if (existingSubscription) {
        return prismaClient.telegramSubscription.update({
            where: { id: existingSubscription.id },
            data: {
                expiryDate
            }
        });
    }

    return prismaClient.telegramSubscription.create({
        data: {
            userId: order.userId,
            planId: order.telegramPlan.id,
            telegramUsername: user.username || "unknown",
            planName: order.telegramPlan.name,
            planPrice: order.amount,
            planDuration: order.telegramPlan.duration,
            status: "ACTIVE",
            expiryDate
        }
    });
};

const createDigitalProductPurchase = async (order: any) => {
    if (!order.userId || !order.digitalProductId) return;
    
    return prismaClient.digitalProductPurchase.create({
        data: {
            userId: order.userId,
            productId: order.digitalProductId,
            price: order.amount,
            status: "ACTIVE"
        }
    });
};


export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const userId = req.user?.id;
        
        const orderQuery = userId 
            ? { id: orderId, userId } 
            : { id: orderId };
            
        const order = await prismaClient.order.findUnique({
            where: orderQuery as any,
            include: {
                transaction: true,
                telegramPlan: {
                    select: {
                        name: true,
                        duration: true,
                        channel: {
                            select: {
                                channelName: true
                            }
                        }
                    }
                },
                digitalProduct: {
                    select: {
                        title: true,
                        description: true
                    }
                }
            }
        });

        if (!order) {
            res.status(404).json({
                status: "error",
                message: "Order not found"
            });
            return;
        }

        res.status(200).json({
            status: "success",
            data: order
        });
    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to get order details"
        });
    }
};

export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        const orders = await prismaClient.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                transaction: true,
                telegramPlan: {
                    select: {
                        name: true,
                        channel: {
                            select: {
                                channelName: true
                            }
                        }
                    }
                },
                digitalProduct: {
                    select: {
                        title: true
                    }
                }
            }
        });

        res.status(200).json({
            status: "success",
            data: orders
        });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to get user orders"
        });
    }
};