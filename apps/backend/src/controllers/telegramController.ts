import { Request, Response } from "express";
import { StringSession } from "telegram/sessions/index.js";
import { TelegramClient, Api } from "telegram";
import { prismaClient } from "@repo/db";
import dotenv from "dotenv";
import { addBotToChannel, addUserToChannel } from "../utils/helper.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { initiatePayment } from "./orderController.js";
// import { v4 as uuidv4 } from "uuid";
dotenv.config();
const apiId: number = Number(process.env.TELEGRAM_API_ID);
const apiHash: string = process.env.TELEGRAM_API_HASH || '';

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.body;
        const userId = req.user?.id;
        
        if(!phoneNumber){
            res.status(400).json({
                status: "error",
                message: "Phone number required"
            });
            return;
        }

        if(!userId){
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }

        const stringSession = new StringSession('');
        const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5});
        await client.connect();

        const result = await client.invoke(
            new Api.auth.SendCode({
              phoneNumber: phoneNumber,
              apiId: apiId,
              apiHash: apiHash,
              settings: new Api.CodeSettings({}),
            })
          );
        
        if(!result){
            res.status(400).json({
                status: "error",
                message: "Error trying to send code, please try again later"
            });
            return;
        }
        
        const phoneCodeHash = (result as any).phoneCodeHash || (result as any).phone_code_hash;
        
        // Check if user has a telegram account already
        const userWithTelegramAccounts = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            include: {
                telegramAccounts: true
            }
        });
        
        if(!userWithTelegramAccounts){
            res.status(404).json({
                status: "error",
                message: "User not found"
            });
            return;
        }
        
        // Create or update telegram account
        if(!userWithTelegramAccounts.telegramAccounts){  
            await prismaClient.telegramAccount.create({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    telegramNumber: phoneNumber,
                    phoneCodeHash: phoneCodeHash,
                    session: stringSession.save()
                }
            });
        } else {
            const telegramAccount = userWithTelegramAccounts.telegramAccounts.find(account => account.telegramNumber === phoneNumber);
            if(!telegramAccount){
                await prismaClient.telegramAccount.create({
                    data: {
                        user: {
                            connect: { id: userId }
                        },
                        telegramNumber: phoneNumber,
                        phoneCodeHash: phoneCodeHash,
                        session: stringSession.save()
                    }
                });
            } else {
            await prismaClient.telegramAccount.update({
                where: {
                    id: telegramAccount.id
                },
                data: {
                    phoneCodeHash: phoneCodeHash,
                    session: stringSession.save()
                }
                });
            }
        }

        res.status(200).json({
            status: "success",
            message: "OTP sent successfully",
            data: {
                userId: userId
            }
        });
    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to send OTP"
        });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { code, phoneNumber } = req.body;
        const userId = req.user?.id;
    
        if(!code || !phoneNumber) {
            res.status(400).json({
                status: "error",
                message: "Verification code and phone number are required"
            });
            return;
        }
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        // Get user data with telegram account
        const userWithTelegramAccounts = await prismaClient.user.findUnique({
            where: {
                id: userId
                },
                include: {
                    telegramAccounts: true
                }
        });
        
        if(!userWithTelegramAccounts || !userWithTelegramAccounts.telegramAccounts) {
            res.status(400).json({
                status: "error",
                message: "Please request OTP first"
            });
            return;
        }
        
        const telegramAccount = userWithTelegramAccounts.telegramAccounts.find(account => account.telegramNumber === phoneNumber);
        
    if(!telegramAccount?.session || !telegramAccount?.phoneCodeHash || !telegramAccount.telegramNumber) {
        res.status(400).json({
                status: "error",
                message: "Please request a new OTP"
        });
        return;
    }
    // Create client with saved session
    const stringSession = new StringSession(telegramAccount.session);
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
    await client.connect();
    
    // Sign in with the code
    try {
            await client.invoke(
            new Api.auth.SignIn({
                    phoneNumber: telegramAccount.telegramNumber,
                    phoneCodeHash: telegramAccount.phoneCodeHash,
                phoneCode: code
            })
        );
        
        // Save the updated session
            await prismaClient.telegramAccount.update({
            where: {
                    id: telegramAccount.id
            },
            data: {
                session: stringSession.save(),
                authenticated: true
            }
        });
        
        res.status(200).json({
                status: "success",
            message: "Verification successful",
                data: {
                    userId: userId,
                authenticated: true
            }
        });
    } catch (signInError: any) {
            console.error("Sign in error:", signInError);
        
        // Handle specific Telegram API errors
        if (signInError.message && signInError.message.includes("SESSION_PASSWORD_NEEDED")) {
                res.status(400).json({
                    status: "error",
                    message: "Two-factor authentication is enabled. Please use another method."
                });
            }
            
            res.status(400).json({
                status: "error",
                message: "Invalid verification code"
            });
        }
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to verify OTP"
        });
    }
};

