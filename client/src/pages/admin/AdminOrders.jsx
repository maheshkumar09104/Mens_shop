import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import AdminLayout from "./AdminLayout";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsDelivered = async (id) => {
    try {
      const { data } = await api.put(`/orders/${id}/deliver`);
      setOrders((current) => current.map((order) => (order._id === data._id ? data : order)));
      toast.success("Order marked as delivered");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update order");
    }
  };

  return (
    <AdminLayout title="Orders" subtitle="Review order status and mark completed shipments as delivered.">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-black text-[#1a2e4a]">Order Management</h2>
          <p className="mt-1 text-sm text-slate-600">{loading ? "Loading..." : `${orders.length} orders`}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Paid</th>
                <th className="px-5 py-4">Delivered</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#1a2e4a]">{order.user?.name || "Customer"}</p>
                    <p className="text-xs text-slate-500">{order.user?.email || order.user}</p>
                  </td>
                  <td className="px-5 py-4 font-bold">${Number(order.totalPrice || 0).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        order.isPaid ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        order.isDelivered ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => markAsDelivered(order._id)}
                      disabled={order.isDelivered}
                      className="rounded-md bg-[#1a2e4a] px-4 py-2 font-bold text-white transition hover:bg-[#233d62] disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;
