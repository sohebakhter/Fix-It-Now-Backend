import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/create", auth(UserRole.CUSTOMER), bookingController.createBooking);

router.get("/", bookingController.getAllBookings);

router.get("/my-bookings", auth(UserRole.CUSTOMER), bookingController.getMyBookings);

export const bookingRoutes = router;