import mongoose from "mongoose";
const User = new mongoose.Schema({
    name:String,
    email:String,
    googleId:String,
    image:String
})
export default mongoose.model('User',User)