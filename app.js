import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import MongodbConnect from "./config/db.js";
import probRouter from './routes/problemRouter.js'
const app = express();
MongodbConnect();

app.use(express.json())
app.use(cors())
app.use(probRouter)

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running now`);
});
