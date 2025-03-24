import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
export const userRouter = Router();

// User profile routes
userRouter.get("/me", authenticate, userController.getProfile);
userRouter.put("/me", authenticate, userController.updateProfile);

// Admin routes for user management
userRouter.get("/", authenticate, authorizeAdmin, userController.getUsers);
userRouter.get("/:id", authenticate, authorizeAdmin, userController.getUserById);
userRouter.delete("/:id", authenticate, authorizeAdmin, userController.deleteUserById);
