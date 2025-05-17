import { prismaClient } from "@repo/db";
import TelegramBot from 'node-telegram-bot-api';
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

// Check for required environment variables
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

// Initialize Telegram bot with your bot token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

console.log('Telegram subscription bot service started');

interface ChatMemberUpdate {
  chat: {
    id: number;
    title?: string;
    type: string;
  };
  from: {
    id: number;
    first_name: string;
    username?: string;
  };
  date: number;
  old_chat_member: {
    user: {
      id: number;
      first_name: string;
      username?: string;
    };
    status: string;
  };
  new_chat_member: {
    user: {
      id: number;
      first_name: string;
      username?: string;
    };
    status: string;
  };
}

/**
 * Main function to monitor user joins through invite links
 * This will listen to chat member updates in channels
 */

bot.on('message', (msg) => {
  console.log('Received message:', {
    chat_id: msg.chat.id,
    from: msg.from?.username || msg.from?.first_name || 'Unknown',
    text: msg.text || '[No text]',
    date: new Date(msg.date * 1000).toISOString()
  });
  
  // Reply to show bot is working
  bot.sendMessage(msg.chat.id, 'Bot is active and listening!');
});

// Listen for chat join requests (when someone uses an invite link)
bot.on('chat_join_request', async (request) => {
  try {
    const inviteLink = request.invite_link?.invite_link;
    if (!inviteLink) return;
    
    // Find the subscription with this invite link
    const subscription = await prismaClient.telegramSubscription.findFirst({
      where: { 
        inviteLink: inviteLink,
        status: 'ACTIVE'
      }
    });
    
    if (!subscription) return;
    
    // Update subscription with user info
    await prismaClient.telegramSubscription.update({
      where: { id: subscription.id },
      data: {
        telegramUserId: request.from.id.toString(),
        telegramUsername: request.from.username || null
      }
    });
    
    // Approve the join request
    await bot.approveChatJoinRequest(request.chat.id, request.from.id);
    console.log(`Approved join request for user ${request.from.username || request.from.id}`);
    
    // Revoke the invite link to make it one-time use
    await bot.revokeChatInviteLink(request.chat.id, inviteLink);
    console.log(`Revoked invite link ${inviteLink} after successful join`);
    
  } catch (error) {
    console.error('Error processing join request:', error);
  }
});

bot.on('my_chat_member', (update) => {
  console.log('Channel membership update:', JSON.stringify(update));
  // This fires when YOUR bot's status changes in a chat
});

bot.on('chat_member', async (chatMember: ChatMemberUpdate) => {
  console.log('Raw chat_member update received:', JSON.stringify(chatMember));
  
  try {
    // Detect any status change to "member" (someone joined)
    if (chatMember.new_chat_member.status === 'member' && 
        chatMember.old_chat_member.status !== 'member') {
      
      // Log more detailed information
      console.log('JOIN EVENT DETECTED');
      console.log('Chat type:', chatMember.chat.type);
      console.log('Chat ID:', chatMember.chat.id);
      console.log('User ID:', chatMember.new_chat_member.user.id);
      console.log('Old status:', chatMember.old_chat_member.status);
      console.log('New status:', chatMember.new_chat_member.status);
      
      // Rest of your code...
    }
  } catch (error) {
    console.error('Error handling chat member update:', error);
  }
});

// bot.on('chat_member', async (chatMember: ChatMemberUpdate) => {
//   console.log('Raw chat_member update received:', JSON.stringify(chatMember));
//   try {
//     // Only process if this is a new member joining
//     if (chatMember.new_chat_member.status === 'member' && 
//         (chatMember.old_chat_member.status === 'left' || chatMember.old_chat_member.status === 'kicked')) {
      
//       const channelId = chatMember.chat.id.toString();
//       const userTelegramId = chatMember.new_chat_member.user.id.toString();
//       const username = chatMember.new_chat_member.user.username;
      
//       console.log(`User ${username || 'unknown'} (${userTelegramId}) joined channel ${channelId}`);
      
//       // Find the subscription with matching invite link for this channel
//       const telegramChannel = await prismaClient.telegramChannel.findFirst({
//         where: {
//           telegramChannelId: channelId,
//           status: 'ACTIVE'
//         }
//       });
      
//       if (!telegramChannel) {
//         console.log(`Channel ${channelId} not found in database or is inactive`);
//         return;
//       }
      
//       // Find the subscription with a matching invite link that hasn't been used yet
//       const subscription = await prismaClient.telegramSubscription.findFirst({
//         where: {
//           inviteLink: { not: null },
//           telegramUserId: null, // Not yet used
//           telegramUsername: null, // Not yet used
//           plan: {
//             channelId: telegramChannel.id,
//             status: 'ACTIVE'
//           },
//           status: 'ACTIVE'
//         }
//       });
      
//       if (!subscription) {
//         console.log('No pending subscription found for this channel');
//         return;
//       }
      
//       // Update the subscription with the user's Telegram details
//       await prismaClient.telegramSubscription.update({
//         where: { id: subscription.id },
//         data: {
//           telegramUserId: userTelegramId,
//           telegramUsername: username || null
//         }
//       });
      
