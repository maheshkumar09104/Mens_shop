import { Link, NavLink } from "react-router-dom";
import { FaHeart, FaSignOutAlt, FaShoppingBag, FaShoppingCart, FaUser } from "react-icons/fa";
import useAuthStore from "../store/authStore.js";
import useCartStore from "../store/cartStore";

function Navbar() {
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore((state) =>
    state.cartItems.reduce((total, item) => total + item.quantity, 0)
  );

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive ? "text-amber-300" : "text-white/85 hover:text-white"
    }`;

  return (
    <header className="border-b border-amber-300/30 bg-[#0B1F3A] text-white shadow-sm">
      <nav className="page-shell flex min-h-16 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-wide">
          <span className="grid h-10 w-10 place-items-center rounded-md border border-amber-300 text-amber-300">
            <FaShoppingBag />
          </span>
          Mens Shop
        </Link>
        <div className="flex flex-wrap items-center gap-5">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className="relative text-white/85 transition hover:text-white">
            <FaShoppingCart aria-label="Cart" size={21} />
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-3 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-xs font-bold text-[#0B1F3A]">
                {cartCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/wishlist" className="text-white/85 transition hover:text-white">
            <FaHeart aria-label="Wishlist" size={20} />
          </NavLink>
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md border border-amber-300 px-3 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-300 hover:text-[#0B1F3A]"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="inline-flex items-center gap-2 rounded-md border border-amber-300 px-3 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-300 hover:text-[#0B1F3A]"
            >
              <FaUser /> Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
