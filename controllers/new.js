import ProblemSchedule from "../models/ProblemSchedule.js";

const generateReviewDates = (difficulty) => {
  const today = new Date();
  let days;
  if (difficulty === "Easy") days = [ 3, 7, 30];
  else if (difficulty === "Medium") days = [ 1, 7, 15, 45];
  else days = [ 1, 4, 10, 30, 90]; // Hard

  return days.map((d) => new Date(today.getTime() + d * 86400000)); // 86400000 ms in a day
};

// ✅ Save Problem with Optimized Review Schedule
export const handleNewProblem = async (req, res) => {
  const { email, problemId, difficulty } = req.body;
  if (!email || !problemId || !difficulty) {
    return res.status(400).json({ message: "❗ Missing fields." });
  }

  try {
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
export const getProblemsForTodayAndBefore = async (req, res) => {
  const { email } = req.params;

  try {
    // ✅ Get today's end time in UTC for consistency
    const tomorrowStart = new Date();
    tomorrowStart.setUTCHours(0, 0, 0, 0);
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

    console.log("✅ Tomorrow Start (UTC):", tomorrowStart);

    // ⚡ Query database for today's problems and all problems before today
    const problems = await ProblemSchedule.find(
      {
        email,
        nextReviewDate: { $lt: tomorrowStart }, // Changed to get all problems before tomorrow
      },
      { problemId: 1, _id: 0 } // 🎯 Project only `problemId`, exclude `_id`
    ).lean();

    // 🏷️ Extract problemIds into a simple array
    const problemIds = problems.map((problem) => problem.problemId);

    console.log("🎯 Today's and Previous Problem IDs:", problemIds);

    res.status(200).json({ problemIds });
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
  const { email, problemId } = req.body;
  try {
    // Find the problem for the user and check if it's in the review queue
    const problem = await ProblemSchedule.findOne({ email, problemId });
    if (!problem) {
      return res.status(404).json({ message: "❌ Problem not found." });
    }

    // Increment the repetition count
    problem.repetitionCount += 1;

    // Check if the problem should be marked as completed (based on difficulty)
    let isCompleted = false;
    if (problem.difficulty === "Easy" && problem.repetitionCount >= 4) {
      isCompleted = true;
    } else if (
      problem.difficulty === "Medium" &&
      problem.repetitionCount >= 5
    ) {
      isCompleted = true;
    } else if (problem.difficulty === "Hard" && problem.repetitionCount >= 6) {
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
  const { email } = req.params;

  try {
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
