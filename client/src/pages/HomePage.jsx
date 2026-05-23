import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="grid gap-8 rounded-lg bg-[#0B1F3A] p-8 text-white shadow-sm lg:grid-cols-[1fr_360px]">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-wide text-amber-300">Classic menswear</p>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">Mens Shop</h1>
        <p className="mt-5 text-lg leading-8 text-white/75">
          A professional shopping experience for shirts, t-shirts, pants, shoes, and accessories.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-flex rounded-md bg-amber-300 px-5 py-3 font-bold text-[#0B1F3A] transition hover:bg-amber-200"
        >
          Browse Products
        </Link>
      </div>
      <div className="rounded-lg border border-white/15 bg-white/10 p-6">
        <p className="text-sm font-bold text-amber-200">Featured Categories</p>
        <div className="mt-4 grid gap-3">
          {["T-Shirts", "Shirts", "Pants", "Shoes", "Accessories"].map((category) => (
            <div key={category} className="rounded-md bg-white px-4 py-3 font-bold text-[#0B1F3A]">
              {category}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
