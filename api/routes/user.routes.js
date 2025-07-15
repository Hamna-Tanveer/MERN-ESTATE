import { Router } from "express";
import { test } from "../controllers/user.controller.js";
const userRouter = Router();
userRouter.get("/test", test);
export default userRouter;
