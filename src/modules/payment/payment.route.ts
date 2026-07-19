import { Router } from "express";
import { paymentController } from "./payment.controller";
import { UserRole } from "../../../generated/prisma/client";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/checkout", auth(UserRole.CUSTOMER, UserRole.TECHNICIAN, UserRole.ADMIN), paymentController.createCheckoutSession);

router.post("/webhook", paymentController.handleStripeWebhook);

export const paymentRoutes = router;