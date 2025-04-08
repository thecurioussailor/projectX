import { Router } from "express";
import * as digitalProductController from "../controllers/digitalProductController.js";
import * as testimonialController from "../controllers/testimonialController.js";
import * as faqController from "../controllers/faqController.js";
import * as registrationQuestionController from "../controllers/registrationQuestionController.js";
import * as supportDetailController from "../controllers/supportDetailController.js";
import * as fileUploadController from "../controllers/fileUploadController.js";
import { authenticate } from "../middleware/auth.js";

export const digitalProductRouter = Router();

// Main product routes
digitalProductRouter.post("/", authenticate, digitalProductController.createDigitalProduct);
digitalProductRouter.get("/", authenticate, digitalProductController.getDigitalProducts);
digitalProductRouter.get("/:productId", authenticate, digitalProductController.getDigitalProductById);
digitalProductRouter.put("/:productId", authenticate, digitalProductController.updateDigitalProduct);
digitalProductRouter.delete("/:productId", authenticate, digitalProductController.deleteDigitalProduct);
digitalProductRouter.post("/:productId/publish", authenticate, digitalProductController.publishDigitalProduct);
digitalProductRouter.post("/:productId/unpublish", authenticate, digitalProductController.unpublishDigitalProduct);

// Public routes
digitalProductRouter.get("/public/:slug", digitalProductController.getPublicDigitalProductBySlug);

// File upload routes
digitalProductRouter.post("/:productId/uploadUrl", authenticate, fileUploadController.getUploadUrl);
digitalProductRouter.post("/:productId/uploadFile", authenticate, fileUploadController.uploadDigitalProductFile);
digitalProductRouter.get("/:productId/files", authenticate, fileUploadController.getDigitalProductFiles);
digitalProductRouter.delete("/:productId/files/:fileId", authenticate, fileUploadController.deleteFile);

// Testimonial routes
digitalProductRouter.post("/:productId/testimonials", authenticate, testimonialController.createTestimonial);
digitalProductRouter.get("/:productId/testimonials", authenticate, testimonialController.getTestimonials);
digitalProductRouter.put("/testimonials/:testimonialId", authenticate, testimonialController.updateTestimonial);
digitalProductRouter.delete("/testimonials/:testimonialId", authenticate, testimonialController.deleteTestimonial);

// FAQ routes
digitalProductRouter.post("/:productId/faqs", authenticate, faqController.createFaq);
digitalProductRouter.get("/:productId/faqs", authenticate, faqController.getFaqs);
digitalProductRouter.put("/faqs/:faqId", authenticate, faqController.updateFaq);
digitalProductRouter.delete("/faqs/:faqId", authenticate, faqController.deleteFaq);

// Registration question routes
digitalProductRouter.post("/:productId/registration-questions", authenticate, registrationQuestionController.createRegistrationQuestion);
digitalProductRouter.get("/:productId/registration-questions", authenticate, registrationQuestionController.getRegistrationQuestions);
digitalProductRouter.put("/registration-questions/:registrationQuestionId", authenticate, registrationQuestionController.updateRegistrationQuestion);
digitalProductRouter.delete("/registration-questions/:registrationQuestionId", authenticate, registrationQuestionController.deleteRegistrationQuestion);

// Support detail routes
digitalProductRouter.post("/:productId/support-details", authenticate, supportDetailController.createSupportDetail);
digitalProductRouter.get("/:productId/support-details", authenticate, supportDetailController.getSupportDetails);
digitalProductRouter.put("/support-details/:supportDetailId", authenticate, supportDetailController.updateSupportDetail);
digitalProductRouter.delete("/support-details/:supportDetailId", authenticate, supportDetailController.deleteSupportDetail);








