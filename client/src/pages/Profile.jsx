import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/user/userSlice.js";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: null, message: "" }); // null | 'uploading' | 'success' | 'error'
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStatus({ type: "uploading", message: "Starting upload..." });

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const res = await fetch(`/api/user/upload/${currentUser._id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await res.json();
      dispatch(updateUser(data));
      setStatus({ type: "success", message: "Profile picture updated!" });
    } catch (error) {
      setFile(null);
      setStatus({ type: "error", message: error.message });
    } finally {
      setTimeout(() => setStatus({ type: null, message: "" }), 3000);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <div className="flex flex-col items-center mb-4">
        <input
          type="file"
          ref={fileRef}
          onChange={handleFileChange}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={file ? URL.createObjectURL(file) : currentUser.avatar}
          alt="profile"
          className={`rounded-full h-32 w-32 object-cover cursor-pointer ${
            status.type === "uploading" ? "opacity-70" : ""
          }`}
        />

        {/* Status indicator */}
        {status.type && (
          <p
            className={`mt-2 text-sm ${
              status.type === "success"
                ? "text-green-500"
                : status.type === "error"
                ? "text-red-500"
                : "text-blue-500"
            }`}
          >
            {status.message}
          </p>
        )}
        {!status.type && (
          <p className="text-sm text-gray-500 mt-2">
            Click to change profile picture
          </p>
        )}
      </div>

      {/* Rest of your form remains unchanged */}
      <form className="flex flex-col gap-4">
        <input
          className="border p-3 rounded-lg"
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
        />
        <input
          className="border p-3 rounded-lg"
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
        />
        <input
          className="border p-3 rounded-lg"
          type="password"
          placeholder="password"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer hover:underline">
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer hover:underline">
          Sign out
        </span>
      </div>
    </div>
  );
}
