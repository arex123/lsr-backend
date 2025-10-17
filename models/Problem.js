import mongoose from "mongoose";

/**
 * Problem Schema
 * Stores both global problems (shared) and user-created problems
 * Optimized with indexes for scalability
 */
const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // Index for fast search
    },
    platform: {
      type: String,
      required: true,
      enum: ["LeetCode", "HackerRank", "CodeForces", "AtCoder", "Other"],
      default: "LeetCode",
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
      index: true, // Index for filtering by difficulty
    },
    tags: {
      type: [String],
      default: [],
      index: true, // Index for tag-based queries
    },
    url: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    // User who created this problem (null for global problems)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true, // Index for user-specific queries
    },
    // True for problems visible to all users
    isGlobal: {
      type: Boolean,
      default: false,
      index: true, // Index for filtering global problems
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound index for efficient queries (global problems + difficulty)
problemSchema.index({ isGlobal: 1, difficulty: 1 });

// Compound index for user's problems
problemSchema.index({ createdBy: 1, createdAt: -1 });

// Text index for search functionality (title search)
problemSchema.index({ title: "text", tags: "text" });

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;

