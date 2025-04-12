import { Router } from "express";
import * as telegramController from "../controllers/telegramController.js";
import { authenticate } from "../middleware/auth.js";


export const telegramRouter = Router();

// auth
telegramRouter.post("/send-otp", authenticate, telegramController.sendOtp);
telegramRouter.post("/verify-otp", authenticate, telegramController.verifyOtp);
telegramRouter.get("/accounts", authenticate, telegramController.getAccount);
// channel management
telegramRouter.post("/channels", authenticate, telegramController.createChannel);
telegramRouter.get("/channels", authenticate, telegramController.getChannels);
telegramRouter.get("/channels/:channelId", authenticate, telegramController.getChannelById);
telegramRouter.put("/channels/:channelId", authenticate, telegramController.updateChannel);
telegramRouter.put("/channels/:channelId/publish", authenticate, telegramController.publishChannel);
telegramRouter.put("/channels/:channelId/unpublish", authenticate, telegramController.unpublishChannel);
telegramRouter.delete("/channels/:channelId", authenticate, telegramController.deleteChannel);

//plan management
telegramRouter.post("/channels/:channelId/plans", authenticate, telegramController.createPlan);
telegramRouter.get("/channels/:channelId/plans", authenticate, telegramController.getPlans);
telegramRouter.get("/plans/:planId", authenticate, telegramController.getPlanById);
telegramRouter.put("/plans/:planId", authenticate, telegramController.updatePlan);
telegramRouter.delete("/plans/:planId", authenticate, telegramController.deletePlan);

// Public routes (no authentication required)
telegramRouter.get("/public/channels/:slug", telegramController.getPublicChannelBySlug);

//subscription management
telegramRouter.post("/channels/:channelId/plans/:planId/initiate-subscription", authenticate, telegramController.initiateTelegramSubscription);

telegramRouter.get("/channels/:channelId/subscribers", authenticate, telegramController.getAllUserSubscribers);
// telegramRouter.get("/orders/:orderId/status", authenticate, telegramController.getOrderStatus);
// telegramRouter.post("/payment-callback", telegramController.handlePaymentCallback);
//cashfree payment
// telegramRouter.post("/create-cashfree-order", telegramController.createCashfreeOrder);
