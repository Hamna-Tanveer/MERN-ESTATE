import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import listingRouter from "./routes/listing.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
// DB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"));

// middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// set routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.listen(3000, () => console.log("Server running at port 3000"));
