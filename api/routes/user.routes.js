// api/routes/user.route.js
import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../utils/multer.js";

const router = express.Router();

router.post("/update/:id", verifyToken, uploadSingle("avatar"), updateUser);

export default router;
