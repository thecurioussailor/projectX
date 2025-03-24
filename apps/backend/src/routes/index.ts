import { Router } from "express";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { linkRouter } from "./link";

export const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/links", linkRouter);

