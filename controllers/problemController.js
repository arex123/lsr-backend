import Problem from "../models/Problem.js";
import List from "../models/List.js";

/**
 * @desc    Add a problem manually
 * @route   POST /api/problems/manual
 * @access  Private
 */
export const addProblemManually = async (req, res) => {
  try {
    const { title, platform, difficulty, tags, url, notes, isGlobal } = req.body;
    const userId = req.userId; // From auth middleware

    // Validation
    if (!title || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Title and difficulty are required",
      });
    }

    // Validate difficulty
    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Difficulty must be Easy, Medium, or Hard",
      });
    }

    // Create problem
    const problem = new Problem({
      title: title.trim(),
      platform: platform || "LeetCode",
      difficulty,
      tags: tags || [],
      url: url || "",
      notes: notes || "",
      createdBy: userId,
      isGlobal: isGlobal || false, // Only admins should set this true
    });

    await problem.save();

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem,
    });
  } catch (error) {
    console.error("Add problem error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating problem",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's problems
 * @route   GET /api/problems
 * @access  Private
 */
export const getUserProblems = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 50, difficulty, tags, search } = req.query;

    // Build query
    const query = {
      $or: [
        { createdBy: userId }, // User's problems
        { isGlobal: true }, // Global problems
      ],
    };

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    // Search by title
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const problems = await Problem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Problem.countDocuments(query);

    res.status(200).json({
      success: true,
      problems,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get problems error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching problems",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new list
 * @route   POST /api/lists
 * @access  Private
 */
export const createList = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    const userId = req.userId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "List name is required",
      });
    }

    const list = new List({
      name: name.trim(),
      description: description || "",
      userId,
      visibility: visibility || "private",
      problems: [],
    });

    await list.save();

    res.status(201).json({
      success: true,
      message: "List created successfully",
      list,
    });
  } catch (error) {
    console.error("Create list error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating list",
      error: error.message,
    });
  }
};

/**
 * @desc    Get a specific list
 * @route   GET /api/lists/:id
 * @access  Private
 */
export const getList = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const list = await List.findById(id).populate("problems.problemId").lean();

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    // Check access permissions
    const hasAccess =
      list.userId.toString() === userId ||
      list.visibility === "public" ||
      (list.visibility === "shared" &&
        list.sharedWith.some((uid) => uid.toString() === userId));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      list,
    });
  } catch (error) {
    console.error("Get list error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching list",
      error: error.message,
    });
  }
};

/**
 * @desc    Add problem to list
 * @route   POST /api/lists/:id/problems
 * @access  Private
 */
export const addProblemToList = async (req, res) => {
  try {
    const { id } = req.params;
    const { problemId } = req.body;
    const userId = req.userId;

    const list = await List.findOne({ _id: id, userId });

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found or access denied",
      });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Check if problem already in list
    const exists = list.problems.some(
      (p) => p.problemId.toString() === problemId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Problem already in list",
      });
    }

    // Add problem with position
    list.problems.push({
      problemId,
      position: list.problems.length,
      addedAt: new Date(),
    });

    await list.save();

    res.status(200).json({
      success: true,
      message: "Problem added to list",
      list,
    });
  } catch (error) {
    console.error("Add problem to list error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding problem to list",
      error: error.message,
    });
  }
};

/**
 * @desc    Move problem within list (reorder)
 * @route   PATCH /api/lists/:id/move-problem
 * @access  Private
 */
export const moveProblemInList = async (req, res) => {
  try {
    const { id } = req.params;
    const { problemId, newPosition } = req.body;
    const userId = req.userId;

    if (newPosition === undefined || !problemId) {
      return res.status(400).json({
        success: false,
        message: "problemId and newPosition are required",
      });
    }

    const list = await List.findOne({ _id: id, userId });

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found or access denied",
      });
    }

    // Find problem index
    const problemIndex = list.problems.findIndex(
      (p) => p.problemId.toString() === problemId
    );

    if (problemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Problem not found in list",
      });
    }

    // Validate new position
    if (newPosition < 0 || newPosition >= list.problems.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid position",
      });
    }

    // Remove problem from current position
    const [problem] = list.problems.splice(problemIndex, 1);

    // Insert at new position
    list.problems.splice(newPosition, 0, problem);

    // Update all positions
    list.problems.forEach((p, index) => {
      p.position = index;
    });

    await list.save();

    res.status(200).json({
      success: true,
      message: "Problem moved successfully",
      list,
    });
  } catch (error) {
    console.error("Move problem error:", error);
    res.status(500).json({
      success: false,
      message: "Error moving problem",
      error: error.message,
    });
  }
};

