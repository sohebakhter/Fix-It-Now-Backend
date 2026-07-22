import { Router } from "express";
import { technicianProfileController } from "./technicianProfile.controller";

const router = Router();

router.get("/", technicianProfileController.getTechnicians);

router.get("/:technicianId", technicianProfileController.getTechnicianProfile);

export const technicianProfileRoutes = router;