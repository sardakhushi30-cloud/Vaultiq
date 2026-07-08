import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/");

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setUsername(data.username);
        setEmail(data.email);
        setProfilePic(data.profilePic || "");
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Profile updated");
      setEdit(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    if (!image) return toast.error("Choose an image");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("profilePic", image);

      const res = await fetch(
        "http://localhost:5000/api/user/upload-profile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProfilePic(data.image || "");
      setImage(null);
      toast.success("Photo updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/user/remove-profile-picture",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProfilePic("");
      toast.success("Photo removed");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async () => {
    if (!window.confirm("Delete account permanently?")) return;

    const res = await fetch("http://localhost:5000/api/user/delete", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      localStorage.removeItem("token");
      navigate("/");
      toast.success("Account deleted");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">

      {/* ================= HERO ================= */}
      <div className="rounded-3xl p-8 bg-linear-to-r from-slate-900 via-violet-900 to-slate-800 text-white shadow-xl">

        <p className="text-xs tracking-[0.3em] uppercase text-cyan-300">
          Account Settings
        </p>

        <h1 className="text-3xl font-bold mt-2">
          Manage Your Profile
        </h1>

        <p className="text-sm text-white/70 mt-2 max-w-2xl">
          Update your identity, manage security, and control your account preferences.
        </p>

      </div>

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">

        {/* TOP PROFILE */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="flex items-center gap-4">

            {/* AVATAR */}
            <div className="h-16 w-16 rounded-full bg-linear-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden ring-4 ring-slate-100">

              {profilePic ? (
                <img
                  src={
                    profilePic.startsWith("http")
                      ? profilePic
                      : `http://localhost:5000${profilePic}`
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                username?.charAt(0).toUpperCase() || "U"
              )}

            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {username}
              </h2>
              <p className="text-sm text-slate-500">{email}</p>
            </div>

          </div>

          <button
            onClick={() => setEdit(!edit)}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm hover:bg-slate-200 transition"
          >
            {edit ? "Cancel Edit" : "Edit Profile"}
          </button>

        </div>

        {/* UPLOAD SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="flex gap-2">

            <button
              onClick={uploadImage}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm hover:bg-emerald-600"
            >
              Upload
            </button>

            <button
              onClick={removeImage}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-sm hover:bg-slate-300"
            >
              Remove
            </button>

          </div>

        </div>

        {/* INPUTS */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            value={username}
            disabled={!edit}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-cyan-200 outline-none"
          />

          <input
            value={email}
            disabled={!edit}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-cyan-200 outline-none"
          />

        </div>

        {edit && (
          <button
            onClick={handleUpdate}
            className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-500 to-violet-600 text-white font-semibold hover:scale-[1.01] transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        )}

      </div>

      {/* ================= DANGER ZONE ================= */}
      <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-rose-600">
          Danger Zone
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Permanently delete your account and all associated data.
        </p>

        <div className="flex gap-3 mt-4">

          <button
            onClick={deleteProfile}
            className="px-5 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600"
          >
            Delete Account
          </button>

          <button
            onClick={logout}
            className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}