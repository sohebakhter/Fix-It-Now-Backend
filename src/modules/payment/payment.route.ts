import { Router } from "express";
import { paymentController } from "./payment.controller";
import { UserRole } from "../../../generated/prisma/client";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/checkout", auth(UserRole.CUSTOMER, UserRole.TECHNICIAN, UserRole.ADMIN), paymentController.createCheckoutSession);

router.post("/webhook", paymentController.handleStripeWebhook);

router.get("/history", auth(UserRole.CUSTOMER), paymentController.getPaymentHistory);

router.get("/details/:id", auth(UserRole.CUSTOMER, UserRole.ADMIN), paymentController.getPaymentDetails);

export const paymentRoutes = router;