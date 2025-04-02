import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as purchasedItemsController from "../controllers/purchasedItemsController.js";

export const purchasedItemsRouter = Router();

purchasedItemsRouter.get("/", authenticate, purchasedItemsController.getPurchasedItems);
