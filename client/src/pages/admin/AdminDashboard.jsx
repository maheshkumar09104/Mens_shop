import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaBoxOpen, FaClipboardList, FaUsers } from "react-icons/fa";
import api from "../../services/api";
import AdminLayout from "./AdminLayout";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          api.get("/products"),
          api.get("/orders")
        ]);

        setProducts(productsResponse.data);
        setOrders(ordersResponse.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalUsers = useMemo(() => {
    const users = new Set(
      orders
        .map((order) => order.user?._id || order.user)
        .filter(Boolean)
    );

    return users.size;
  }, [orders]);

  const stats = [
    { label: "Total Products", value: products.length, icon: FaBoxOpen },
    { label: "Total Orders", value: orders.length, icon: FaClipboardList },
    { label: "Total Users", value: totalUsers, icon: FaUsers }
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Monitor store activity, product inventory, and customer orders.">
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-3 text-4xl font-black text-[#1a2e4a]">{loading ? "--" : value}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-md bg-[#1a2e4a] text-[#c9a84c]">
                <Icon size={22} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
