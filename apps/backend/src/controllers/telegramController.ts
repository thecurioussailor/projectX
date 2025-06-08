import { Request, Response } from "express";
import { StringSession } from "telegram/sessions/index.js";
import { TelegramClient, Api } from "telegram";
import { prismaClient } from "@repo/db";
import dotenv from "dotenv";
import { addBotToChannel, addUserToChannel } from "../utils/helper.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { initiatePayment } from "./orderController.js";
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

// Add S3 configuration (if not already present)
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

// import { v4 as uuidv4 } from "uuid";
dotenv.config();
const apiId: number = Number(process.env.TELEGRAM_API_ID);
const apiHash: string = process.env.TELEGRAM_API_HASH || '';
const botUsername: string = process.env.TELEGRAM_BOT_USERNAME || '';
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
        console.log("userWithTelegramAccounts", userWithTelegramAccounts);
        if(!userWithTelegramAccounts){
            res.status(404).json({
                status: "error",
                message: "User not found"
            });
            return;
        }
        
        // Create or update telegram account
        if(!userWithTelegramAccounts.telegramAccounts){  
            console.log("creating new telegram account");
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
            console.log("telegramAccount", telegramAccount);
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
                    session: stringSession.save(),
                    deletedAt: null
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
                    telegramAccounts: {
                        where: {
                            deletedAt: null
                        }
                    }
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
        console.log("telegramAccount", telegramAccount);
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
            return;
        }

        // Option 1: Get accounts through user relation with filter
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            include: { 
                telegramAccounts: {
                    where: { deletedAt: null }
                }
            }
        });

        if(!user || !user.telegramAccounts.length) {
            res.status(404).json({
                status: "error",
                message: "Telegram account not found"
            });
            return;
        }
        
        const telegramAccounts = user.telegramAccounts.map(account => ({
            id: account.id,
            userId: account.userId,
            telegramNumber: account.telegramNumber,
            telegramUsername: account.telegramUsername,
            authenticated: account.authenticated,
            verified: account.verified,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
            deletedAt: account.deletedAt
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

export const deleteAccount = async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const userId = req.user?.id;

    try {
        if(!accountId) {
            res.status(400).json({
                status: "error",
                message: "Account ID is required"
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

        const account = await prismaClient.telegramAccount.findUnique({
            where: { id: accountId }
        });
        
        if(!account) {
            res.status(404).json({
                status: "error",
                message: "Telegram account not found"
            });
            return;
        }

        if(account.userId !== userId) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to delete this account"
            });
            return;
        }

        await prismaClient.telegramAccount.update({
            where: { id: accountId },
            data: {
                deletedAt: new Date()
            }
        });

        res.status(200).json({
            status: "success",
            message: "Telegram account deleted successfully"
        });
    } catch (error) {
        console.error("Delete account error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to delete account"
        });
    }
};

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
            if(!botUsername) {
                res.status(500).json({
                    status: "error",
                    message: "Bot username not found"
                });
                return;
            }
            const { success, message, channel } = await addBotToChannel(channelData.id.toString(), botUsername, client);
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
                                    where: { deletedAt: null },
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
        
        const channels = userWithTelegramAccounts.telegramAccounts.flatMap(account => account.channels.filter(channel => channel.deletedAt === null));
        
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

export const getTelegramChannels = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { telegramNumber } = req.body; // User provides the telegram number

        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }

        if(!telegramNumber) {
            res.status(400).json({
                status: "error",
                message: "Telegram number is required"
            });
            return;
        }

        // Get the specific telegram account for this user and phone number
        const telegramAccount = await prismaClient.telegramAccount.findFirst({
            where: { 
                userId: userId,
                telegramNumber: telegramNumber,
                deletedAt: null 
            }
        });

        console.log("telegramAccount", telegramAccount);

        if(!telegramAccount) {
            res.status(404).json({
                status: "error",
                message: "Telegram account not found or not authenticated. Please verify your Telegram account first."
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

        try {
            // Create client with saved session
            const stringSession = new StringSession(telegramAccount.session);
            const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 3 });
            
            await client.connect();
            
            if(!await client.isUserAuthorized()) {
                res.status(401).json({
                    status: "error",
                    message: "Session expired. Please re-authenticate your Telegram account."
                });
                return;
            }

            // Get all dialogs (chats) for this account
            const dialogs = await client.getDialogs({ limit: 100 });
            
            // Filter for channels and groups that the user can manage
            const channels = dialogs.filter((dialog: any) => {
                const entity = dialog.entity;
                // Check if it's a channel or supergroup and user has admin rights
                return (entity.className === 'Channel' || entity.className === 'Chat') && 
                       dialog.isChannel && 
                       (entity.adminRights || entity.creatorId === entity.id);
            });

            // Format channel data
            const formattedChannels = channels.map((dialog: any) => {
                const entity = dialog.entity as any;
                return {
                    telegramChannelId: entity.id.toString(),
                    channelName: entity.title || 'Unnamed Channel',
                    channelDescription: entity.about || '',
                    username: entity.username || null,
                    isCreator: entity.creator || false,
                    participantsCount: entity.participantsCount || 0,
                    telegramAccountId: telegramAccount.id,
                    telegramNumber: telegramAccount.telegramNumber,
                    canEdit: !!(entity.adminRights?.changeInfo || entity.creator),
                    canPostMessages: !!(entity.adminRights?.postMessages || entity.creator),
                    canAddUsers: !!(entity.adminRights?.inviteUsers || entity.creator),
                    channelType: entity.broadcast ? 'broadcast' : 'group',
                    isPublic: !!entity.username
                };
            });

            await client.disconnect();

            res.status(200).json({
                status: "success",
                message: "Telegram channels fetched successfully",
                data: {
                    telegramAccount: {
                        id: telegramAccount.id,
                        telegramNumber: telegramAccount.telegramNumber,
                        telegramUsername: telegramAccount.telegramUsername
                    },
                    channels: formattedChannels,
                    totalChannels: formattedChannels.length
                }
            });

        } catch (error) {
            console.error(`Error fetching channels for account ${telegramAccount.telegramNumber}:`, error);
            
            if (error instanceof Error && error.message.includes("AUTH_KEY_DUPLICATED")) {
                // Clear the session and ask user to re-authenticate
                await prismaClient.telegramAccount.update({
                    where: { id: telegramAccount.id },
                    data: { 
                        session: null,
                        authenticated: false
                    }
                });

                res.status(401).json({ 
                    status: "error", 
                    message: "Session conflict detected. Please re-authenticate your Telegram account." 
                });
            } else {
                res.status(500).json({
                    status: "error",
                    message: "Failed to fetch channels from Telegram"
                });
            }
        }

    } catch (error) {
        console.error("Get telegram channels error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch telegram channels"
        });
    }
}