//       console.log(`Updated subscription ${subscription.id} with Telegram user ${username || userTelegramId}`);
//     }
//   } catch (error) {
//     console.error('Error handling chat member update:', error);
//   }
// });

/**
 * Scheduled task to remove users with expired subscriptions
 * Runs every day at midnight
 */
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled task to check expired subscriptions');
  
  try {
    // Find all expired subscriptions
    const expiredSubscriptions = await prismaClient.telegramSubscription.findMany({
      where: {
        expiryDate: { lt: new Date() },
        status: 'ACTIVE', // Only check active subscriptions
        telegramUserId: { not: null } // User must be identified
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
    
    // Process each expired subscription
    for (const subscription of expiredSubscriptions) {
      try {
        if (!subscription.plan.channel.telegramChannelId || !subscription.telegramUserId) {
          continue;
        }
        
         // Format channel ID correctly
         let channelId = subscription.plan.channel.telegramChannelId;
        
         // Ensure channelId starts with -100 for channels
         if (!channelId.startsWith('-100') && !channelId.startsWith('-')) {
           channelId = `-100${channelId}`;
         }
        
         // Convert userId to number
         const userId = parseInt(subscription.telegramUserId);
        
        console.log(`Removing user ${subscription.telegramUsername || userId} from channel ${channelId}`);
        
        // Ban the user from the channel
        await bot.banChatMember(channelId, userId);
        
        // Immediately unban so they can rejoin in the future
        await bot.unbanChatMember(channelId, userId, { only_if_banned: true });
        
        // Update subscription status to EXPIRED
        await prismaClient.telegramSubscription.update({
          where: { id: subscription.id },
          data: { status: 'EXPIRED' }
        });
        
        console.log(`Successfully removed user and updated subscription ${subscription.id} to EXPIRED`);
      } catch (error) {
        console.error(`Error processing expired subscription ${subscription.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error checking expired subscriptions:', error);
  }
});


// Add this code to your bot file
bot.onText(/\/check_expired/, async (msg) => {
  // Optional: Restrict to admins only
  // if (msg.from.id !== YOUR_ADMIN_ID) return;
  
  bot.sendMessage(msg.chat.id, "Running expired subscription check manually...");
  console.log("Manual check triggered by", msg.from?.username || msg.from?.id);
  
  try {
    // Call the same function the cron job uses
    // Get expired subscriptions
    const expiredSubscriptions = await prismaClient.telegramSubscription.findMany({
      where: {
        expiryDate: { lt: new Date() },
        status: 'ACTIVE',
        telegramUserId: { not: null }
      },
      include: {
        plan: {
          include: {
            channel: true
          }
        }
      }
    });
    
    bot.sendMessage(msg.chat.id, `Found ${expiredSubscriptions.length} expired subscriptions`);
    
    // Process each one with the fixed channel ID format
    for (const subscription of expiredSubscriptions) {
      try {
        if (!subscription.plan.channel.telegramChannelId || !subscription.telegramUserId) {
          continue;
        }
        
        // Format channel ID correctly
        let channelId = subscription.plan.channel.telegramChannelId;
        
        // Ensure channelId starts with -100 for channels
        if (!channelId.startsWith('-100') && !channelId.startsWith('-')) {
          channelId = `-100${channelId}`;
        }
        
        const userId = parseInt(subscription.telegramUserId);
        
        console.log(`Removing user ${subscription.telegramUsername || userId} from channel ${channelId}`);
        bot.sendMessage(msg.chat.id, `Removing user ${subscription.telegramUsername || userId} from channel ${channelId}`);
        
        // Ban the user from the channel
        await bot.banChatMember(channelId, userId);
        
        // Immediately unban so they can rejoin in the future
        await bot.unbanChatMember(channelId, userId, { only_if_banned: true });
        
        // Update subscription status
        await prismaClient.telegramSubscription.update({
          where: { id: subscription.id },
          data: { status: 'EXPIRED' }
        });
        
        bot.sendMessage(msg.chat.id, `Successfully removed user from channel and marked subscription ${subscription.id} as expired`);
      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        bot.sendMessage(msg.chat.id, `Error with subscription ${subscription.id}: ${error instanceof Error ? error.message : String(error)}`);
        
        // Still mark as expired even if removal fails
        try {
          await prismaClient.telegramSubscription.update({
            where: { id: subscription.id },
            data: { status: 'EXPIRED' }
          });
          bot.sendMessage(msg.chat.id, `Marked subscription as expired despite removal failure`);
        } catch (updateError) {
          console.error(`Failed to update subscription status:`, updateError);
        }
      }
    }
    
    bot.sendMessage(msg.chat.id, "Expired subscription check completed");
  } catch (error) {
    console.error("Manual check error:", error);
    bot.sendMessage(msg.chat.id, "Error during check: " + (error as Error).message);
  }
});


/**
 * Error handling for bot
 */
bot.on('polling_error', (error: Error) => {
  console.error('Telegram bot polling error:', error);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prismaClient.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prismaClient.$disconnect();
  process.exit(0);
});
