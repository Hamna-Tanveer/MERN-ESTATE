import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import cloudinary from "../utils/cloudinary.js";

export const updateUser = async (req, res, next) => {
  try {
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-estate/avatars",
      });

      // Update user in database
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          avatar: result.secure_url,
          avatarPublicId: result.public_id,
        },
        { new: true }
      );

      return res.status(200).json(updatedUser);
    }

    return next(errorHandler(400, "No file provided"));
  } catch (error) {
    next(error);
  }
};
