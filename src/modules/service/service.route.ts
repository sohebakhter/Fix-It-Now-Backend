import { Router } from "express";
import { serviceController } from "./service.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create", auth(UserRole.TECHNICIAN), serviceController.createService);

router.get("/", serviceController.getAllServices);

router.get("/my-services", auth(UserRole.TECHNICIAN), serviceController.getMyServices);

// router.patch("/:serviceId", auth(UserRole.TECHNICIAN), serviceController.updateService);

router.delete("/:serviceId", auth(UserRole.TECHNICIAN, UserRole.ADMIN), serviceController.deleteService);

export const serviceRoutes = router;