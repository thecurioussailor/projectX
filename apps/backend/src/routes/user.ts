import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
export const userRouter = Router();

// User profile routes
userRouter.get("/me", authenticate, userController.getProfile);
userRouter.put("/me", authenticate, userController.updateProfile);

userRouter.post("/profilepicture", authenticate, userController.getProfileUploadUrl);
userRouter.post("/profilepicture/update", authenticate, userController.updateProfilePicture);
userRouter.get("/profilepicture", authenticate, userController.getProfilePicture);
userRouter.post("/profilepicture/delete", authenticate, userController.deleteProfilePicture);

userRouter.post("/coverpicture", authenticate, userController.getCoverUploadUrl);
userRouter.post("/coverpicture/update", authenticate, userController.updateCoverPicture);
userRouter.get("/coverpicture", authenticate, userController.getCoverPicture);
userRouter.post("/coverpicture/delete", authenticate, userController.deleteCoverPicture);

// Admin routes for user management
userRouter.get("/", authenticate, authorizeAdmin, userController.getUsers);
userRouter.get("/:id", authenticate, authorizeAdmin, userController.getUserById);
userRouter.delete("/:id", authenticate, authorizeAdmin, userController.deleteUserById);
