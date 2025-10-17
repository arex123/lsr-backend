import ProblemSchedule from "../models/ProblemSchedule.js";
import User from "../models/User.js";

/**
 * Spaced Repetition Algorithm - Optimized for Long-Term Retention
 * Based on the forgetting curve and active recall principles
 * 
 * Key Principles:
 * 1. First review within 24 hours (reinforce initial learning)
 * 2. Gradually increasing intervals (exponential growth)
 * 3. More reviews for harder problems (they're easier to forget)
 * 4. Intervals designed to hit the sweet spot before forgetting
 */
const generateReviewDates = (difficulty) => {
  const today = new Date();
  let intervals; // Days between each review
  
  if (difficulty === "Easy") {
    // Easy problems: 5 reviews over ~2 months
    // Pattern: Quick reinforcement, then longer gaps
    intervals = [1, 3, 7, 14, 30];
    // Schedule: Day 1, 4, 11, 25, 55
  } 
  else if (difficulty === "Medium") {
    // Medium problems: 6 reviews over ~2 months
    // Pattern: Frequent early reviews, gradual spacing
    intervals = [1, 2, 4, 7, 14, 30];
    // Schedule: Day 1, 3, 7, 14, 28, 58
  } 
  else {
    // Hard problems: 7 reviews over ~2 months
    // Pattern: Very frequent early reviews (crucial for complex problems)
    intervals = [1, 1, 3, 5, 7, 14, 30];
    // Schedule: Day 1, 2, 5, 10, 17, 31, 61
  }

  // Calculate cumulative review dates
  const reviewDates = [];
  let cumulativeDays = 0;
  
  for (const interval of intervals) {
    cumulativeDays += interval;
    const reviewDate = new Date(today.getTime() + cumulativeDays * 86400000);
    reviewDates.push(reviewDate);
  }
  
  console.log(`📅 Generated ${difficulty} problem schedule:`, reviewDates.map(d => d.toDateString()));
  return reviewDates;
};

// ✅ Save Problem with Optimized Review Schedule
export const handleNewProblem = async (req, res) => {
  const { problemId, difficulty } = req.body;
  if (!problemId || !difficulty) {
    return res.status(400).json({ message: "❗ Missing fields." });
  }

  try {
    // Get user email from authenticated userId
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    const reviewDates = generateReviewDates(difficulty);
    const nextReviewDate = reviewDates.shift(); // Get the first review date

    // Create a new problem schedule entry with repetition count 0 initially
    const schedule = new ProblemSchedule({
      email,
      problemId,
      difficulty,
      reviewQueue: reviewDates,
      nextReviewDate,
      repetitionCount: 0, // Initialize repetition count to 0
    });

    await schedule.save();
    res.status(201).json({ message: "✅ Problem scheduled.", nextReviewDate });
  } catch (error) {
    res.status(500).json({ message: "❌ Error scheduling problem.", error });
  }
};
export const newGetTodaysProblem = async (req, res) => {
  try {
    // Get user email from authenticated userId
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    // ✅ Get today's start time in UTC for consistency
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    
    const tomorrowStart = new Date();
    tomorrowStart.setUTCHours(0, 0, 0, 0);
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

    console.log("✅ Today Start (UTC):", todayStart);
    console.log("✅ Tomorrow Start (UTC):", tomorrowStart);

    // ⚡ Query database for today's problems and all problems before today
    const problems = await ProblemSchedule.find(
      {
        email,
        nextReviewDate: { $lt: tomorrowStart }, // Changed to get all problems before tomorrow
      },
      { problemId: 1, nextReviewDate: 1, difficulty: 1, _id: 0 } // Include nextReviewDate for overdue calculation
    ).lean();

    // 🏷️ Calculate overdue days for each problem
    const problemsWithOverdue = problems.map((problem) => {
      const reviewDate = new Date(problem.nextReviewDate);
      reviewDate.setUTCHours(0, 0, 0, 0);
      
      // Calculate days difference (negative means overdue)
      const diffTime = todayStart - reviewDate;
      const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        problemId: problem.problemId,
        nextReviewDate: problem.nextReviewDate,
        difficulty: problem.difficulty,
        overdueDays: overdueDays, // 0 = due today, >0 = overdue, <0 = future
      };
    });

    // Sort by overdue (most overdue first)
    problemsWithOverdue.sort((a, b) => b.overdueDays - a.overdueDays);

    console.log("🎯 Today's and Previous Problems with Overdue Info:", problemsWithOverdue);

    res.status(200).json({ 
      problemIds: problemsWithOverdue.map(p => p.problemId), // Keep backward compatibility
      problems: problemsWithOverdue // New detailed format
    });
  } catch (error) {
    console.error("❌ Error fetching today's and previous problems:", error);
    res.status(500).json({ 
      message: "❌ Error fetching today's and previous problems.", 
      error 
    });
  }
};
// ✅ Mark Problem as Solved/Reviewed and Update Repetition Count
export const handleRevisionProblem = async (req, res) => {
  console.log("rewq ",req.body)
  const { problemId } = req.body;
  
  try {
    // Get user email from authenticated userId
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    // Find the problem for the user and check if it's in the review queue
    const problem = await ProblemSchedule.findOne({ email, problemId });
    if (!problem) {
      return res.status(404).json({ message: "❌ Problem not found." });
    }

    // Increment the repetition count
    problem.repetitionCount += 1;

    // Add to review history
    problem.reviewHistory.push({ solvedAt: new Date() });

    // Check if the problem should be marked as completed (based on difficulty)
    let isCompleted = false;
    if (problem.difficulty === "Easy" && problem.repetitionCount >= 6) {
      // 6 total reviews (initial solve + 5 reviews)
      isCompleted = true;
    } else if (
      problem.difficulty === "Medium" &&
      problem.repetitionCount >= 7
    ) {
      // 7 total reviews (initial solve + 6 reviews)
      isCompleted = true;
    } else if (problem.difficulty === "Hard" && problem.repetitionCount >= 8) {
      // 8 total reviews (initial solve + 7 reviews)
      isCompleted = true;
    }

    // If the problem is completed, update its status
    if (isCompleted) {
      problem.status = "completed";
    } else {
      // Otherwise, update the next review date
      const nextReviewDate = problem.reviewQueue.shift();
      problem.nextReviewDate = nextReviewDate;
    }

    // Save the updated problem schedule
    await problem.save();

    res
      .status(200)
      .json({
        message: "✅ Problem solved successfully!",
        repetitionCount: problem.repetitionCount,
      });
  } catch (error) {
    res.status(500).json({ message: "❌ Error solving problem.", error });
  }
};

