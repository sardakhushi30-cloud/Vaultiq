/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [todayNotifications, setTodayNotifications] = useState([]);
  const [tomorrowNotifications, setTomorrowNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState(false);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const notificationRef = useRef();
  const profileRef = useRef();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/expenses": "Expenses",
    "/reports": "Reports",
    "/budget": "Budget",
    "/profile": "Profile",
    "/reminders": "Reminders",
  };

  // CLOSE DROPDOWNS ON OUTSIDE CLICK (UX IMPROVEMENT)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setOpenNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setUsername(data.username);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/reminder/today",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTodayNotifications(res.data.today || []);
      setTomorrowNotifications(res.data.tomorrow || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalNotifications =
    todayNotifications.length + tomorrowNotifications.length;

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl px-6 sm:px-8 shadow-sm">

      <div className="flex h-full items-center justify-between">

        {/* LEFT - TITLE */}
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            {pageTitles[location.pathname] || "Expense Tracker"}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Manage your finances smartly
          </p>
        </div>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-4 sm:gap-6">

          {/* NOTIFICATIONS */}
          <div className="relative" ref={notificationRef}>

            <button
              onClick={() => setOpenNotifications(!openNotifications)}
              className="relative p-2 rounded-full hover:bg-slate-100 transition hover:scale-105"
            >
              <FaBell size={20} className="text-slate-600" />

              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full animate-pulse">
                  {totalNotifications > 9 ? "9+" : totalNotifications}
                </span>
              )}
            </button>

            {/* DROPDOWN */}
            {openNotifications && (
              <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto rounded-2xl border bg-white shadow-2xl animate-fadeIn">

                {totalNotifications === 0 ? (
                  <div className="p-6 text-center text-slate-500">
                    <p className="text-sm">No reminders found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      You're all caught up 🎉
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-4">

                    {/* TODAY */}
                    {todayNotifications.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-cyan-600 px-2 mb-2">
                          📅 Today
                        </p>

                        {todayNotifications.map((r) => (
                          <div
                            key={r._id}
                            className="p-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 transition mb-2"
                          >
                            <p className="font-medium text-slate-800">
                              {r.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              🕐 {r.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TOMORROW */}
                    {tomorrowNotifications.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-orange-600 px-2 mb-2">
                          📆 Tomorrow
                        </p>

                        {tomorrowNotifications.map((r) => (
                          <div
                            key={r._id}
                            className="p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition mb-2"
                          >
                            <p className="font-medium text-slate-800">
                              {r.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              🕐 {r.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative" ref={profileRef}>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-full border bg-white/80 hover:shadow-md transition hover:scale-[1.02]"
            >

              <div className="h-9 w-9 rounded-full bg-linear-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>

              <span className="hidden sm:block font-medium text-slate-700">
                {loading ? "Loading..." : username}
              </span>

              <FaChevronDown className="text-slate-400 text-sm" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white shadow-2xl border overflow-hidden animate-fadeIn">

                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 text-slate-700"
                >
                  <FaUserCircle />
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600"
                >
                  <FiLogOut />
                  Logout
                </button>

              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}