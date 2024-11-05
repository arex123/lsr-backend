import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import MongodbConnect from "./config/db.js";
import router from "./routes/authroutes.js";

const app = express();

// Connect to MongoDB
MongodbConnect();

// Enable CORS
app.use(
  cors({
    origin: [process.env.CLIENT_URL], 
    methods: "GET,POST,PUT,DELETE",
    credentials: true, 
  })
);
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
// Routes
app.use("/auth", router);

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
