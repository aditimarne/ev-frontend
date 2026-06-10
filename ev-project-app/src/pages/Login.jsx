import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/login/", form);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setMessage("✅ Login successful!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid credentials");
    }
  };

  const resetForgotState = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotMessage({ text: "", type: "" });
    setLoading(false);
  };

  const handleSendOtp = async () => {
    if (!email) return setForgotMessage({ text: "Please enter your email.", type: "error" });
    setLoading(true);
    setForgotMessage({ text: "", type: "" });
    try {
      await API.post("/send-otp/", { email });
      setForgotMessage({ text: "OTP sent to your email.", type: "success" });
      setStep(2);
    } catch (err) {
      setForgotMessage({ text: err.response?.data?.error || "Failed to send OTP.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setForgotMessage({ text: "Please enter the OTP.", type: "error" });
    setLoading(true);
    setForgotMessage({ text: "", type: "" });
    try {
      await API.post("/verify-otp/", { email, otp });
      setForgotMessage({ text: "OTP verified!", type: "success" });
      setStep(3);
    } catch (err) {
      setForgotMessage({ text: err.response?.data?.error || "Invalid or expired OTP.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return setForgotMessage({ text: "Please fill all fields.", type: "error" });
    if (newPassword !== confirmPassword)
      return setForgotMessage({ text: "Passwords do not match.", type: "error" });
    setLoading(true);
    setForgotMessage({ text: "", type: "" });
    try {
      await API.post("/reset-password/", { email, otp, new_password: newPassword });
      setForgotMessage({ text: "Password reset successful! Redirecting to login...", type: "success" });
      setTimeout(() => {
        setShowForgot(false);
        resetForgotState();
      }, 2000);
    } catch (err) {
      setForgotMessage({ text: err.response?.data?.error || "Reset failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ─── Forgot Password Modal ───
  if (showForgot) {
    return (
      <div className="h-screen justify-center pt-36 place-items-center overflow-hidden">
        <div className="backdrop-blur-md bg-[#262f3d80] text-white rounded-xl shadow-2xl w-full max-w-md p-8 space-y-6 border border-gray-700">
          
          {/* Header */}
          <h2 className="text-xl font-bold text-center">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Set New Password"}
          </h2>
          <p className="text-sm text-gray-400 text-center">
            {step === 1 && "Enter your registered email to receive an OTP."}
            {step === 2 && `OTP sent to ${email}`}
            {step === 3 && "Choose a strong new password."}
          </p>

          {/* Step indicators */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-green-500 w-8" : "bg-gray-600 w-4"
                }`}
              />
            ))}
          </div>

          {/* Messages */}
          {forgotMessage.text && (
            <p className={`text-sm text-center ${
              forgotMessage.type === "success" ? "text-green-400" : "text-red-400"
            }`}>
              {forgotMessage.type === "success" ? "✅" : "❌"} {forgotMessage.text}
            </p>
          )}

          {/* Step 1 — Email */}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400 focus:border-green-500 outline-none"
              />
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* Step 2 — OTP */}
          {step === 2 && (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400 focus:border-green-500 outline-none text-center tracking-widest text-lg"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                onClick={handleSendOtp}
                className="text-sm text-gray-400 hover:text-white text-center transition"
              >
                Resend OTP
              </button>
            </div>
          )}

          {/* Step 3 — New Password */}
          {step === 3 && (
            <div className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400 focus:border-green-500 outline-none"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400 focus:border-green-500 outline-none"
              />
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}

          {/* Back to Login */}
          <button
            onClick={() => { setShowForgot(false); resetForgotState(); }}
            className="w-full text-sm text-gray-400 hover:text-white text-center transition"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ─── Login Form ───
  return (
    <div className="h-screen justify-center pt-36 place-items-center overflow-hidden">
      <div className="backdrop-blur-md bg-[#262f3d80] text-white rounded-xl shadow-2xl w-full max-w-md p-8 space-y-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
              name="username"
              placeholder="Username or Email"
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400"
          />

          {/* ✅ Forgot Password link */}
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-sm text-green-400 hover:text-green-300 text-right transition"
          >
            Forgot Password?
          </button>

          <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            Login
          </button>
        </form>
        <p className="mt-3 text-sm text-red-400">{message}</p>
      </div>
    </div>
  );
}