import { Router } from "express";
import { technicianProfileController } from "./technicianProfile.controller";

const router = Router();

// Browse all available services and technicians

// Search and filter by service type, location, rating, and price
// View technician profiles with service details and reviews

router.get("/", technicianProfileController.getTechnicians);

router.get("/:technicianId", technicianProfileController.getTechnicianProfile);

export const technicianProfileRoutes = router;