export const getAccount = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
        }

        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            include: { telegramAccounts: true }
        });

        if(!user || !user.telegramAccounts) {
            res.status(404).json({
                status: "error",
                message: "Telegram account not found"
            });
            return;
        }
        
        const telegramAccounts = user.telegramAccounts.map(account => ({
            id: account.id,
            telegramNumber: account.telegramNumber,
            authenticated: account.authenticated,
            verified: account.verified,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        }));
        
        res.status(200).json({
            status: "success",
            data: telegramAccounts
        });
    } catch (error) {
        console.error("Get account error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch account"
        });
    }
}

export const createChannel = async (req: Request, res: Response) => {
    const { channelName, channelDescription, telegramNumber } = req.body;
    const userId = req.user?.id;
    
    try {
        if(!channelName || !channelDescription) {
            res.status(400).json({
                status: "error",
                message: "Channel name and description are required"
            });
            return;
        }
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        // Get user with telegram account
        const userWithTelegramAccounts = await prismaClient.user.findUnique({
            where: { id: userId },
            include: { telegramAccounts: true }
        });

        if(!userWithTelegramAccounts || !userWithTelegramAccounts.telegramAccounts) {
            res.status(400).json({
                status: "error",
                message: "Telegram account not found. Please connect your Telegram account first."
            });
            return;
        }

        const telegramAccount = userWithTelegramAccounts.telegramAccounts.find(account => account.authenticated && account.telegramNumber === telegramNumber);
        if(!telegramAccount) {
            res.status(400).json({
                status: "error",
                message: "Telegram account not authenticated. Please verify your account first."
            });
            return;
        }

        if (!telegramAccount.session) {
            res.status(401).json({
                status: "error",
                message: "Session not found. Please re-authenticate your Telegram account."
            });
            return;
        }

        // Create client with saved session
        const stringSession = new StringSession(telegramAccount.session);
        const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
        
        try {
            await client.connect();
            
            if(!await client.isUserAuthorized()) {
                res.status(401).json({
                    status: "error",
                    message: "Session expired. Please re-authenticate your Telegram account."
                });
                return;
            }

            const result = await client.invoke(
                new Api.channels.CreateChannel({
                    title: channelName,
                    about: channelDescription || "",
                    broadcast: true,
                    megagroup: false
                })
            );
            console.log("channel created", result);
            const channelData = (result as any).chats?.[0];
            console.log("channel data", channelData);
            if (!channelData || !channelData.id) {
                res.status(400).json({
                    status: "error",
                    message: "Failed to retrieve channel information"
                });
                return;
            }
            
            // Create new channel
            console.log("creating new channel");
            const newChannel = await prismaClient.telegramChannel.create({
                data: {
                    telegramChannelId: channelData.id,
                    channelName,
                    channelDescription,
                    telegramAccount: {
                        connect: {
                            id: telegramAccount.id
                        }
                    }
                }
            });
            console.log("channel created", newChannel);
            console.log("adding bot to channel");
            const { success, message, channel } = await addBotToChannel(channelData.id.toString(), "@NetlySuperBot", client);
            console.log("bot added to channel", success, message, channel);
            if(!success) {
                res.status(400).json({
                    status: "error",
                    message: message
                });
            } else {
                await prismaClient.telegramChannel.update({
                    where: { id: newChannel.id },
                    data: { botAdded: true, telegramChannelId: channel.id }
                });
            }

            res.status(201).json({
                status: "success",
                message: "Channel created successfully",
                data: newChannel
            });
        } finally {
            await client.disconnect();
        }
    } catch (error) {
        console.error("Create channel error:", error);

        if (error instanceof Error && error.message.includes("AUTH_KEY_DUPLICATED")) {
            // Clear the session and ask user to re-authenticate
            const userWithAccounts = await prismaClient.user.findUnique({
                where: { id: userId },
                include: { telegramAccounts: true }
            });

            if (userWithAccounts?.telegramAccounts) {
                const account = userWithAccounts.telegramAccounts.find(acc => acc.telegramNumber === telegramNumber);
                if (account) {
                    await prismaClient.telegramAccount.update({
                        where: { id: account.id },
                        data: { 
                            session: null,
                            authenticated: false
                        }
                    });
                }
            }

            res.status(401).json({ 
                status: "error", 
                message: "Session conflict detected. Please re-authenticate your Telegram account." 
            });
        } else {
            res.status(500).json({ status: "error", message: "Failed to create channel" });
        }
    }
};

