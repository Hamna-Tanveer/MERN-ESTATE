import { Router } from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create", verifyToken, createListing);

export default router;
