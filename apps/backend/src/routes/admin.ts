import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import * as adminUserController from "../controllers/admin/userManagementController.js";
import * as adminPlanManagementController from "../controllers/admin/planManagementConttroller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.post("/signin", adminController.adminSignin);
adminRouter.get("/profile", authenticate, authorizeAdmin, adminController.adminProfile);

//Withdrawal Requests
adminRouter.get("/withdrawals", authenticate, authorizeAdmin, adminController.getAllWithdrawalRequests);
adminRouter.post("/withdrawals/:id/approve", authenticate, authorizeAdmin, adminController.approveWithdrawalRequest);
adminRouter.post("/withdrawals/:id/reject", authenticate, authorizeAdmin, adminController.rejectWithdrawalRequest);

adminRouter.get("/users", authenticate, authorizeAdmin, adminUserController.getAllUsers);
adminRouter.get("/users/:id", authenticate, authorizeAdmin, adminUserController.getUserById);

//Banning a User
adminRouter.post("/users/:id/ban", authenticate, authorizeAdmin, adminUserController.banUser);
adminRouter.post("/users/:id/unban", authenticate, authorizeAdmin, adminUserController.unbanUser);

//Platform Subscription Routes
adminRouter.post("/platform-subscription-plans", authenticate, authorizeAdmin, adminPlanManagementController.createSubscriptionPlan);
adminRouter.get("/platform-subscription-plans", authenticate, authorizeAdmin, adminPlanManagementController.getAllSubscriptionPlans);
adminRouter.get("/platform-subscription-plans/:id", authenticate, authorizeAdmin, adminPlanManagementController.getSubscriptionPlanById);
adminRouter.put("/platform-subscription-plans/:id", authenticate, authorizeAdmin, adminPlanManagementController.updateSubscriptionPlan);
adminRouter.delete("/platform-subscription-plans/:id", authenticate, authorizeAdmin, adminPlanManagementController.deleteSubscriptionPlan);

//Platform Subscription Plan Feature Routes
adminRouter.post("/platform-features/:planId", authenticate, authorizeAdmin, adminPlanManagementController.createPlatformSubscriptionPlanFeature);
adminRouter.get("/platform-features/:planId", authenticate, authorizeAdmin, adminPlanManagementController.getAllPlatformSubscriptionPlanFeatures);
adminRouter.get("/platform-features/feature/:featureId", authenticate, authorizeAdmin, adminPlanManagementController.getPlatformSubscriptionPlanFeatureById);
adminRouter.put("/platform-features/:featureId", authenticate, authorizeAdmin, adminPlanManagementController.updatePlatformSubscriptionPlanFeature);
adminRouter.delete("/platform-features/:featureId", authenticate, authorizeAdmin, adminPlanManagementController.deletePlatformSubscriptionPlanFeature);