import Listing from "../models/listing.model.js";

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
