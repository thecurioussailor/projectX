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
telegramRouter.delete("/channels/:channelId", authenticate, telegramController.deleteChannel);

//plan management
telegramRouter.post("/channels/:channelId/plans", authenticate, telegramController.createPlan);
telegramRouter.get("/channels/:channelId/plans", authenticate, telegramController.getPlans);
telegramRouter.get("/plans/:planId", authenticate, telegramController.getPlanById);
telegramRouter.put("/plans/:planId", authenticate, telegramController.updatePlan);
telegramRouter.delete("/plans/:planId", authenticate, telegramController.deletePlan);






