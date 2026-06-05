import { useEffect, useState } from "react";
import API from "../api/auth";
// import { response } from "express";

export default function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await API.get("/profile/");
      setProfile(response.data);
    } catch (err) {
      console.error("Error loading profile:",err);
    }
  };

  const handleSave = async () => {
    try {
      await API.put("/profile/update/", profile);
       setProfile(response.data);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profile_image", file);
    try {
      const response =await API.put("/profile/update/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((prev) => ({
      ...prev,
       profile_image: response.data.profile_image || prev.profile_image,
    }));
  } catch (error) {
    console.error("Avatar upload failed:", error);
  }
};
  if (!profile) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Main Section */}
      <main className="flex-1 p-12">
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">Public Profile</h2>

        <div className="flex items-center gap-6 mb-8">
          <img
            src={
              profile.profile_image
                ? `http://localhost:8000${profile.profile_image}`
                : "/default-avatar.png"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full border object-cover shadow"
          />
          <div className="flex flex-col gap-3">
            <label
              htmlFor="avatar-upload"
              className="px-4 py-2 bg-blue-700 text-white rounded-md cursor-pointer hover:bg-blue-800 text-center"
            >
              Change picture
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-sm text-gray-600 mb-2">First Name</label>
            <input
              type="text"
              value={profile.first_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, first_name: e.target.value })
              }
              className="w-full border p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Last Name</label>
            <input
              type="text"
              value={profile.last_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, last_name: e.target.value })
              }
              className="w-full border p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="mt-8">
          <label className="block text-sm text-gray-600 mb-2">Email</label>
          <input
            type="email"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full border p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mt-8">
          <label className="block text-sm text-gray-600 mb-2">Mobile</label>
          <input
            type="text"
            value={profile.mobile || ""}
            onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
            className="w-full border p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-10 bg-blue-700 text-white px-8 py-3 rounded-md hover:bg-blue-800 shadow-md"
        >
          Save Changes
        </button>

        {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
      </main>
    </div>
  );
}