export const getChannels = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        // Get user with telegram account
        const userWithTelegramAccounts = await prismaClient.user.findUnique({
            where: { id: userId },
            include: { 
                telegramAccounts: {
                    include: {
                        channels: {
                            include: {
                                telegramPlans: {
                                    include: {
                                        subscriptions: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        if(!userWithTelegramAccounts || !userWithTelegramAccounts.telegramAccounts) {
            res.status(400).json({
                status: "error",
                message: "Telegram account not found"
            });
            return;
        }
        
        const channels = userWithTelegramAccounts.telegramAccounts.flatMap(account => account.channels);
        
        res.status(200).json({
            status: "success",
            data: channels
        });
    } catch (error) {
        console.error("Get channels error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch channels"
        });
    }
};

export const getChannelById = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        // Get channel with telegram account
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: {
                telegramAccount: true,
                telegramPlans: true
            }
        });
        
        if(!channel) {
            res.status(404).json({
                status: "error",
                message: "Channel not found"
            });
            return;
        }
        
        // Check if user owns this channel
        if(channel.telegramAccount.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to access this channel"
            });
            return;
        }
        
        res.status(200).json({
            status: "success",
            data: channel
        });
    } catch (error) {
        console.error("Get channel by ID error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch channel"
        });
    }
};

export const updateChannel = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const { botAdded } = req.body;
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        // Get channel with telegram account
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: { telegramAccount: true }
        });
        
        if(!channel) {
            res.status(404).json({
                status: "error",
                message: "Channel not found"
            });
            return;
        }
        
        // Check if user owns this channel
        if(channel.telegramAccount.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to update this channel"
            });
            return;
        }
        
        // Update channel
        const updatedChannel = await prismaClient.telegramChannel.update({
            where: { id: channelId },
            data: { botAdded }
        });
        
        res.status(200).json({
            status: "success",
            message: "Channel updated successfully",
            data: updatedChannel
        });
    } catch (error) {
        console.error("Update channel error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to update channel"
        });
    }
};

