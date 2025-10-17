import mongoose from "mongoose";

const problemScheduleSchema = new mongoose.Schema({
  email: { type: String, required: true },
  problemId: { type: String, required: true },
  difficulty: { type: String, required: true },
  reviewQueue: { type: [Date], required: true },
  nextReviewDate: { type: Date, required: true },
  repetitionCount: { type: Number, default: 0 }, // Number of times solved/reviewed
  reviewHistory: [{  // Track each time the problem was solved
    solvedAt: { type: Date, default: Date.now },
  }],
  notes: [{  // User notes for the problem
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }],
  status: { type: String, default: "active" }, // active or completed
}, { timestamps: true }); // Adds createdAt and updatedAt

const ProblemSchedule = mongoose.model('ProblemSchedule', problemScheduleSchema);

export default ProblemSchedule;