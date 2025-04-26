import { Router } from "express";
import * as kycController from "../controllers/kycController.js";
import { authenticate } from "../middleware/auth.js";
export const kycRouter = Router();

kycRouter.post("/get-upload-url", authenticate, kycController.getUploadKycUrl);
kycRouter.post("/upload-document", authenticate, kycController.uploadKycDocument);
kycRouter.get("/get-kyc-document", authenticate, kycController.getKycDocument);