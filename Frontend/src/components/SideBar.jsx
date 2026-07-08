import {
  MdDashboard,
  MdNotificationsActive,
} from "react-icons/md";
import { FaWallet, FaBullseye, FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
    { name: "Expenses", icon: <FaWallet />, path: "/expenses" },
    { name: "Budget", icon: <FaBullseye />, path: "/budget" },
    { name: "Reminders", icon: <MdNotificationsActive />, path: "/reminders" },
    { name: "Profile", icon: <FaUserCircle />, path: "/profile" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col border-r border-white/10 shadow-2xl">

      {/* HEADER / LOGO */}
     {/* ===================== BRAND LOGO ===================== */}

<div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6">

  {/* Background Glow */}
  <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl"></div>
  <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl"></div>

  <div className="relative flex items-center gap-4">

    {/* Logo */}
    <div className="relative">

      {/* Glow */}
      <div className="absolute inset-0 rounded-3xl bg-cyan-400 blur-xl opacity-50"></div>

      <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 shadow-[0_15px_35px_rgba(34,211,238,0.45)] transition-all duration-500 hover:rotate-6 hover:scale-110">

        <span className="text-3xl">💰</span>

      </div>

    </div>

    {/* Brand Name */}
    <div>

      <h1 className="bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-2xl font-extrabold tracking-wide text-transparent">

        Vaultiq

      </h1>

      <p className="mt-1 text-xs font-medium uppercase tracking-[0.35em] text-cyan-300">

        Smart Finance Platform

      </p>

    </div>

  </div>

</div>
      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 overflow-hidden
              
              ${
                isActive
                  ? "bg-white/10 text-white shadow-md"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {/* ACTIVE LEFT INDICATOR */}
            <span
              className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-linear-to-b from-cyan-400 to-violet-500 scale-y-0 group-[.active]:scale-y-100 transition-transform"
            />

            {/* ICON */}
            <span className="text-lg transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </span>

            {/* LABEL */}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/10">

        {/* USER INFO BLOCK (optional SaaS touch) */}
        <div className="mb-3 p-3 rounded-xl bg-white/5 text-xs text-slate-400">
          Manage your finances smartly 🚀
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300 hover:scale-[1.02]"
        >
          <FiLogOut />
          Logout
        </button>
      </div>

    </aside>
  );
}