export const publishChannel = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }

        // Get channel with telegram account
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: { telegramAccount: true }
        });
        
        if(!channel) {
            res.status(404).json({
                status: "error",
                message: "Channel not found"
            });
            return;
        }

        // Check if user owns this channel
        if(channel.telegramAccount.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to publish this channel"
            });
            return;
        }

        // Publish channel
        const publishedChannel = await prismaClient.telegramChannel.update({
            where: { id: channelId },
            data: { status: "ACTIVE" }
        });
        
        res.status(200).json({
            status: "success",
            message: "Channel published successfully",
            data: publishedChannel
        });
        
        
    } catch (error) {
        console.error("Publish channel error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to publish channel"
        });
    }
}

export const unpublishChannel = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }

        // Get channel with telegram account
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: { telegramAccount: true }
        });
        
        if(!channel) {
            res.status(404).json({
                status: "error",
                message: "Channel not found"
            });
            return;
        }

        // Check if user owns this channel
        if(channel.telegramAccount.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to unpublish this channel"
            });
            return;
        }

        // Publish channel
        const unPublishedChannel = await prismaClient.telegramChannel.update({
            where: { id: channelId },
            data: { status: "INACTIVE" }
        });
        
        res.status(200).json({
            status: "success",
            message: "Channel unpublished successfully",
            data: unPublishedChannel
        });
        
        
    } catch (error) {
        console.error("Unpublish channel error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to unpublish channel"
        });
    }
}

export const deleteChannel = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        // Get channel with telegram account
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: { telegramAccount: true }
        });
        
        if(!channel) {
            res.status(404).json({
                status: "error",
                message: "Channel not found"
            });
            return;
        }
        
        // Check if user owns this channel
        if(channel.telegramAccount.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to delete this channel"
            });
            return;
        }
        
        // Delete channel
        await prismaClient.$transaction(async (tx) => {
            await tx.telegramPlan.updateMany({
                where: {
                    channelId: channelId
                },
                data: {
                    deletedAt: new Date()
                }
            });
            await tx.telegramChannel.update({
                where: { id: channelId },
                data: {
                    deletedAt: new Date()
                }
            });
        }); 
        
        res.status(200).json({
            status: "success",
            message: "Channel deleted successfully"
        });
    } catch (error) {
        console.error("Delete channel error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to delete channel"
        });
    }
};

export const createPlan = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const { name, price, duration } = req.body;
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        if(!name || !price || !duration) {
            res.status(400).json({
                status: "error",
                message: "Name, price, and duration are required"
            });
            return;
        }
        
        // Get channel with telegram account
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: { telegramAccount: true }
        });
        
        if(!channel) {
            res.status(404).json({
                status: "error",
                message: "Channel not found"
            });
            return;
        }
        
        // Check if user owns this channel
        if(channel.telegramAccount.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to create plans for this channel"
            });
            return;
        }
        
        // Create plan
        const newPlan = await prismaClient.telegramPlan.create({
            data: {
                name,
                price: typeof price === 'string' ? parseFloat(price) : price,
                duration: Number(duration),
                channel: {
                    connect: { id: channelId }
                }
            }
        });
        
        res.status(201).json({
            status: "success",
            message: "Plan created successfully",
            data: newPlan
        });
    } catch (error) {
        console.error("Create plan error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to create plan"
        });
    }
};

export const getPlans = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        // Get channel with telegram account
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: { 
                telegramAccount: true,
                telegramPlans: {
                    where: {
                        status: 'ACTIVE'
                    }
                }
            }
        });
        
        if(!channel) {
            res.status(404).json({
                status: "error",
                message: "Channel not found"
            });
            return;
        }
        
        // Check if user owns this channel
        if(channel.telegramAccount.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to view plans for this channel"
            });
            return;
        }
        
        res.status(200).json({
            status: "success",
            data: channel.telegramPlans
        });
    } catch (error) {
        console.error("Get plans error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch plans"
        });
    }
};

