import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);
      const { token, ...user } = data;

      if (user.role === "admin") {
        toast.error("Please use the Admin Login page.");
        navigate("/admin/login");
        return;
      }

      login(user, token);
      toast.success("Welcome back to Focus Mens shop");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center py-10">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-lg">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-[#c9a84c]">Account Access</p>
          <h1 className="mt-2 text-3xl font-black text-[#1a2e4a]">Login</h1>
          <p className="mt-3 text-sm text-slate-600">Sign in to manage your cart, wishlist, and orders.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-bold text-[#1a2e4a]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-bold text-[#1a2e4a]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#1a2e4a] px-5 py-3 font-bold text-white transition hover:bg-[#233d62] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to Focus Mens shop?{" "}
          <Link to="/register" className="font-bold text-[#1a2e4a] underline decoration-[#c9a84c] underline-offset-4">
            Create an account
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-slate-600">
          Admin?{" "}
          <Link to="/admin/login" className="font-bold text-[#1a2e4a] underline decoration-[#c9a84c] underline-offset-4">
            Go to Admin Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
