import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.registerUser);
router.get("/me", userController.getMyProfile);
router.put("/my-profile", userController.updateMyProfile);
router.delete("/", userController.deleteMyProfile);

export const userRoutes = router;