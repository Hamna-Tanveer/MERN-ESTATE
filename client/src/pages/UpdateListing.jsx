import { useEffect } from "react";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const selectedFilesRef = useRef([]);
  const [invalidSelection, setInvalidSelection] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: "1",
    bathrooms: "1",
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });

  //console.log(files);
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

  //handle file change
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files).slice(0, 6);
    selectedFilesRef.current = selected;
  };

  const handleUploadClick = async () => {
    const selected = selectedFilesRef.current;

    // Combine old + new selected files
    const totalFiles = [...files, ...selected];

    // If combined files > 6, show error
    if (totalFiles.length == 0 || totalFiles.length > 6) {
      setInvalidSelection(true);
      return;
    }

    setUploading(true);
    setInvalidSelection(false);

    // Simulate upload delay
    await new Promise((res) => setTimeout(res, 1000));

    // Create object URLs for new files only
    const newPreviews = selected.map((file) => URL.createObjectURL(file));

    // Append new files and previews to existing
    setFiles((prev) => [...prev, ...selected]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    setFormData((prev) => ({
      ...prev,
      imageUrls: [...(prev.imageUrls || []), ...newPreviews], // ✅ fallback to [] if undefined
    }));

    setUploading(false);
  };

  //Delete Handler

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedUrls = [...prev.imageUrls];
      updatedUrls.splice(index, 1);

      return {
        ...prev,
        imageUrls: updatedUrls,
      };
    });

    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    const updatedPreviews = [...previewUrls];
    updatedPreviews.splice(index, 1);
    setPreviewUrls(updatedPreviews);
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image ");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);

      // Upload images to Cloudinary first
      const imageUploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_PRESET
        ); // Set up in Cloudinary
        return fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        ).then((res) => res.json());
      });

      const uploadResults = await Promise.all(imageUploadPromises);
      const imageUrls = uploadResults.map((result) => result.secure_url);
      const cloudinaryPublicIds = uploadResults.map(
        (result) => result.public_id
      );

      // Send the rest of the data with image URLs
      console.log(params.listingId);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrls,
          cloudinaryPublicIds,
        }),
      });

      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      const listing_id = data._id;
      if (!listing_id) {
        console.error("_id is missing in parsed data");
        //console.log("Full data object keys :", Object.keys(data));
        throw new Error("Listing created but no ID returned");
      }

      navigate(`/listing/${listing_id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  //console.log(formData);
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className=" flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className=" flex gap-6 flex-wrap">
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                checked={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                checked={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                checked={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>
            {formData.offer && (
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  checked={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discount price</p>
                  <span className="text-xs">$ / month</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              This first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={handleFileSelect}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="images/*"
              multiple
            />
            <button
              disabled={uploading}
              onClick={handleUploadClick}
              type="button"
              className="p-3 border text-green-700 border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploding..." : "Upload"}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {invalidSelection && (
              <p className=" text-red-500 font-semibold">
                You have to select at least 1 or maximun 6 Images!
              </p>
            )}
            {formData.imageUrls.map((url, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border rounded-lg p-3 shadow bg-white w-full max-w-md"
              >
                <img
                  src={url}
                  alt={`uploded-${idx}`}
                  className="w-20 h-20 object-cover rounded-md"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className=" font-semibold text-red-600 uppercase  cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover: opacity-95 disabled:opacity-80 "
          >
            {loading ? "Updating..." : " Update Listings"}
          </button>
          {error && <p className="text-red-600 font-semibold">{error}</p>}
        </div>
      </form>
    </main>
  );
}
