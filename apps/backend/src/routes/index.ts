import { Router } from "express";
import { authRouter } from "./auth.js";
import { userRouter } from "./user.js";
import { linkRouter } from "./link.js";
import { telegramRouter } from "./telegram.js";
import { digitalProductRouter } from "./digitalProduct.js";
export const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/links", linkRouter);
router.use("/telegram", telegramRouter);
router.use("/public", digitalProductRouter);

