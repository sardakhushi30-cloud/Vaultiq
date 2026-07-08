//This is the Login page where users can login to their account by providing their email and password.

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Login Successful 🎉");
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendForgotOtp = async () => {
    if (!forgotEmail) return toast.error("Enter email first");

    try {
      setForgotLoading(true);

      const res = await fetch("http://localhost:5000/api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("OTP sent to email 📩");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      return toast.error("Fill OTP and new password");
    }

    try {
      setForgotLoading(true);

      const res = await fetch("http://localhost:5000/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Password reset successful 🎉");
      setShowForgot(false);
      setOtpSent(false);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.24),transparent_24%),linear-gradient(135deg,#0f172a_0%,#111827_40%,#1d4ed8_100%)] p-4">
      <div className="float-slow w-full max-w-md rounded-[30px] border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-violet-500 text-2xl shadow-lg">
            ✨
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Login to continue managing your expenses</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-linear-to-r from-cyan-500 to-violet-500 p-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.01]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          onClick={() => setShowForgot(true)}
          className="mt-4 cursor-pointer text-center text-sm font-medium text-cyan-600 transition hover:text-violet-600 hover:underline"
        >
          Forgot Password?
        </p>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold text-cyan-600 transition hover:text-violet-600">
            Signup
          </Link>
        </p>
      </div>

      {showForgot && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

            <input
              type="email"
              placeholder="Enter email"
              className="mb-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />

            <button
              onClick={sendForgotOtp}
              disabled={forgotLoading}
              className="mb-3 w-full rounded-2xl bg-linear-to-r from-cyan-500 to-violet-500 p-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.01]"
            >
              {forgotLoading ? "Sending..." : "Send OTP"}
            </button>

            {otpSent && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="mb-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="New Password"
                  className="mb-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                  onClick={handleResetPassword}
                  disabled={forgotLoading}
                  className="w-full rounded-2xl bg-linear-to-r from-cyan-500 to-violet-500 p-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.01]"
                >
                  {forgotLoading ? "Processing..." : "Reset Password"}
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowForgot(false);
                setOtpSent(false);
              }}
              className="mt-3 w-full text-sm text-slate-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}