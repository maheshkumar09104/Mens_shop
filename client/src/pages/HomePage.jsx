import { Link, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function HomePage() {
  const { hasLoaded, user, isAdmin } = useAuthStore();

  if (!hasLoaded) {
    return <div className="py-10 text-center font-bold text-[#1a2e4a]">Loading...</div>;
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (user) {
    return <Navigate to="/products" replace />;
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-150px)] max-w-4xl place-items-center rounded-lg bg-[#0B1F3A] px-4 py-12 text-center text-white shadow-sm">
      <div>
        <h1 className="text-4xl font-black sm:text-5xl md:text-6xl">Focus Mens shop</h1>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/admin/login"
            className="rounded-md bg-[#c9a84c] px-6 py-3 font-black text-[#0B1F3A] transition hover:bg-[#d8bd67]"
          >
            Admin Login
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-[#c9a84c] px-6 py-3 font-black text-[#c9a84c] transition hover:bg-[#c9a84c] hover:text-[#0B1F3A]"
          >
            Customer Login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
