import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
dotenv.config();

const app = express();
// DB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"));

// middleware
app.use(express.json());

// set routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(3000, () => console.log("Server running at port 3000"));