export const getPlanById = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        // Get plan with channel and telegram account
        const plan = await prismaClient.telegramPlan.findUnique({
            where: { id: planId },
            include: {
                channel: {
                    include: {
                        telegramAccount: true
                    }
                }
            }
        });
        
        if(!plan) {
            res.status(404).json({
                status: "error",
                message: "Plan not found"
            });
            return;
        }
        
        // Check if user owns this plan's channel
        if(plan.channel.telegramAccount.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to view this plan"
            });
            return;
        }
        
        res.status(200).json({
            status: "success",
            data: plan
        });
    } catch (error) {
        console.error("Get plan by ID error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch plan"
        });
    }
};

export const updatePlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;
        const { name, price, duration, status } = req.body;
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        // Get plan with channel and telegram account
        const plan = await prismaClient.telegramPlan.findUnique({
            where: { id: planId },
            include: {
                channel: {
                    include: {
                        telegramAccount: true
                    }
                }
            }
        });
        
        if(!plan) {
            res.status(404).json({
                status: "error",
                message: "Plan not found"
            });
            return;
        }
        
        // Check if user owns this plan's channel
        if(plan.channel.telegramAccount.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to update this plan"
            });
            return;
        }
        
        // Update plan
        const updatedPlan = await prismaClient.telegramPlan.update({
            where: { id: planId },
            data: {
                name,
                price: price !== undefined ? (typeof price === 'string' ? parseFloat(price) : price) : undefined,
                duration: duration !== undefined ? Number(duration) : undefined,
                status: status
            }
        });
        
        res.status(200).json({
            status: "success",
            message: "Plan updated successfully",
            data: updatedPlan
        });
    } catch (error) {
        console.error("Update plan error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to update plan"
        });
    }
};

export const deletePlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;
        const userId = req.user?.id;
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }
        
        // Get plan with channel and telegram account
        const plan = await prismaClient.telegramPlan.findUnique({
            where: { id: planId },
            include: {
                channel: {
                    include: {
                        telegramAccount: true
                    }
                }
            }
        });
        
        if(!plan) {
            res.status(404).json({
                status: "error",
                message: "Plan not found"
            });
            return;
        }
        
        // Check if user owns this plan's channel
        if(plan.channel.telegramAccount.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to delete this plan"
            });
            return;
        }
        
        // Soft delete by updating status instead of actual deletion
        const deletedPlan = await prismaClient.telegramPlan.update({
            where: { id: planId },
            data: {
                status: 'INACTIVE',
                deletedAt: new Date()
            }
        });
        
        res.status(200).json({
            status: "success",
            message: "Plan deleted successfully",
            data: deletedPlan
        });
    } catch (error) {
        console.error("Delete plan error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to delete plan"
        });
    }
};

export const getPublicChannelBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        
        // Get channel with plans
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: slug, status: "ACTIVE" }, // Only return published/active channels
            include: {
                telegramPlans: {
                    where: { status: "ACTIVE" }, // Only return active plans
                }
            }
        });
        
        if(!channel) {
            res.status(404).json({
                status: "error",
                message: "Channel not found or not published"
            });
            return;
        }
        
        // Remove sensitive information
        const publicChannel = {
            id: channel.id,
            channelName: channel.channelName,
            channelDescription: channel.channelDescription,
            createdAt: channel.createdAt,
            plans: channel.telegramPlans.map(plan => ({
                id: plan.id,
                name: plan.name,
                price: plan.price,
                duration: plan.duration
            }))
        };
        
        res.status(200).json({
            status: "success",
            data: publicChannel
        });
    } catch (error) {
        console.error("Get public channel error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch channel"
        });
    }
};

