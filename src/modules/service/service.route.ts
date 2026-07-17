import { Router } from "express";
import { serviceController } from "./service.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create", auth(UserRole.TECHNICIAN), serviceController.createService);

router.get("/", serviceController.getAllServices);

router.delete("/:serviceId", auth(UserRole.TECHNICIAN, UserRole.ADMIN), serviceController.deleteService);

export const serviceRoutes = router;