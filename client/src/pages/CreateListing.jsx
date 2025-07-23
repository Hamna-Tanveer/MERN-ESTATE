import React from "react";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className=" flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
          />
          <div className=" flex gap-6 flex-wrap">
            <div className=" flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className=" flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className=" flex gap-2">
              <input type="checkbox" id="parking-spot" className="w-5" />
              <span>Parking Spot</span>
            </div>
            <div className=" flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className=" flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              <p>Baths</p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discount price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>
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
              className="p-3 border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="images/*"
              multiple
            />
            <button className="p-3 text-green-700 border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover: opacity-95 disabled:opacity-80 ">
            Create Listings
          </button>
        </div>
      </form>
    </main>
  );
}