export const subscribeToPlan = async (req: Request, res: Response) => {
    try {
        const { channelId, planId } = req.params;
        const userId = req.user?.id;    
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }   

        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });     

        if(!user) {
            res.status(400).json({
                status: "error",
                message: "User not found"
            });
            return;
        }

        // Get channel and plan details
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: { 
                telegramPlans: {
                    where: { status: "ACTIVE" }
                }
            }
        });
        
        if(!channel) {
            res.status(404).json({
                status: "error",
                message: "Channel not found"
            });
            return;
        }

        const plan = channel.telegramPlans.find(plan => plan.id === planId);
        
        if(!plan) {
            res.status(404).json({
                status: "error",
                message: "Plan not found"
            });
            return;
        }

        // Check for existing active subscription
        const existingSubscription = await prismaClient.telegramSubscription.findFirst({
            where: {
                userId,
                plan: {
                    channelId
                },
                status: "ACTIVE",
                expiryDate: {
                    gt: new Date()
                }
            }
        });

        if (existingSubscription) {
            // If user has an active subscription, check if new plan has higher price
            if (plan.price <= existingSubscription.planPrice) {
                res.status(400).json({
                    status: "error",
                    message: "You can only upgrade to a higher-priced plan while you have an active subscription"
                });
                return;
            }

            // Create new subscription that starts after current one expires
            const newSubscription = await prismaClient.telegramSubscription.create({
                data: {
                    userId,
                    planId,
                    telegramUsername: user.username || "unknown",
                    planName: plan.name,
                    planPrice: plan.price,
                    planDuration: plan.duration,
                    expiryDate: new Date(existingSubscription.expiryDate.getTime() + (plan.duration * 24 * 60 * 60 * 1000)),
                    status: "EXPIRED" // Will be activated when current subscription expires
                }
            });

            res.status(201).json({
                status: "success",
                message: "Subscription scheduled to start after your current subscription expires",
                data: newSubscription
            });
            return;
        }

        // If no active subscription, create new one starting immediately
        const newSubscription = await prismaClient.telegramSubscription.create({
            data: {
                userId,
                planId,
                telegramUsername: user.username || "unknown",
                planName: plan.name,
                planPrice: plan.price,
                planDuration: plan.duration,
                expiryDate: new Date(Date.now() + (plan.duration * 24 * 60 * 60 * 1000)),
                status: "ACTIVE"
            }
        });

        res.status(201).json({
            status: "success",
            message: "Subscription created successfully",
            data: newSubscription
        });

    } catch (error) {
        console.error("Subscribe to plan error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to create subscription"
        });
    }
};

export const initiateTelegramSubscription = async (req: Request, res: Response) => {
    try {
        const { channelId, planId } = req.params;
        const userId = req.user?.id;    
        
        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }

        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });

        if(!user) {
            res.status(400).json({
                status: "error",
                message: "User not found"
            });
            return;
        }

        const channel = await prismaClient.telegramChannel.findUnique({ 
            where: { id: channelId }
        });

        if(!channel) {
            res.status(404).json({
                status: "error",
                message: "Channel not found"
            });
            return;
        }

        const plan = await prismaClient.telegramPlan.findUnique({
            where: { id: planId }
        });

        if(!plan) { 
            res.status(404).json({
                status: "error",
                message: "Plan not found"
            });
            return;
        }       

         // Check for existing active subscription
         const existingSubscription = await prismaClient.telegramSubscription.findFirst({
            where: {
                userId,
                plan: {
                    channelId
                },
                status: "ACTIVE",
                expiryDate: {
                    gt: new Date()
                }
            }
        });

        if (existingSubscription && existingSubscription.status === "ACTIVE" && existingSubscription.expiryDate > new Date() && plan.price <= existingSubscription.planPrice) {
            res.status(400).json({
                status: "error",
                message: "You can only upgrade to a higher-priced plan while you have an active subscription"
            });
            return;
        }

        const orderPayload = {
            productType: 'TELEGRAM_PLAN',
            productId: plan.id,
            amount: plan.price
        };
        
        req.body = orderPayload; // Set the request body for the orderController
        initiatePayment(req, res);

    } catch (error) {
        console.error("Initiate telegram subscription error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to initiate subscription"
        });
    }
};

