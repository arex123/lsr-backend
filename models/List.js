import mongoose from "mongoose";

/**
 * List Schema
 * User-specific problem lists with visibility control
 * Each user can have multiple lists
 */
const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Owner of the list
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for user's lists
    },
    // Problems in this list (ordered array)
    problems: [
      {
        problemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Problem",
          required: true,
        },
        // Position in the list (for ordering)
        position: {
          type: Number,
          required: true,
        },
        // When this problem was added to the list
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Visibility control
    visibility: {
      type: String,
      enum: ["private", "public", "shared"],
      default: "private",
    },
    // For shared lists - users who can access
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Metadata
    totalProblems: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user's lists
listSchema.index({ userId: 1, createdAt: -1 });

// Index for public/shared lists discovery
listSchema.index({ visibility: 1, updatedAt: -1 });

// Update totalProblems when problems array changes
listSchema.pre("save", function (next) {
  this.totalProblems = this.problems.length;
  next();
});

const List = mongoose.model("List", listSchema);

export default List;

