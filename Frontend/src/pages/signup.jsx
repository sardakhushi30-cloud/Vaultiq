//This is the signup page where users can create an account by providing their username ,email and password.

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) return toast.error("Please enter email");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("OTP sent successfully 📩");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error("Please enter OTP");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Account created successfully 🎉");
      setEmail("");
      setUsername("");
      setPassword("");
      setOtp("");
      setOtpSent(false);
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.24),transparent_24%),linear-gradient(135deg,#0f172a_0%,#111827_40%,#1d4ed8_100%)] p-4">
      <div className="float-slow w-full max-w-md rounded-[30px] border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 text-center">
           <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-violet-500 text-2xl shadow-lg">
            ✨
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Start your journey toward smarter money habits</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full rounded-2xl bg-linear-to-r from-cyan-500 to-violet-500 p-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.01]"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {otpSent && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full rounded-2xl bg-linear-to-r from-cyan-500 to-violet-500 p-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.01]"
              >
                {loading ? "Verifying..." : "Verify OTP & Signup"}
              </button>
            </>
          )}
        </div>


        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-cyan-600 transition hover:text-violet-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}