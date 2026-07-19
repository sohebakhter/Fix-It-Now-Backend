import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/create", auth(UserRole.CUSTOMER), reviewController.createReview)

export const reviewRoutes = router;