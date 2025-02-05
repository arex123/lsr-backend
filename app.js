import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import MongodbConnect from "./config/db.js";
import router from "./routes/authroutes.js";
import authRouter from './routes/authRouter.js'
import probRouter from './routes/problemRouter.js'
const app = express();
import jwt from 'jsonwebtoken'
// Connect to MongoDB
MongodbConnect();

// Enable CORS
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL, 
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true, 
//   })
// );
app.use(cors())
app.use(express.json());

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
import "./config/passport.js"; // Ensure passport strategies are configured
import User from "./models/User.js";
import { leetcodeProblems } from "./config/Problems.js";
// Routes

app.use("/auth", router);
app.use("/auth",authRouter)
app.use(probRouter)

app.get('/aditya',async(req,res)=>{
  let user = await User.findOne({email:'ad47kumar@gmail.com'})
  if(!user){
    user = await User.create({
      name:'Aditya',
      email:'ad47kumar@gmail.com',
      googleId:'undefined',
      picture:'https://assets.leetcode.com/users/avatars/avatar_1643744223.png',
      problemList:leetcodeProblems
    })
  }
  let token = jwt.sign({user},process.env.JWT_SECRET,{expiresIn:'10m'})
  let userData = {
    name:user.name,
    email:user.email,
    leetcode:"aadiac",
    googleId:user.googleId,
    picture:user.picture
  }
  res.status(200).json({
    user:userData,
    list:user.problemList,
    success:true,
    token
  })
})

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
