import { Link, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaShoppingBag, FaTrash } from "react-icons/fa";
import useCartStore from "../store/cartStore";
import formatCurrency from "../utils/formatCurrency";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
  const total = subtotal;

  const handleCheckout = () => {
    const order = {
      _id: `ORD-${Date.now()}`,
      orderItems: cartItems,
      totalPrice: total,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("mensShopLastOrder", JSON.stringify(order));
    clearCart();
    navigate("/order-confirmation", { state: { order } });
  };

  return (
    <section className="space-y-8">
      <div className="rounded-lg bg-[#1a2e4a] px-6 py-8 text-white shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-[#c9a84c]">Mens Shop Checkout</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">Shopping Cart</h1>
        <p className="mt-2 text-white/75">Review your selections before placing your order.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#1a2e4a] text-[#c9a84c]">
            <FaShoppingBag size={22} />
          </div>
          <h2 className="mt-5 text-2xl font-black text-[#1a2e4a]">Your cart is empty</h2>
          <p className="mt-2 text-slate-600">Add a few classic essentials and they will appear here.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-md bg-[#1a2e4a] px-5 py-3 font-bold text-white transition hover:bg-[#233d62]"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-bold text-[#1a2e4a]">{cartItems.length} item{cartItems.length === 1 ? "" : "s"}</p>
              <button type="button" onClick={clearCart} className="text-sm font-bold text-red-600 hover:text-red-700">
                Clear Cart
              </button>
            </div>

            {cartItems.map((item) => (
              <article key={item._id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-[112px_1fr_auto] sm:items-center">
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=500&q=80"
                    }
                    alt={item.name}
                    className="h-28 w-28 rounded-md object-cover"
                  />

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#c9a84c]">
                      {item.category || "Menswear"}
                    </p>
                    <h2 className="mt-1 text-lg font-black text-[#1a2e4a]">{item.name}</h2>
                    <p className="mt-2 text-sm font-bold text-slate-700">{formatCurrency(item.price)}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="flex h-10 items-center overflow-hidden rounded-md border border-slate-300">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="grid h-10 w-10 place-items-center text-[#1a2e4a] transition hover:bg-slate-100"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus size={12} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item._id, event.target.value)}
                        className="h-10 w-14 border-x border-slate-300 text-center font-bold text-[#1a2e4a] outline-none"
                        aria-label="Quantity"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="grid h-10 w-10 place-items-center text-[#1a2e4a] transition hover:bg-slate-100"
                        aria-label="Increase quantity"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#1a2e4a]">Order Summary</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-[#1a2e4a]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-bold text-[#1a2e4a]">Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-black text-[#1a2e4a]">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-6 w-full rounded-md bg-[#c9a84c] px-5 py-3 font-black text-[#1a2e4a] transition hover:bg-[#d6b85f]"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/products"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-[#1a2e4a] px-5 py-3 font-bold text-[#1a2e4a] transition hover:bg-[#1a2e4a] hover:text-white"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default CartPage;
