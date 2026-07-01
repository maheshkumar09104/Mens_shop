import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FaBars,
  FaHeart,
  FaSignOutAlt,
  FaShoppingBag,
  FaShoppingCart,
  FaTimes,
  FaUser,
  FaUserCircle
} from "react-icons/fa";
import useAuthStore from "../store/authStore.js";
import useCartStore from "../store/cartStore";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isAdmin, logout } = useAuthStore();
  const cartCount = useCartStore((state) =>
    state.cartItems.reduce((total, item) => total + item.quantity, 0)
  );

  const closeMenu = () => setMenuOpen(false);
  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${isActive ? "text-amber-300" : "text-white/85 hover:text-white"}`;

  const logoutAndClose = () => {
    logout();
    closeMenu();
  };
  const isAuthPage = ["/login", "/register", "/admin/login"].includes(pathname);
  const isLandingPage = pathname === "/" && !user;
  const isMinimalPage = isAuthPage || isLandingPage;
  const authLink =
    pathname === "/admin/login"
      ? { to: "/login", label: "Customer Login" }
      : { to: "/admin/login", label: "Admin Login" };

  return (
    <header className="border-b border-amber-300/30 bg-[#0B1F3A] text-white shadow-sm">
      <nav className="page-shell py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-xl font-black tracking-wide">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-amber-300 text-amber-300">
              <FaShoppingBag />
            </span>
            Focus Mens shop
          </Link>

          {!isMinimalPage && (
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="grid h-10 w-10 place-items-center rounded-md border border-white/20 md:hidden"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}

          <div className="hidden items-center gap-5 md:flex">
            {isLandingPage ? null : isAuthPage ? (
              <NavLink
                to={authLink.to}
                className="inline-flex items-center gap-2 rounded-md border border-amber-300 px-3 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-300 hover:text-[#0B1F3A]"
              >
                <FaUser /> {authLink.label}
              </NavLink>
            ) : isAdmin ? (
              <>
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
                <button
                  type="button"
                  onClick={logoutAndClose}
                  className="inline-flex items-center gap-2 rounded-md border border-amber-300 px-3 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-300 hover:text-[#0B1F3A]"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
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
                {user && (
                  <NavLink to="/profile" className="text-white/85 transition hover:text-white">
                    <FaUserCircle aria-label="Profile" size={22} />
                  </NavLink>
                )}
                {user ? (
                  <button
                    type="button"
                    onClick={logoutAndClose}
                    className="inline-flex items-center gap-2 rounded-md border border-amber-300 px-3 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-300 hover:text-[#0B1F3A]"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-md border border-amber-300 px-3 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-300 hover:text-[#0B1F3A]"
                  >
                    <FaUser /> Customer Login
                  </NavLink>
                )}
              </>
            )}
          </div>
        </div>

        {isAuthPage && (
          <div className="mt-4 md:hidden">
            <NavLink
              to={authLink.to}
              onClick={closeMenu}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-amber-300 px-3 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-300 hover:text-[#0B1F3A]"
            >
              <FaUser /> {authLink.label}
            </NavLink>
          </div>
        )}

        {!isMinimalPage && menuOpen && (
          <div className="mt-4 grid gap-3 rounded-lg border border-white/10 bg-white/10 p-4 md:hidden">
            {isAdmin ? (
              <>
                <NavLink to="/admin" onClick={closeMenu} className={linkClass}>
                  Admin
                </NavLink>
                <button type="button" onClick={logoutAndClose} className="text-left text-sm font-bold text-amber-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" onClick={closeMenu} className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/products" onClick={closeMenu} className={linkClass}>
                  Products
                </NavLink>
                <NavLink to="/cart" onClick={closeMenu} className={linkClass}>
                  Cart ({cartCount})
                </NavLink>
                <NavLink to="/wishlist" onClick={closeMenu} className={linkClass}>
                  Wishlist
                </NavLink>
                {user && (
                  <NavLink to="/profile" onClick={closeMenu} className={linkClass}>
                    Profile
                  </NavLink>
                )}
                {user ? (
                  <button type="button" onClick={logoutAndClose} className="text-left text-sm font-bold text-amber-200">
                    Logout
                  </button>
                ) : (
                  <>
                    <NavLink to="/login" onClick={closeMenu} className={linkClass}>
                      Customer Login
                    </NavLink>
                    <NavLink to="/admin/login" onClick={closeMenu} className={linkClass}>
                      Admin Login
                    </NavLink>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
