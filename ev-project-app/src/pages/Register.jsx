import { useState } from "react";
import { FaBatteryHalf, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (formData.password !== formData.password2) {
      setErrors({ password2: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {

      const response = await API.post("/register/", formData);

      if (response.status === 201) {
        navigate("/home");
      }
    } catch (error) {
      const data = error.response?.data || {};
      setErrors({
        username: data.username?.[0],
        email: data.email?.[0],
        password: data.password?.[0],
      });
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="h-screen flex items-center justify-center  px-4 py-8 overflow-hidden">
      <div className="backdrop-blur-md bg-[#262f3d80] text-white rounded-xl shadow-2xl w-full max-w-md p-8 space-y-6 border border-gray-700">
        <div className="text-center">
          <FaBatteryHalf className="mx-auto text-green-400 text-4xl mb-2" />
          <h2 className="text-3xl font-bold">Battery Health App</h2>
          <p className="text-gray-400 text-sm mt-1">Create your account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Username</label>
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-800 pl-10 pr-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-800 pl-10 pr-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm">Password</label>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-800 pl-10 pr-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Confirm Password</label>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className="w-full bg-gray-800 pl-10 pr-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            {errors.password2 && (
              <p className="text-red-400 text-sm mt-1">{errors.password2}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
    
  );
}
