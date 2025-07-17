import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hasedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hasedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created succesfully!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.next(errorHandler(401, "Wrong Credentials!"));
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = user._doc; // password filed ko rename kr k pass nam rakh do or baqi data ko rest me stroe krwaa don or rest ko respone me dekha do
    res
      .cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
