import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.token;

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded user from JWT:", decoded); // 👈 ye console karo
    // req.user = decoded;
    req.user = {
      id: decoded._id,
      ...decoded,
    };

    next();
  } catch (err) {
    next(err);
  }
};
