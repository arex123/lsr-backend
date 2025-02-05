import mongoose from "mongoose";
const ScheduledProblem = new mongoose.Schema(
  {
    email: String,
    problem: Object,
    status: Boolean,
    position:Number,
    dateToSolve: mongoose.Schema.Types.Date,
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", ScheduledProblem);
export default Schedule;
