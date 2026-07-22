import { Router } from "express";
import { technicianProfileController } from "./technicianProfile.controller";

const router = Router();

// Browse all available services and technicians

// Search and filter by service type, location, rating, and price
// View technician profiles with service details and reviews

router.get("/", technicianProfileController.getTechnicians);

export const technicianProfileRoutes = router;