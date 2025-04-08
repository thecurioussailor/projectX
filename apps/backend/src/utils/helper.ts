import { prismaClient } from "@repo/db";
import { TelegramClient, Api } from "telegram";

interface AddBotToChannelResult {
    success: boolean;
    message: string;
    channel: any; // TODO: Export proper types from @repo/db
}

interface AddUserToChannelResult {
    success: boolean;
    message: string;
    user: any;
}

export const addBotToChannel = async (telegramChannelId: string, botUsername: string, client: TelegramClient): Promise<AddBotToChannelResult> => {
    
    if(!telegramChannelId || !botUsername) {
        throw new Error("Channel ID and bot username are required");
    }
    
    // Validate bot username format
    if(!botUsername.startsWith('@')) {
        throw new Error("Bot username must start with @");
    }
    
    try {
        console.log("Starting bot addition process...");
        
        // First resolve the bot username to get full entity info
        const resolveResult = await client.invoke(
            new Api.contacts.ResolveUsername({
                username: botUsername.replace('@', '')
            })
        );

        console.log("Bot resolution result:", JSON.stringify(resolveResult, null, 2));

        if (!resolveResult || !resolveResult.users || resolveResult.users.length === 0) {
            throw new Error("Bot not found. Please check the username.");
        }

        const botUser = resolveResult.users[0];
        console.log("Bot user details:", JSON.stringify(botUser, null, 2));
        
        // Create explicit InputUser for the bot
        const inputUser = new Api.InputUser({
            userId: botUser.id,
            accessHash: (botUser as any).accessHash
        });
        console.log("Created input user:", JSON.stringify(inputUser, null, 2));

        // Get the proper channel entity using channel username instead of telegramId
        // First, need to get the full dialogs list to find our channel
        console.log("Fetching dialogs to locate the channel...");
        const dialogs = await client.getDialogs({});
        console.log(`Found ${dialogs.length} dialogs`);
        
        // Find our channel by id in dialogs
        const targetChannelId = telegramChannelId;
        console.log("Looking for channel with ID:", targetChannelId);
        
        let targetChannel = null;
        for (const dialog of dialogs) {
            console.log("Dialog:", JSON.stringify({
                id: dialog.entity?.id,
                title: dialog.title,
                type: dialog.entity?.className
            }));
            
            if (dialog.entity && 
                (dialog.entity.id.toString() === targetChannelId || 
                 dialog.entity.id.toString() === `-100${targetChannelId}`)) {
                targetChannel = dialog.entity;
                break;
            }
        }
        
        if (!targetChannel) {
            throw new Error("Channel not found in your dialogs. Make sure you have created it and it's accessible.");
        }
        
        console.log("Found channel:", JSON.stringify(targetChannel, null, 2));
        
        // Add bot as admin to the channel using explicit input user
        console.log("Adding bot as admin with ID:", botUser.id);
        const addBotResult = await client.invoke(
            new Api.channels.EditAdmin({
                channel: targetChannel,
                userId: inputUser,  // Use explicit InputUser
                adminRights: new Api.ChatAdminRights({
                    changeInfo: true,
                    postMessages: true,
                    editMessages: true,
                    deleteMessages: true,
                    banUsers: true,
                    inviteUsers: true,
                    pinMessages: true,
                    addAdmins: false,
                    anonymous: false,
                    manageCall: true,
                    other: true
                }),
                rank: "Channel Bot"
            })
        );
        console.log("Add bot result:", JSON.stringify(addBotResult, null, 2));

        if (!addBotResult) {
            throw new Error("Failed to add bot as admin");
        }

        return {
            success: true,
            message: "Bot added as admin successfully",
            channel: targetChannel
        };
    } catch (error: any) {
        console.error("Error adding bot to channel:", error);
        throw new Error(`Failed to add bot to channel: ${error.message || "Unknown error"}`);
    }
}

export const addUserToChannel = async (telegramChannelId: string, username: string, client: TelegramClient): Promise<AddUserToChannelResult> => {
    if(!telegramChannelId || !username) {
        throw new Error("Channel ID and username are required");
    }
    
    try {
        console.log("Starting user addition process...");
        
        // First resolve the username to get user details
        console.log("Resolving username:", username);
        const resolveResult = await client.invoke(
            new Api.contacts.ResolveUsername({
                username: username.replace('@', '')
            })
        );
        
        console.log("User resolution result:", JSON.stringify(resolveResult, null, 2));

        if (!resolveResult || !resolveResult.users || resolveResult.users.length === 0) {
            throw new Error("User not found. Please check the username.");
        }

        const targetUser = resolveResult.users[0];
        console.log("Target user details:", JSON.stringify(targetUser, null, 2));
        
        // Create explicit InputUser for the user
        const inputUser = new Api.InputUser({
            userId: targetUser.id,
            accessHash: (targetUser as any).accessHash
        });
        console.log("Created input user:", JSON.stringify(inputUser, null, 2));
        
        // Get the proper channel entity using channel ID
        console.log("Fetching dialogs to locate the channel...");
        const dialogs = await client.getDialogs({});
        console.log(`Found ${dialogs.length} dialogs`);
        
        // Find our channel by id in dialogs
        const targetChannelId = telegramChannelId;
        console.log("Looking for channel with ID:", targetChannelId);   
        
        let targetChannel = null;
        for (const dialog of dialogs) {
            console.log("Dialog:", JSON.stringify({
                id: dialog.entity?.id,
                title: dialog.title,
                type: dialog.entity?.className
            }));

            if (dialog.entity && 
                (dialog.entity.id.toString() === targetChannelId || 
                 dialog.entity.id.toString() === `-100${targetChannelId}`)) {
                targetChannel = dialog.entity;
                break;
            }
        }

        if (!targetChannel) {
            throw new Error("Channel not found in your dialogs. Make sure you have created it and it's accessible.");
        }

        console.log("Found channel:", JSON.stringify(targetChannel, null, 2));

        // Add user to the channel
        console.log("Adding user to channel with ID:", targetUser.id);       
        const addResult = await client.invoke(
            new Api.channels.InviteToChannel({
                channel: targetChannel,
                users: [inputUser]
            })
        );
        
        console.log("Add user result:", JSON.stringify(addResult, null, 2));

        if (!addResult) {
            throw new Error("Failed to add user to channel");
        }

        return {
            success: true,
            message: "User added to channel successfully",
            user: targetUser
        };
    } catch (error: any) {
        console.error("Error adding user to channel:", error);
        throw new Error(`Failed to add user to channel: ${error.message || "Unknown error"}`);
    }
}
