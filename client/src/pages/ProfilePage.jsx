import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import formatCurrency from "../utils/formatCurrency";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, hasLoaded, logout, updateUser } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!hasLoaded) {
    return <div className="py-10 text-center font-bold text-[#1a2e4a]">Loading profile...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSaveName = (event) => {
    event.preventDefault();
    updateUser({ name: name.trim() || user.name });
    setEditing(false);
    toast.success("Profile updated");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="space-y-6 px-1 sm:px-0">
      <div className="rounded-lg bg-[#1a2e4a] px-4 py-7 text-white shadow-sm sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <FaUserCircle className="text-5xl text-[#c9a84c]" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#c9a84c]">My Account</p>
              <h1 className="mt-1 text-2xl font-black sm:text-4xl">{user.name}</h1>
              <p className="mt-1 text-white/75">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-4 py-3 font-bold text-white transition hover:bg-white/10"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#1a2e4a]">Profile</h2>
            <button
              type="button"
              onClick={() => setEditing((current) => !current)}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#c9a84c]"
            >
              <FaEdit /> Edit
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSaveName} className="mt-5 space-y-4">
              <div>
                <label htmlFor="profile-name" className="text-sm font-bold text-[#1a2e4a]">
                  Name
                </label>
                <input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
                />
              </div>
              <button type="submit" className="w-full rounded-md bg-[#c9a84c] px-4 py-3 font-black text-[#1a2e4a]">
                Save Profile
              </button>
            </form>
          ) : (
            <div className="mt-5 space-y-3 text-sm">
              <p>
                <span className="font-bold text-[#1a2e4a]">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-bold text-[#1a2e4a]">Email:</span> {user.email}
              </p>
            </div>
          )}
        </aside>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-black text-[#1a2e4a]">My Orders</h2>
          </div>

          {loading ? (
            <p className="p-5 text-slate-600">Loading orders...</p>
          ) : orders.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {orders.map((order) => (
                <article key={order._id} className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-black text-[#1a2e4a]">Order {order._id}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                        order.isDelivered ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {order.orderItems?.map((item) => `${item.name} x ${item.quantity}`).join(", ")}
                  </p>
                  <p className="mt-3 font-black text-[#1a2e4a]">{formatCurrency(order.totalPrice)}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="font-bold text-slate-600">No orders yet. Start shopping!</p>
              <Link
                to="/products"
                className="mt-5 inline-flex rounded-md bg-[#1a2e4a] px-5 py-3 font-bold text-white"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
