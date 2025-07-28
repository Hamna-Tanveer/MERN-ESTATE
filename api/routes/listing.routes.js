import { Router } from "express";
import {
  createListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);

export default router;
