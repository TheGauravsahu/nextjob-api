import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);

// Protected routes - User self management
router.get("/me", authMiddleware, authController.getUserProfile);
router.put("/me", authMiddleware, authController.updateUserProfile);
router.delete("/me", authMiddleware, authController.deleteUserProfile);
router.get("/me/role", authMiddleware, authController.getUserRole);
router.put("/me/role", authMiddleware, authController.updateUserRole);

// Admin/Generic management - optionally protect with role check later
router.get("/", authMiddleware, authController.getAllUsers);
router.get("/:id", authMiddleware, authController.getUserById);
router.put("/:id", authMiddleware, authController.updateUserById);
router.delete("/:id", authMiddleware, authController.deleteUserById);

// Email-based routes
router.get("/email/:email", authMiddleware, authController.getUserByEmail);
router.put("/email/:email", authMiddleware, authController.updateUserByEmail);

export default router;
