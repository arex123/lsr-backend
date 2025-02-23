// const mongoose = require('mongoose');
import mongoose from "mongoose";

const problemScheduleSchema = new mongoose.Schema({
  email: { type: String, required: true },
  problemId: { type: String, required: true },
  difficulty: { type: String, required: true },
  reviewQueue: { type: [Date], required: true },
  nextReviewDate: { type: Date, required: true },
  repetitionCount: { type: Number, default: 0 }, // Number of times solved/reviewed
  solvedProblems: [{  // Track solved problems with their IDs
    problemId: String,
    solvedAt: Date,
  }],
});

const ProblemSchedule = mongoose.model('ProblemSchedule', problemScheduleSchema);

// module.exports = ProblemSchedule;
export default ProblemSchedule;