export const getAllUserSubscribers = async (req: Request, res: Response) => {
    
    
    try {
      const userId = req.user?.id;
      const channelId = req.params.channelId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: {
          id: true
        }
      });

      if (!user) {
          res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      
      const subscribers = await prismaClient.telegramSubscription.findMany({
        where: {
          plan: {
            channel: {
              id: channelId
            } 
          }
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              email: true,
              phone: true
            }
          },
          plan: {
            include: {
              channel: {
                select: {
                  id: true,
                  channelName: true,
                  channelDescription: true,
                  telegramChannelId: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      res.status(200).json({
        success: true,
        data: subscribers
      });
    } catch (error) {
      console.error('Error fetching all user subscribers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subscribers',
        error: error as Error
      });
    }
  };
  
// export const handlePaymentCallback = async (req: Request, res: Response) => {
//     try {  

//             const { orderId } = req.query;

//          // Verify payment status with Cashfree
//             const order = await prismaClient.order.findUnique({
//                 where: { id: orderId as string },
//                 include: {
//                 user: true,
//                 telegramPlan: {
//                     include: {
//                     channel: true
//                     }
//                 }
//                 }
//             });
      
//             if (!order) {
//                 return res.status(404).json({
//                 status: "error",
//                 message: "Order not found"
//                 });
//             }

//             const cashfree = new Cashfree(
//                 process.env.CASHFREE_ENV === 'PRODUCTION'
//                 ? CFEnvironment.PRODUCTION
//                 : CFEnvironment.SANDBOX,
//                 process.env.CASHFREE_APP_ID!,
//                 process.env.CASHFREE_SECRET_KEY!
//             );
      
//             const paymentStatus = await cashfree.PGOrderFetchPayments(order.id);
      
//         if (paymentStatus.data[0]?.payment_status === "SUCCESS") {
//                 // Update order status
//                 await prismaClient.order.update({
//                 where: { id: order.id },
//                 data: { status: "SUCCESS" }
//                 });

//             res.status(200).json({
//                 status: "success",
//                 message: "Payment callback received"
//             });
//         } else {
//             res.status(200).json({
//                 status: "success",
//                 message: "Payment callback received"
//             });
//         }
//     } catch (error) {
//         console.error("Payment callback error:", error);
//         res.status(500).json({
//             status: "error",
//             message: "Failed to handle payment callback"
//         });
//     }
// }

//  export const createCashfreeOrder = async (req: Request, res: Response) => {
//     try {
//       const { channelId, planId, planName, amount } = req.body;
  
//       if (!channelId || !planId || !planName || !amount) {
//          res.status(400).json({ message: "Missing required fields." });
//          return;
//       }
  
//       const environment =
//         process.env.CASHFREE_ENV === "PRODUCTION"
//           ? CFEnvironment.PRODUCTION
//           : CFEnvironment.SANDBOX;
  
//       // ✅ Correct Cashfree instantiation
//       const cashfree = new Cashfree(
//         environment,
//         process.env.CASHFREE_APP_ID!,
//         process.env.CASHFREE_SECRET_KEY!
//       );
  
//       const orderId = order_${uuidv4()};
  
//       const payload = {
//         order_id: orderId,
//         order_amount: amount,
//         order_currency: "INR",
//         customer_details: {
//           customer_id: user_${uuidv4()},
//           customer_email: "test@example.com",
//           customer_phone: "9999999999",
//           customer_name: "Test User",
//         },
//         order_meta: {
//           return_url: https://px.ionfirm.com/payment-success?order_id=${orderId},
//         },
//         order_note: ${planName} Plan for Channel ID ${channelId},
//       };
  
//       const response = await cashfree.PGCreateOrder(payload);
  
//        res.status(200).json({
//         payment_session_id: response.data.payment_session_id,
//       });
//     } catch (error: any) {
//       console.error("Cashfree SDK Error:", error?.response?.data || error.message);
//        res.status(500).json({
//         message: "Cashfree order creation failed",
//         error: error?.response?.data || error.message,
//       });
//       return;
//     }
//   };