// ✅ Get All Problem IDs Solved At Least Once
export const getSolvedProblems = async (req, res) => {
  try {
    // Get user email from authenticated userId
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    // Find all problems for the user where repetitionCount > 0 and return only the problemId
    const solvedProblemIds = await ProblemSchedule.find(
      { email }, // Query problems that have been solved at least once
      { problemId: 1, _id: 0 } // Only select the problemId field, exclude _id
    ).lean(); // Using lean() for faster query result

    // If no solved problems found, return an empty array
    const ids =
      solvedProblemIds.length === 0
        ? []
        : solvedProblemIds.map((problem) => problem.problemId);

    res.status(200).json({ solvedProblemIds: ids });
  } catch (error) {
    res
      .status(500)
      .json({ message: "❌ Error fetching solved problem IDs.", error });
  }
};

// ✅ Get Problem Schedule Details
export const getProblemScheduleDetails = async (req, res) => {
  const { problemId } = req.params;
  
  try {
    // Get user email from authenticated userId
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    // Find the problem schedule
    const schedule = await ProblemSchedule.findOne({ email, problemId }).lean();
    
    if (!schedule) {
      return res.status(404).json({ message: "❌ Problem schedule not found." });
    }

    res.status(200).json({ 
      success: true,
      schedule: {
        problemId: schedule.problemId,
        difficulty: schedule.difficulty,
        repetitionCount: schedule.repetitionCount,
        nextReviewDate: schedule.nextReviewDate,
        reviewQueue: schedule.reviewQueue,
        reviewHistory: schedule.reviewHistory,
        status: schedule.status,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      }
    });
  } catch (error) {
    console.error("❌ Error fetching problem schedule:", error);
    res.status(500).json({ message: "❌ Error fetching problem schedule.", error });
  }
};

// ✅ Reset Problem (Remove from schedule only, keep problem in database)
export const resetProblemSchedule = async (req, res) => {
  const { problemId } = req.params;
  
  try {
    // Get user email from authenticated userId
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    // Only delete from problem schedule (remove from review queue)
    const deletedSchedule = await ProblemSchedule.findOneAndDelete({ email, problemId });
    
    if (!deletedSchedule) {
      return res.status(404).json({ message: "❌ Problem schedule not found." });
    }

    console.log(`🔄 Reset problem schedule: ${problemId} for ${email}`);
    
    res.status(200).json({ 
      success: true,
      message: "✅ Problem reset successfully. Removed from schedule.",
    });
  } catch (error) {
    console.error("❌ Error resetting problem:", error);
    res.status(500).json({ message: "❌ Error resetting problem.", error });
  }
};

