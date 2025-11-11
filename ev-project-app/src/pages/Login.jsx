import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/login/",  form);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setMessage("✅ Login successful!");
      navigate("/home");
    } catch (err) {
       console.error(err);
      setMessage("❌ Invalid credentials");
    }
  };

  return (
    <div className="h-screen justify-center pt-36 place-items-center overflow-hidden">
      <div className="backdrop-blur-md bg-[#262f3d80] text-white rounded-xl shadow-2xl w-full max-w-md p-8 space-y-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
        <input name="username" placeholder="Username" onChange={handleChange} className="p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-2 border rounded" />
        <button type="submit" className="bg-green-600 text-white py-2 rounded">Login</button>
      </form>
      <p className="mt-3 text-sm text-red-600">{message}</p>
      </div>
      </div>
  );
}
