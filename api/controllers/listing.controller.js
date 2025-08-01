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
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    // filtering
    let offer = req.query.offer;
    // agr offer undefined ya false he tu koi filter na lagao or sari listings show krwao
    if (offer === undefined || offer === false) {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === false) {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === false) {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
