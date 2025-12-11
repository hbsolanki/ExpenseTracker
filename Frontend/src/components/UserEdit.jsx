import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function UserEdit() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/${userId}/`);
        setName(res.data.name);
        setUsername(res.data.username);
      } catch (err) {
        setError("Failed to fetch user data");
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      if (password) formData.append("password", password);

      await axios.put(`/user/${userId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl border border-black/10 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center">Edit Profile</h2>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              className="border w-full p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="border w-full p-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Leave blank to keep current"
              className="border w-full p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
