import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { availabilityController } from "./availability.controller";

const router = Router();

router.post("/create", auth(UserRole.TECHNICIAN), availabilityController.createAvailability);

router.get("/", availabilityController.getAllAvailabilities);

router.get("/my", auth(UserRole.TECHNICIAN), availabilityController.myAvailability);

export const availabilityRoutes = router;