export const createExistingTelegramChannel = async (req: Request, res: Response) => {
    try {
        const { telegramChannelId, telegramNumber, channelName, channelDescription } = req.body;
        const userId = req.user?.id;

        if(!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }

        if(!telegramChannelId || !telegramNumber) {
            res.status(400).json({
                status: "error",
                message: "Telegram channel ID and telegram number are required"
            });
            return;
        }

        // Check if user has the telegram account with that number
        const telegramAccount = await prismaClient.telegramAccount.findFirst({
            where: {
                userId: userId,
                telegramNumber: telegramNumber,
                deletedAt: null
            }
        });
        console.log("telegramAccount", telegramAccount);
        if(!telegramAccount) {
            res.status(404).json({
                status: "error",
                message: "Telegram account not found or not authenticated. Please verify your Telegram account first."
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

        // Check if channel with this telegramChannelId already exists for this user
        const existingChannel = await prismaClient.telegramChannel.findFirst({
            where: {
                telegramChannelId: telegramChannelId,
                telegramAccount: {
                    userId: userId
                },
                deletedAt: null
            },
            include: {
                telegramAccount: true
            }
        });

        if(existingChannel) {
            res.status(200).json({
                status: "success",
                message: "Channel already exists in your account",
                data: {
                    channel: existingChannel,
                    isExisting: true
                }
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

            // Create new channel record in database
            const newChannel = await prismaClient.telegramChannel.create({
                data: {
                    telegramChannelId: telegramChannelId,
                    channelName: channelName || 'Imported Channel',
                    channelDescription: channelDescription || '',
                    telegramAccountId: telegramAccount.id,
                    status: 'INACTIVE' // Default to inactive, user can publish later
                },
                include: {
                    telegramAccount: true
                }
            });

            console.log("Channel imported to database:", newChannel);
            console.log("Adding bot to imported channel");

            // Add bot to the existing Telegram channel
            if(!botUsername) {
                res.status(500).json({
                    status: "error",
                    message: "Bot username not found"
                });
                return;
            }

            const { success, message, channel } = await addBotToChannel(telegramChannelId, botUsername, client);
            console.log("Bot added to channel:", success, message, channel);

            if(!success) {
                // If bot addition fails, we still keep the channel record but mark botAdded as false
                console.warn(`Failed to add bot to imported channel: ${message}`);
                
                res.status(201).json({
                    status: "success",
                    message: "Channel imported successfully, but failed to add bot. You may need to add the bot manually.",
                    data: {
                        channel: newChannel,
                        isExisting: false,
                        botAddedSuccessfully: false,
                        botError: message
                    }
                });
            } else {
                // Update channel with bot added status and correct channel ID if returned
                const updatedChannel = await prismaClient.telegramChannel.update({
                    where: { id: newChannel.id },
                    data: { 
                        botAdded: true,
                        telegramChannelId: channel?.id || telegramChannelId
                    },
                    include: {
                        telegramAccount: true
                    }
                });

                res.status(201).json({
                    status: "success",
                    message: "Existing Telegram channel imported successfully and bot added",
                    data: {
                        channel: updatedChannel,
                        isExisting: false,
                        botAddedSuccessfully: true
                    }
                });
            }

        } finally {
            await client.disconnect();
        }

    } catch (error) {
        console.error("Create existing telegram channel error:", error);

        // Handle session conflicts similar to createChannel
        if (error instanceof Error && error.message.includes("AUTH_KEY_DUPLICATED")) {
            res.status(401).json({ 
                status: "error", 
                message: "Session conflict detected. Please re-authenticate your Telegram account." 
            });
        } else {
            res.status(500).json({
                status: "error",
                message: "Failed to import telegram channel"
            });
        }
    }
}

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

         // Generate presigned URL for banner if it exists
         let bannerUrl = null;
         if (channel.bannerImage) {
             try {
                 const command = new GetObjectCommand({
                     Bucket: BUCKET_NAME,
                     Key: channel.bannerImage
                 });
 
                 bannerUrl = await getSignedUrl(s3Client, command, {
                     expiresIn: 3600 // 1 hour
                 });
             } catch (error) {
                 console.error('Error generating banner presigned URL:', error);
                 // Continue without banner URL if there's an error
             }
         }

          // Return channel data with banner URL
        const channelWithBanner = {
            ...channel,
            bannerUrl: bannerUrl
        };
        
        res.status(200).json({
            status: "success",
            data: channelWithBanner
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
        const { richDescription } = req.body;
        console.log("richDescription", richDescription);
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
            data: { richDescription }
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

export const updateChannelContact = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const { contactEmail, contactPhone } = req.body;
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

        // Update channel contact
        const updatedChannel = await prismaClient.telegramChannel.update({
            where: { id: channelId },
            data: { contactEmail, contactPhone }
        });

        res.status(200).json({
            status: "success",
            message: "Channel contact updated successfully",
            data: updatedChannel
        });
    } catch (error) {
        console.error("Update channel contact error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to update channel contact"
        });
    }
}

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

//Channel Banner Manangement
export const getBannerUploadUrl = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const { fileName, fileType } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }

        // Verify channel ownership
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: { telegramAccount: true }
        });

        if (!channel || channel.telegramAccount.userId !== userId) {
            res.status(404).json({
                status: "error",
                message: "Channel not found or you don't have permission"
            });
            return;
        }

        // Generate a unique file key
        const fileExtension = fileName.split('.').pop();
        const timestamp = Date.now();
        const uniqueId = crypto.randomUUID();

        const s3Key = `${userId}/telegram/channels/${channelId}/banner/${timestamp}-${uniqueId}.${fileExtension}`;

        // Create the command to put the object
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            ContentType: fileType
        });

        // Generate the presigned URL
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        res.json({
            status: "success",
            data: {
                uploadUrl: presignedUrl,
                s3Key: s3Key
            }
        });
    } catch (error) {
        console.error('Error generating banner upload URL:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to generate upload URL"
        });
    }
}

