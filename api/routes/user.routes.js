// api/routes/user.route.js
import express from "express";
import {
  updateUser,
  uploadProfilePic,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../utils/multer.js";

const router = express.Router();

router.post(
  "/upload/:id",
  verifyToken,
  uploadSingle("avatar"),
  uploadProfilePic
);

router.post("/update/:id", verifyToken, updateUser);

export default router;
