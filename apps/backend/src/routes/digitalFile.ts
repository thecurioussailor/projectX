import { Router } from "express";
import * as digitalFileController from "../controllers/digitalFileController.js";
import { authenticate } from "../middleware/auth.js";

export const digitalFileRouter = Router();  

digitalFileRouter.get("/:purchasedItemId", authenticate, digitalFileController.getDigitalProductFiles);