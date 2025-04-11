import { Router } from "express";
import { authRouter } from "./auth.js";
import { userRouter } from "./user.js";
import { linkRouter } from "./link.js";
import { telegramRouter } from "./telegram.js";
import { digitalProductRouter } from "./digitalProduct.js";
import { purchasedItemsRouter } from "./purchasedItems.js";
import { orderRouter } from "./order.js";
import { dashboardRouter } from "./dashboard.js";
import { salesRouter } from "./sales.js";
export const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/purchased-items", purchasedItemsRouter);
router.use("/links", linkRouter);
router.use("/telegram", telegramRouter);
router.use("/digital-products", digitalProductRouter);
router.use("/orders", orderRouter);
router.use("/dashboard", dashboardRouter);
router.use("/sales", salesRouter);


