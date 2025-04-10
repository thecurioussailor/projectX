import { prismaClient } from "@repo/db";
import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_API_ID = Number(process.env.TELEGRAM_API_ID);
const TELEGRAM_API_HASH = process.env.TELEGRAM_API_HASH || '';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || '@NetlySuperBot';

/**
 * Removes a user from a Telegram channel
 */
async function removeUserFromChannel(channelId: string, username: string, client: TelegramClient): Promise<boolean> {
  try {
    console.log(`Attempting to remove user ${username} from channel ${channelId}...`);
    
    // First resolve the username to get user details
    console.log("Resolving username:", username);
    const resolveResult = await client.invoke(
      new Api.contacts.ResolveUsername({
        username: username.replace('@', '')
      })
    );
    
    if (!resolveResult || !resolveResult.users || resolveResult.users.length === 0) {
      console.error(`User ${username} not found`);
      return false;
    }

    const targetUser = resolveResult.users[0];
    console.log("Target user details found");
    
    // Create explicit InputUser for the user
    const inputUser = new Api.InputUser({
      userId: targetUser.id,
      accessHash: (targetUser as any).accessHash
    });
    
    // Get the proper channel entity
    console.log("Fetching dialogs to locate the channel...");
    const dialogs = await client.getDialogs({});
    
    // Find our channel by id in dialogs
    let targetChannel = null;
    for (const dialog of dialogs) {
      if (dialog.entity && 
          (dialog.entity.id.toString() === channelId || 
           dialog.entity.id.toString() === `-100${channelId}`)) {
        targetChannel = dialog.entity;
        break;
      }
    }
    
    if (!targetChannel) {
      console.error(`Channel with ID ${channelId} not found`);
      return false;
    }
    
    console.log(`Found channel, removing user ${targetUser.id}...`);
    
    // Ban the user from the channel (effectively removing them)
    const kickResult = await client.invoke(
      new Api.channels.EditBanned({
        channel: targetChannel,
        participant: inputUser,
        bannedRights: new Api.ChatBannedRights({
          untilDate: 0,  // permanent
          viewMessages: true,
          sendMessages: true,
          sendMedia: true,
          sendStickers: true,
          sendGifs: true,
          sendGames: true,
          sendInline: true,
          embedLinks: true
        })
      })
    );

    if (!kickResult) {
      console.error(`Failed to remove user ${username} from channel`);
      return false;
    }

    console.log(`Successfully removed user ${username} from channel ${channelId}`);
    return true;
  } catch (error) {
    console.error(`Error removing user ${username} from channel ${channelId}:`, error);
    return false;
  }
}

/**
 * Main function to check for expired subscriptions and remove users
 */
async function checkExpiredSubscriptions() {
  console.log("Starting expired subscription check...");
  
  try {
    // Get all expired subscriptions that haven't been processed yet
    const expiredSubscriptions = await prismaClient.telegramSubscription.findMany({
      where: {
        status: "ACTIVE",
        expiryDate: {
          lt: new Date() // Find subscriptions where expiry date is less than now
        }
      },
      include: {
        plan: {
          include: {
            channel: true
          }
        }
      }
    });
    
    console.log(`Found ${expiredSubscriptions.length} expired subscriptions`);
    
    if (expiredSubscriptions.length === 0) {
      console.log("No expired subscriptions to process");
      return;
    }
    
    // Create a client using the bot token
    const botSession = new StringSession("");
    const client = new TelegramClient(botSession, TELEGRAM_API_ID, TELEGRAM_API_HASH, {
      connectionRetries: 5
    });
    
    await client.start({
      botAuthToken: BOT_TOKEN
    });
    
    console.log("Bot connected to Telegram");
    
    // Process each expired subscription
    for (const subscription of expiredSubscriptions) {
      console.log(`Processing expired subscription for user ${subscription.telegramUsername}, plan: ${subscription.planName}`);
      
      try {
        if (!subscription.plan?.channel?.telegramChannelId) {
          console.error("Missing channel ID for subscription:", subscription.id);
          continue;
        }
        
        // Remove user from channel
        const removed = await removeUserFromChannel(
          subscription.plan.channel.telegramChannelId, 
          subscription.telegramUsername,
          client
        );
        
        // Update subscription status regardless of removal success
        // This prevents the system from trying to process the same subscription repeatedly
        await prismaClient.telegramSubscription.update({
          where: { id: subscription.id },
          data: { 
            status: "EXPIRED",
            updatedAt: new Date() // Using updatedAt instead of processedAt
          }
        });
        
        console.log(`Subscription ${subscription.id} marked as expired${removed ? ' and user removed' : ''}`);
        
        // Log this action in a more generic way if the subscription log table doesn't exist
        console.log(`ACTION LOG: Subscription ${subscription.id} for user ${subscription.telegramUsername} expired. User removal ${removed ? 'successful' : 'failed'}.`);
        
        // Try to create log entry (only if the model exists)
        try {
          // @ts-ignore - We'll catch the error if this table doesn't exist
          await prismaClient.telegramSubscriptionLog.create({
            data: {
              subscriptionId: subscription.id,
              action: "EXPIRED",
              success: removed,
              details: removed 
                ? `User ${subscription.telegramUsername} removed from channel` 
                : `Failed to remove user ${subscription.telegramUsername} from channel`
            }
          });
        } catch (logError) {
          // Just log to console if the table doesn't exist
          console.log("Could not create log entry - table may not exist");
        }
        
      } catch (subError) {
        console.error(`Error processing subscription ${subscription.id}:`, subError);
      }
    }
    
    await client.disconnect();
    console.log("Expired subscription check completed");
    
  } catch (error) {
    console.error("Error during expired subscription check:", error);
  }
}

// Schedule the task to run once per day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log("Running scheduled subscription expiration check...");
  await checkExpiredSubscriptions();
});

// Also run once on startup for testing
console.log("Initializing Telegram subscription cron job...");
checkExpiredSubscriptions().catch(err => {
  console.error("Initial run failed:", err);
});

// Keep process alive
console.log("Cron job service is running...");