// ✅ Delete Problem Completely
export const deleteProblemSchedule = async (req, res) => {
  const { problemId } = req.params;
  
  try {
    // Get user email from authenticated userId
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    // 1. Try to delete from problem schedule (if it exists)
    const deletedSchedule = await ProblemSchedule.findOneAndDelete({ email, problemId });
    
    // 2. Check if the problem exists in the Problem collection
    const Problem = (await import('../models/Problem.js')).default;
    const problem = await Problem.findById(problemId);
    
    if (!problem) {
      return res.status(404).json({ message: "❌ Problem not found." });
    }

    // 3. Delete the problem itself if it was created by this user (not global)
    if (!problem.isGlobal && problem.createdBy && problem.createdBy.toString() === req.userId) {
      // User created this problem, so delete it completely
      await Problem.findByIdAndDelete(problemId);
      console.log(`🗑️ Deleted user-created problem: ${problemId}`);
      
      res.status(200).json({ 
        success: true,
        message: "✅ Problem deleted successfully.",
        deletedFrom: deletedSchedule ? "schedule and database" : "database only"
      });
    } else if (problem.isGlobal) {
      // Global problem - only remove from schedule if it was there
      if (deletedSchedule) {
        console.log(`ℹ️ Global problem removed from schedule: ${problemId}`);
        res.status(200).json({ 
          success: true,
          message: "✅ Problem removed from schedule.",
          deletedFrom: "schedule only"
        });
      } else {
        // Global problem not in schedule - can't delete
        return res.status(403).json({ 
          message: "❌ Cannot delete global problems that are not in your schedule.",
          isGlobal: true
        });
      }
    } else {
      return res.status(403).json({ 
        message: "❌ You don't have permission to delete this problem."
      });
    }
  } catch (error) {
    console.error("❌ Error deleting problem:", error);
    res.status(500).json({ message: "❌ Error deleting problem.", error });
  }
};

// ========================================
// 📝 NOTES MANAGEMENT API
// ========================================

/**
 * Get all notes for a specific problem
 */
export const getNotes = async (req, res) => {
  const { problemId } = req.params;
  
  try {
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    const schedule = await ProblemSchedule.findOne({ email, problemId }).select('notes');
    
    if (!schedule) {
      return res.status(404).json({ message: "❌ Problem schedule not found." });
    }

    res.status(200).json({ 
      success: true,
      notes: schedule.notes || []
    });
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    res.status(500).json({ message: "❌ Error fetching notes.", error });
  }
};

/**
 * Add a new note to a problem
 */
export const addNote = async (req, res) => {
  const { problemId } = req.params;
  const { content } = req.body;
  
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: "❌ Note content is required." });
  }

  try {
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    const schedule = await ProblemSchedule.findOne({ email, problemId });
    
    if (!schedule) {
      return res.status(404).json({ message: "❌ Problem schedule not found. Please solve the problem first." });
    }

    const newNote = {
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    schedule.notes.push(newNote);
    await schedule.save();

    console.log(`📝 Added note to problem ${problemId} for ${email}`);

    res.status(201).json({ 
      success: true,
      message: "✅ Note added successfully.",
      note: schedule.notes[schedule.notes.length - 1] // Return the newly added note with _id
    });
  } catch (error) {
    console.error("❌ Error adding note:", error);
    res.status(500).json({ message: "❌ Error adding note.", error });
  }
};

/**
 * Update an existing note
 */
export const updateNote = async (req, res) => {
  const { problemId, noteId } = req.params;
  const { content } = req.body;
  
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: "❌ Note content is required." });
  }

  try {
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    const schedule = await ProblemSchedule.findOne({ email, problemId });
    
    if (!schedule) {
      return res.status(404).json({ message: "❌ Problem schedule not found." });
    }

    const note = schedule.notes.id(noteId);
    
    if (!note) {
      return res.status(404).json({ message: "❌ Note not found." });
    }

    note.content = content.trim();
    note.updatedAt = new Date();
    
    await schedule.save();

    console.log(`📝 Updated note ${noteId} for problem ${problemId}`);

    res.status(200).json({ 
      success: true,
      message: "✅ Note updated successfully.",
      note
    });
  } catch (error) {
    console.error("❌ Error updating note:", error);
    res.status(500).json({ message: "❌ Error updating note.", error });
  }
};

/**
 * Delete a note
 */
export const deleteNote = async (req, res) => {
  const { problemId, noteId } = req.params;

  try {
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }
    const email = user.email;

    const schedule = await ProblemSchedule.findOne({ email, problemId });
    
    if (!schedule) {
      return res.status(404).json({ message: "❌ Problem schedule not found." });
    }

    const noteIndex = schedule.notes.findIndex(note => note._id.toString() === noteId);
    
    if (noteIndex === -1) {
      return res.status(404).json({ message: "❌ Note not found." });
    }

    schedule.notes.splice(noteIndex, 1);
    await schedule.save();

    console.log(`🗑️ Deleted note ${noteId} from problem ${problemId}`);

    res.status(200).json({ 
      success: true,
      message: "✅ Note deleted successfully."
    });
  } catch (error) {
    console.error("❌ Error deleting note:", error);
    res.status(500).json({ message: "❌ Error deleting note.", error });
  }
};
