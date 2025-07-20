import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/user/userSlice.js"; // Import your Redux action

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Immediate preview (before upload completes)
    setFile(selectedFile);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      // Update Redux store with new user data (including the avatar URL)
      dispatch(updateUser(data));
    } catch (error) {
      console.error("Upload error:", error);
      // Revert to previous image if upload fails
      setFile(null);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          onChange={handleFileChange}
          hidden
          accept="image/*"
        />
        <div className="flex flex-col items-center">
          <img
            onClick={() => fileRef.current.click()}
            src={file ? URL.createObjectURL(file) : currentUser.avatar}
            alt="profile"
            className="rounded-full h-32 w-32 object-cover cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-2">
            Click to change profile picture
          </p>
        </div>
        <input
          className="border p-3 rounded-lg"
          type="text"
          placeholder="username"
          id="username"
        />
        <input
          className="border p-3 rounded-lg"
          type="email"
          placeholder="email"
          id="email"
        />
        <input
          className="border p-3 rounded-lg"
          type="password"
          placeholder="password"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
