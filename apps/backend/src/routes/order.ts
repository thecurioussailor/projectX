import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as orderController from "../controllers/orderController.js";
export const orderRouter = Router();

orderRouter.get("/payment-callback", orderController.handlePaymentCallback); // No auth - public callback
orderRouter.get("/:orderId", authenticate, orderController.getOrderById);
orderRouter.get("/user/list", authenticate, orderController.getUserOrders);
