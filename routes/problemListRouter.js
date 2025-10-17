import express from "express";
import {
  addProblemManually,
  getUserProblems,
  createList,
  getList,
  addProblemToList,
  moveProblemInList,
} from "../controllers/problemController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * Problem Management Routes
 */

// Add problem manually
router.post("/problems/manual", addProblemManually);

// Get user's problems (with filters)
router.get("/problems", getUserProblems);

/**
 * List Management Routes
 */

// Create new list
router.post("/lists", createList);

// Get all lists for current user
router.get("/lists", async (req, res) => {
  try {
    const userId = req.userId;
    const List = (await import('../models/List.js')).default;
    
    const lists = await List.find({ userId })
      .populate('problems', 'title platform difficulty tags url')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      lists,
    });
  } catch (error) {
    console.error('Error fetching user lists:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lists',
    });
  }
});

// Get specific list
router.get("/lists/:id", getList);

// Add problem to list
router.post("/lists/:id/problems", addProblemToList);

// Move problem within list (reorder)
router.patch("/lists/:id/move-problem", moveProblemInList);

export default router;

