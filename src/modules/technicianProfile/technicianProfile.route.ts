import { Router } from "express";
import { technicianProfileController } from "./technicianProfile.controller";

const router = Router();

router.get("/", technicianProfileController.getTechnicianProfiles);

export const technicianProfileRoutes = router;