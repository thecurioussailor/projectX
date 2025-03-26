import { Router } from "express";
import * as digitalProductController from "../controllers/digitalProductController.js";

export const digitalProductRouter = Router();

digitalProductRouter.post("/", digitalProductController.createDigitalProduct);