export const uploadChannelBanner = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const { s3Key } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }

        // Verify channel ownership
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: { telegramAccount: true }
        });

        if (!channel || channel.telegramAccount.userId !== userId) {
            res.status(404).json({
                status: "error",
                message: "Channel not found or you don't have permission"
            });
            return;
        }

        // Verify the object exists in S3
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
        });

        await s3Client.send(command);

        // Delete old banner if exists
        if (channel.bannerImage) {
            try {
                const deleteCommand = new DeleteObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: channel.bannerImage
                });
                await s3Client.send(deleteCommand);
            } catch (deleteError) {
                console.error('Error deleting old banner:', deleteError);
            }
        }

        // Update channel with new banner
        const updatedChannel = await prismaClient.telegramChannel.update({
            where: { id: channelId },
            data: { bannerImage: s3Key }
        });

        res.json({
            status: "success",
            message: "Banner uploaded successfully",
            data: updatedChannel
        });
    } catch (error) {
        console.error('Error uploading banner:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to upload banner"
        });
    }
};

export const getChannelBanner = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;

        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            select: { bannerImage: true }
        });

        if (!channel || !channel.bannerImage) {
            res.status(404).json({
                status: "error",
                message: "Banner not found"
            });
            return;
        }

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: channel.bannerImage
        });

        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600 // 1 hour
        });

        res.status(200).json({
            status: "success",
            data: {
                url: signedUrl
            }
        });
    } catch (error) {
        console.error('Error getting banner:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to get banner"
        });
    }
};

