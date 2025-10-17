import User from "../models/User.js";
import Problem from "../models/Problem.js";
import List from "../models/List.js";
import ProblemSchedule from "../models/ProblemSchedule.js";

/**
 * @desc    Delete user account and all associated data
 * @route   DELETE /api/users/me
 * @access  Private (requires authentication)
 */
export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    console.log(`🗑️  Deleting user account: ${userId}`);

    // Find user first to get email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userEmail = user.email;

    // Delete all associated data in parallel for better performance
    const deleteOperations = await Promise.all([
      // 1. Delete all problems created by this user
      Problem.deleteMany({ createdBy: userId }),
      
      // 2. Delete all lists owned by this user
      List.deleteMany({ userId: userId }),
      
      // 3. Delete all problem schedules for this user (by email)
      ProblemSchedule.deleteMany({ email: userEmail }),
      
      // 4. Delete the user account itself
      User.findByIdAndDelete(userId),
    ]);

    console.log(`✅ Deleted user data:`);
    console.log(`   - Problems: ${deleteOperations[0].deletedCount}`);
    console.log(`   - Lists: ${deleteOperations[1].deletedCount}`);
    console.log(`   - Problem Schedules: ${deleteOperations[2].deletedCount}`);
    console.log(`   - User Account: Deleted`);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      deletedData: {
        problems: deleteOperations[0].deletedCount,
        lists: deleteOperations[1].deletedCount,
        schedules: deleteOperations[2].deletedCount,
      },
    });
  } catch (error) {
    console.error("❌ Error deleting user account:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/users/stats
 * @access  Private
 */
export const getUserStats = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get counts in parallel
    const [problemsCount, listsCount, schedulesCount] = await Promise.all([
      Problem.countDocuments({ createdBy: userId }),
      List.countDocuments({ userId: userId }),
      ProblemSchedule.countDocuments({ email: user.email }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        problemsCreated: problemsCount,
        listsCreated: listsCount,
        scheduledProblems: schedulesCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error.message,
    });
  }
};

