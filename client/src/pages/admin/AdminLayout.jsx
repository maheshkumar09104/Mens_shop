import { NavLink, Navigate } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaTachometerAlt } from "react-icons/fa";
import useAuthStore from "../../store/authStore";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/admin/products", label: "Products", icon: FaBoxOpen },
  { to: "/admin/orders", label: "Orders", icon: FaClipboardList }
];

function AdminLayout({ title, subtitle, children }) {
  const { hasLoaded, isAdmin } = useAuthStore();

  if (!hasLoaded) {
    return <div className="py-10 text-center font-bold text-[#1a2e4a]">Loading admin area...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="grid min-h-[680px] lg:grid-cols-[260px_1fr]">
        <aside className="bg-[#1a2e4a] p-4 text-white sm:p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#c9a84c]">Focus Mens shop</p>
            <h2 className="mt-2 text-2xl font-black">Admin</h2>
          </div>

          <nav className="mt-6 grid gap-2 sm:grid-cols-3 lg:mt-8 lg:block lg:space-y-2">
            {adminLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-[#c9a84c] text-[#1a2e4a]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="bg-slate-50 p-4 sm:p-6">
          <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-[#c9a84c]">Admin Panel</p>
            <h1 className="mt-2 text-2xl font-black text-[#1a2e4a] sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
          </header>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default AdminLayout;
