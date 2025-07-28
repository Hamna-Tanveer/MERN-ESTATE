import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      cloudinaryPublicIds,
    } = req.body;

    const newListing = new Listing({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      cloudinaryPublicIds,
      userRef: req.user.id,
    });

    await newListing.save();
    res.status(201).json({ success: true, data: newListing });
  } catch (error) {
    next(error);
  }
};

/*export const deleteListing = async (req, res, next) => {
  console.log("Requested ID:", req.params.id);

  const listing = await Listing.findById(req.params.id);
  console.log("Current listing:", listing);
  if (!listing) return next(errorHandler(404, "Listing not found!"));

  if (req.user.id !== listing.userRef.toString())
    return next(errorHandler(401, "You can only delete your own listings!"));
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};*/
export const deleteListing = async (req, res, next) => {
  console.log("Requested ID:", req.params.id);

  try {
    const listing = await Listing.findById(req.params.id);
    console.log("Current listing:", listing);

    if (!listing) return next(errorHandler(404, "Listing not found!"));

    // Check if the listing belongs to the user
    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(401, "You can only delete your own listings!"));
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(401, "You can update your own listings!"));
  }

  try {
    const updateListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updateListing);
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
