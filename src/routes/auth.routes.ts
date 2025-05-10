import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import asyncWrapper from "../utils/asyncWrapper";
import validateMiddleware from "../middleware/validate.middleware";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
  verifyEmailSchema,
} from "../validators/auth.schema";

const router = Router();

// Public routes
router.post(
  "/register",
  validateMiddleware(createUserSchema),
  asyncWrapper(authController.registerUser)
);

router.post(
  "/verify-email",
  validateMiddleware(verifyEmailSchema),
  asyncWrapper(authController.verifyEmailOtp)
);

router.post(
  "/login",
  validateMiddleware(loginUserSchema),
  asyncWrapper(authController.loginUser)
);

router.post("/logout", asyncWrapper(authController.logoutUser));

// Protected routes - User self management
router.get("/me", authMiddleware, asyncWrapper(authController.getUserProfile));
router.put(
  "/me",
  authMiddleware,
  validateMiddleware(updateUserSchema),
  asyncWrapper(authController.updateUserProfile)
);
router.delete(
  "/me",
  authMiddleware,
  asyncWrapper(authController.deleteUserProfile)
);
router.get(
  "/me/role",
  authMiddleware,
  asyncWrapper(authController.getUserRole)
);
router.put(
  "/me/role",
  authMiddleware,
  asyncWrapper(authController.updateUserRole)
);

// Admin/Generic management - optionally protect with role check later
router.get("/", authMiddleware, asyncWrapper(authController.getAllUsers));
router.get("/:id", authMiddleware, asyncWrapper(authController.getUserById));
router.put("/:id", authMiddleware, asyncWrapper(authController.updateUserById));
router.delete(
  "/:id",
  authMiddleware,
  asyncWrapper(authController.deleteUserById)
);

export default router;
