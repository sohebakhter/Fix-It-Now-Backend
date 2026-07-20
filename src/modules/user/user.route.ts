import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);
router.get("/me", auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN), userController.getMyProfile);
router.patch("/my-profile", auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN), userController.updateMyProfile);
router.delete("/my-profile", auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.TECHNICIAN), userController.deleteMyProfile);
// admin
router.patch("/:userId", auth(UserRole.ADMIN), userController.updateUser);
router.delete("/:userId", auth(UserRole.ADMIN), userController.deleteUser);

// router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);

export const userRoutes = router;