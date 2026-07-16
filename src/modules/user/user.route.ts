import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);
router.get("/me", auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN), userController.getMyProfile);
router.put("/my-profile", userController.updateMyProfile);
router.delete("/", userController.deleteMyProfile);

export const userRoutes = router;