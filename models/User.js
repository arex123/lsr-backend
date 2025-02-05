import mongoose from "mongoose";
const User = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    googleId: String,
    picture: String,
    problemList: Object,
  },
  { timestamps: true }
);
export default mongoose.model("User", User);
