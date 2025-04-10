import { Router } from "express";
import * as linkController from "../controllers/linkController.js";
import { authenticate } from "../middleware/auth.js";

export const linkRouter = Router();

// Public routes
linkRouter.get("/:shortId", linkController.redirectToOriginalUrl);
// linkRouter.post("/analytics/track", linkController.trackAnalytics);
linkRouter.get("/stats/:shortId", linkController.getLinkStats);

// Protected routes
linkRouter.post("/", authenticate, linkController.createLink);
linkRouter.get("/", authenticate, linkController.getUserLinks);
linkRouter.delete("/:id", authenticate, linkController.deleteLink);
