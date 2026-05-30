import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import formatCurrency from "../utils/formatCurrency";

function OrderConfirmationPage() {
  const { state } = useLocation();
  const storedOrder = JSON.parse(localStorage.getItem("mensShopLastOrder") || "null");
  const order = state?.order || storedOrder;
  const items = order?.orderItems || [];

  return (
    <section className="mx-auto max-w-4xl px-1 sm:px-0">
      <div className="rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-8">
        <FaCheckCircle className="mx-auto text-5xl text-emerald-500" />
        <p className="mt-5 text-sm font-bold uppercase tracking-wide text-[#c9a84c]">Order Confirmed</p>
        <h1 className="mt-2 text-2xl font-black text-[#1a2e4a] sm:text-4xl">Thank you for shopping with Mens Shop</h1>
        <p className="mt-3 text-slate-600">Order ID: {order?._id || "Pending"}</p>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-black text-[#1a2e4a]">Ordered Items</h2>
        </div>

        <div className="divide-y divide-slate-200">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item._id || item.product} className="grid gap-4 p-5 sm:grid-cols-[80px_1fr_auto] sm:items-center">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"}
                  alt={item.name}
                  className="h-20 w-20 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-black text-[#1a2e4a]">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-black text-[#1a2e4a]">{formatCurrency(Number(item.price || 0) * item.quantity)}</p>
              </div>
            ))
          ) : (
            <p className="p-5 text-center text-slate-600">No order items found.</p>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-black text-[#1a2e4a]">Total: {formatCurrency(order?.totalPrice || 0)}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/products" className="rounded-md bg-[#c9a84c] px-5 py-3 text-center font-black text-[#1a2e4a]">
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="rounded-md border border-[#1a2e4a] px-5 py-3 text-center font-bold text-[#1a2e4a]"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderConfirmationPage;
