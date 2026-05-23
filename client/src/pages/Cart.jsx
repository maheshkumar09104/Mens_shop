import { FaTrash } from "react-icons/fa";
import useCartStore from "../store/cartStore";

function Cart() {
  const { items, removeItem, clearCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="page-shell py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-copper">Checkout</p>
          <h1 className="text-3xl font-black">Shopping Cart</h1>
        </div>
        {items.length > 0 && (
          <button type="button" onClick={clearCart} className="rounded-md border px-4 py-2 text-sm font-bold">
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-slate-600">
          Your cart is empty.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex gap-4 rounded-lg border border-stone-200 bg-white p-4">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-md object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="font-black">{item.name}</h2>
                    <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold">${item.price * item.quantity}</p>
                </div>
                <button type="button" onClick={() => removeItem(item._id)} className="text-red-600">
                  <FaTrash aria-label="Remove item" />
                </button>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-black">Order Summary</h2>
            <div className="mt-4 flex justify-between border-t pt-4 font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="mt-5 w-full rounded-md bg-copper px-4 py-3 font-bold text-white">
              Checkout
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;