export const deleteChannelBanner = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }

        // Verify channel ownership
        const channel = await prismaClient.telegramChannel.findUnique({
            where: { id: channelId },
            include: { telegramAccount: true }
        });

        if (!channel || channel.telegramAccount.userId !== userId) {
            res.status(404).json({
                status: "error",
                message: "Channel not found or you don't have permission"
            });
            return;
        }

        if (!channel.bannerImage) {
            res.status(404).json({
                status: "error",
                message: "No banner to delete"
            });
            return;
        }

        // Delete from S3
        const deleteCommand = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: channel.bannerImage
        });

        await s3Client.send(deleteCommand);

        // Update channel to remove banner reference
        const updatedChannel = await prismaClient.telegramChannel.update({
            where: { id: channelId },
            data: { bannerImage: null }
        });

        res.json({
            status: "success",
            message: "Banner deleted successfully",
            data: updatedChannel
        });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to delete banner"
        });
    }
};

//Plan Management
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
            data: channel.telegramPlans.filter(plan => plan.deletedAt === null)
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

        // Generate presigned URL for banner if it exists
        let bannerUrl = null;
        if (channel.bannerImage) {
            try {
                const command = new GetObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: channel.bannerImage
                });

                bannerUrl = await getSignedUrl(s3Client, command, {
                    expiresIn: 3600 // 1 hour
                });
            } catch (error) {
                console.error('Error generating banner presigned URL:', error);
                // Continue without banner URL if there's an error
            }
        }
        
        // Remove sensitive information
        const publicChannel = {
            id: channel.id,
            channelName: channel.channelName,
            channelDescription: channel.channelDescription,
            richDescription: channel.richDescription,
            bannerUrl: bannerUrl,
            contactEmail: channel.contactEmail,
            contactPhone: channel.contactPhone,
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