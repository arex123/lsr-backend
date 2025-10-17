import express from "express";
import { deleteUserAccount, getUserStats } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * User Management Routes
 */

// Get user statistics
router.get("/stats", getUserStats);

// Delete user account (dangerous - requires authentication)
router.delete("/me", deleteUserAccount);

export default router;

