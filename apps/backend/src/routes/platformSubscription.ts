import { Router } from "express"
import * as platformSubscriptionController from "../controllers/platformSubscriptionController.js";
export const platformSubsriptionRouter = Router();

platformSubsriptionRouter.post("/initiate-purchase", platformSubscriptionController.initiatePlatformSubscriptionPurchase);
platformSubsriptionRouter.get("/get-all-subscriptions", platformSubscriptionController.getAllSubscriptions);
