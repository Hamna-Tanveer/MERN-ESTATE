import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authenticated, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user from JWT:", decoded); // 👈 ye console karo
    // req.user = decoded;
    req.user = {
      id: decoded._id,
      ...decoded,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
