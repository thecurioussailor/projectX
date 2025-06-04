import { Router } from "express";
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../controllers/notificationController.js";
import { authenticate } from "../middleware/auth.js";

export const notificationRouter = Router();

notificationRouter.get("/", authenticate, getNotifications);
notificationRouter.put("/:id/read", authenticate, markAsRead);
notificationRouter.put("/read", authenticate, markAllAsRead);
notificationRouter.get("/unread-count", authenticate, getUnreadCount);
