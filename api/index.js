import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// DB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"));
const app = express();
app.listen(3000, () => console.log("Server running at port 3000"));
